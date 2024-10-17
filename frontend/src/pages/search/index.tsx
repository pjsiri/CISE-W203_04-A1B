import { useState, useEffect } from "react";
import styles from '../../styles/SearchPage.module.scss'

interface SearchResult {
  _id: number;
  title: string;
  authors: string;
  pubYear: number;
  source: string;
  seMethod: string;
  claim: string;
  evidenceResult: string; // e.g., 'agree' or 'disagree'
  researchType: string; // e.g., 'case study', 'experiment'
  participantType: string; // e.g., 'student', 'practitioner'
  averageRating: number;
  totalRating: number;
  numberOfRatings: number;
  status: string; // e.g., 'approved', 'pending'
  summary: string; // Add summary field
}

interface SavedSearch {
  seMethod: string;
  startYear: number | null;
  endYear: number | null;
  timestamp: number;
}

const SearchPage = () => {
  const [method, setMethod] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [seMethods, setSeMethods] = useState<string[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [resultsSortOrder, setResultsSortOrder] = useState<"asc" | "desc">("asc");
  const [resultsSortColumn, setResultsSortColumn] = useState<keyof SearchResult>("pubYear");
  const [savedSearchesSortOrder, setSavedSearchesSortOrder] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    authors: true,
    pubYear: true,
    source: true,
    seMethod: true,
    claim: true,
    evidenceResult: true,
    researchType: true,
    participantType: true,
  });
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchSeMethods = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/distinct-se-methods`);
        const data = await response.json();
        setSeMethods(data);
      } catch (error) {
        console.error("Error fetching SE methods:", error);
      }
    };

    fetchSeMethods();
  }, []);

  useEffect(() => {
    const savedSearches = localStorage.getItem('savedSearches');
    if (savedSearches) {
      setSavedSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        method,
        startYear: startYear || "",
        endYear: endYear || "",
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Search results:', data); // Logging to verify the response
      const approvedResults = data.filter((result: SearchResult) => result.status === "approved");
      setResults(approvedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSaveSearch = () => {
    const existingSearch = savedSearches.find(
      (search) =>
        search.seMethod === method &&
        search.startYear === (startYear ? parseInt(startYear) : null) &&
        search.endYear === (endYear ? parseInt(endYear) : null)
    );

    if (!existingSearch) {
      const newSavedSearches = [
        ...savedSearches,
        {
          seMethod: method,
          startYear: startYear ? parseInt(startYear) : null,
          endYear: endYear ? parseInt(endYear) : null,
          timestamp: Date.now(), // Current timestamp for sorting
        },
      ];
      setSavedSearches(newSavedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
    }
  };

  const handleRemoveSavedSearch = (timestamp: number) => {
    const newSavedSearches = savedSearches.filter(search => search.timestamp !== timestamp);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
  };

  const handleRatingChange = (id: number, rating: number) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const handleRatingSubmit = async (id: string) => {
    try {
      const rating = ratings[id];
      if (rating) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}/rate`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating }),
        });
        handleSearch(); // Refresh the search results to show updated ratings
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleSavedSearch = async (seMethod: string, startYear: number, endYear: number) => {
    setMethod(seMethod);
    setStartYear(startYear ? startYear.toString() : "");
    setEndYear(endYear ? endYear.toString() : "");
    await handleSearch();
  };

  const handleSortResults = (column: keyof SearchResult) => {
    setResultsSortColumn(column);
    setResultsSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedResults = [...results].sort((a, b) => {
    if (resultsSortOrder === "asc") {
      return a[resultsSortColumn] > b[resultsSortColumn] ? 1 : -1;
    } else {
      return a[resultsSortColumn] < b[resultsSortColumn] ? 1 : -1;
    }
  });

  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prevColumns) => ({
      ...prevColumns,
      [column]: !prevColumns[column],
    }));
  };

  const handleSortSavedSearches = () => {
    setSavedSearchesSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedSavedSearches = [...savedSearches].sort((a, b) => {
    if (savedSearchesSortOrder === "asc") {
      return a.timestamp - b.timestamp;
    } else {
      return b.timestamp - a.timestamp;
    }
  });

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Search SPEED Database</h1>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          SE Method:
          <select className={styles.select} value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select a method</option>
            {seMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Start Year:
          <input
            className={styles.input}
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          End Year:
          <input
            className={styles.input}
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </label>
      </div>
      <button className={styles.button} onClick={handleSearch}>Search</button>
      <button className={styles.button} onClick={handleSaveSearch}>Save Search</button>
      <p className={styles.sortInstructions}>Click on the headings of the table (eg. Title) to sort the results. Click on a row in the table to show the summary.</p>
      <div className={styles.columnVisibility}>
        <h3>Toggle Column Visibility On/Off</h3>
        {Object.keys(visibleColumns).map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              checked={visibleColumns[column as keyof typeof visibleColumns]}
              onChange={() => toggleColumnVisibility(column as keyof typeof visibleColumns)}
            />
            {column}
          </label>
        ))}
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.title && <th className={styles.th} onClick={() => handleSortResults('title')}>Title</th>}
              {visibleColumns.authors && <th className={styles.th} onClick={() => handleSortResults('authors')}>Authors</th>}
              {visibleColumns.pubYear && <th className={styles.th} onClick={() => handleSortResults('pubYear')}>Year</th>}
              {visibleColumns.source && <th className={styles.th} onClick={() => handleSortResults('source')}>Source</th>}
              {visibleColumns.seMethod && <th className={styles.th} onClick={() => handleSortResults('seMethod')}>SE Method</th>}
              {visibleColumns.claim && <th className={styles.th} onClick={() => handleSortResults('claim')}>Claim</th>}
              {visibleColumns.evidenceResult && <th className={styles.th} onClick={() => handleSortResults('evidenceResult')}>Evidence Result</th>}
              {visibleColumns.researchType && <th className={styles.th} onClick={() => handleSortResults('researchType')}>Research Type</th>}
              {visibleColumns.participantType && <th className={styles.th} onClick={() => handleSortResults('participantType')}>Participant Type</th>}
              <th className={styles.th}>Average Rating</th>
              <th className={styles.th}>Add Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => (
              <>
                <tr key={result._id} className={styles.tr} onClick={() => toggleRowExpansion(result._id)}>
                  {visibleColumns.title && <td className={styles.td}>{result.title}</td>}
                  {visibleColumns.authors && <td className={styles.td}>{result.authors}</td>}
                  {visibleColumns.pubYear && <td className={styles.td}>{result.pubYear}</td>}
                  {visibleColumns.source && <td className={styles.td}>{result.source}</td>}
                  {visibleColumns.seMethod && <td className={styles.td}>{result.seMethod}</td>}
                  {visibleColumns.claim && <td className={styles.td}>{result.claim}</td>}
                  {visibleColumns.evidenceResult && <td className={styles.td}>{result.evidenceResult}</td>}
                  {visibleColumns.researchType && <td className={styles.td}>{result.researchType}</td>}
                  {visibleColumns.participantType && <td className={styles.td}>{result.participantType}</td>}
                  <td className={styles.td}>{result.averageRating.toFixed(2)} <br /> ({result.numberOfRatings} ratings)</td>
                  <td className={styles.td}>
                    <select
                      className={styles.rating}
                      value={ratings[result._id] || ""}
                      onChange={(e) => handleRatingChange(result._id, parseInt(e.target.value, 10))}
                    >
                      <option value="">Rate from 1 to 5</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                    <button className={styles.button} onClick={() => handleRatingSubmit(result._id.toString())}>
                      Submit
                    </button>
                  </td>
                </tr>
                {expandedRows[result._id] && (
                  <tr key={`${result._id}-summary`} className={styles.tr}>
                    <td className={styles.td} colSpan={Object.keys(visibleColumns).length + 2}>
                      <div className={styles.summary}>
                        <strong>Analyst Summary:</strong> {result.summary}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.savedContainer}>
        <h2 className={styles.savedTitle}>Saved Searches</h2>
        <div className={styles.savedFilter}>
          <button className={styles.button} onClick={handleSortSavedSearches}>
            Sort by {savedSearchesSortOrder === "asc" ? "Newest" : "Oldest"}
          </button>
        </div>
        <div className={styles.savedList}>
          {sortedSavedSearches.map((search, index) => (
            <div key={index} className={styles.savedItem}>
              <p>SE Method: {search.seMethod}</p>
              <p>Start Year: {search.startYear}</p>
              <p>End Year: {search.endYear}</p>
              <button className={styles.button} onClick={() => handleSavedSearch(search.seMethod, search.startYear ?? 0, search.endYear ?? 0)}>
                Search
              </button>
              <button className={styles.button} onClick={() => handleRemoveSavedSearch(search.timestamp)}>
                Clear
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;