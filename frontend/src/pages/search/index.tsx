import { useState, useEffect } from "react";
import axios from "axios";

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
  seMethod: string;
  averageRating: number;
}

const SearchPage = () => {
  const [method, setMethod] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [seMethods, setSeMethods] = useState<string[]>([]);

  useEffect(() => {
    const fetchSeMethods = async () => {
      try {
        const response = await axios.get<string[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/distinct-se-methods`);
        setSeMethods(response.data);
      } catch (error) {
        console.error("Error fetching SE methods:", error);
      }
    };

    fetchSeMethods();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get<SearchResult[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/search`, {
        params: {
          method,
          startYear: startYear || undefined,
          endYear: endYear || undefined,
        },
      });
      console.log('Search results:', response.data); // Logging to verify the response
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <h1>Search SPEED Database</h1>
      <div>
        <label>
          SE Method:
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select a method</option>
            {seMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Start Year:
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          End Year:
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Source</th>
              <th>Year</th>
              <th>Volume</th>
              <th>Number</th>
              <th>Pages</th>
              <th>DOI</th>
              <th>Summary</th>
              <th>SE Method</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{result.title}</td>
                <td>{result.authors}</td>
                <td>{result.source}</td>
                <td>{result.pubYear}</td>
                <td>{result.volume}</td>
                <td>{result.number}</td>
                <td>{result.pages}</td>
                <td>{result.doi}</td>
                <td>{result.summary}</td>
                <td>{result.seMethod}</td>
                <td>{result.averageRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPage;