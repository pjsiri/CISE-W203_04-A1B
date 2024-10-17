import { useState, useEffect } from "react";
import styles from '../../styles/SearchPage.module.scss'

interface SearchResult {
  _id: number;
  title: string;
  authors: string;
  source: string;
  pubYear: number;
  volume: string;
  number: string;
  pages: string;
  doi: string;
  summary: string;
  status: string; // 'approved', 'rejected', 'pending_moderation'
  seMethod: string;
  averageRating: number;
  totalRating: number;
  numberOfRatings: number;
}

interface SavedSearch {
  seMethod: string;
  startYear: number | null;
  endYear: number | null;
}

const SearchPage = () => {
  const [method, setMethod] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [seMethods, setSeMethods] = useState<string[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

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
        },
      ];
      setSavedSearches(newSavedSearches);
      localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
    }
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
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Authors</th>
              <th className={styles.th}>Source</th>
              <th className={styles.th}>Year</th>
              <th className={styles.th}>Volume</th>
              <th className={styles.th}>Number</th>
              <th className={styles.th}>Pages</th>
              <th className={styles.th}>DOI</th>
              <th className={styles.th}>Summary</th>
              <th className={styles.th}>SE Method</th>
              <th className={styles.th}>Average Rating</th>
              <th className={styles.th}>Add Rating</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id} className={styles.tr}>
                <td className={styles.td}>{result.title}</td>
                <td className={styles.td}>{result.authors}</td>
                <td className={styles.td}>{result.source}</td>
                <td className={styles.td}>{result.pubYear}</td>
                <td className={styles.td}>{result.volume}</td>
                <td className={styles.td}>{result.number}</td>
                <td className={styles.td}>{result.pages}</td>
                <td className={styles.td}>{result.doi}</td>
                <td className={styles.td}>{result.summary}</td>
                <td className={styles.td}>{result.seMethod}</td>
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
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.savedContainer}>
        <h2 className={styles.savedTitle}>Saved Searches</h2>
        <div className={styles.savedList}>
          {savedSearches.map((search, index) => (
            <div key={index} className={styles.savedItem}>
              <p>SE Method: {search.seMethod}</p>
              <p>Start Year: {search.startYear}</p>
              <p>End Year: {search.endYear}</p>
              <button className={styles.button} onClick={() => handleSavedSearch(search.seMethod, search.startYear ?? 0, search.endYear ?? 0)}>
                Search
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;