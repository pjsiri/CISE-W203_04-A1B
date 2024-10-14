import { useState } from "react";
import axios from "axios";

// Define the interface for the expected response data
interface SearchResult {
  // Replace these fields with the actual structure of your API response
  id: number;
  name: string;
  // Add more fields as needed
}

const SearchPage = () => {
  const [method, setMethod] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get<SearchResult[]>("/api/search", {
        params: {
          method,
          startYear,
          endYear,
        },
      });
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
            <option value="method1">Method 1</option>
            <option value="method2">Method 2</option>
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
        {results.map((result) => (
          <div key={result.id}>{result.name}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;