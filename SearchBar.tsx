"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ path: string; size: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?query=${query}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search files..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Searching...</p>}

      <ul>
        {results.map((res, idx) => (
          <li key={idx}>
            <strong>{res.path}</strong> - {res.size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
}
