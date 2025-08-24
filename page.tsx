"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [rootDirs, setRootDirs] = useState<string[]>([
    "/Users/gandikota/Documents/file-chatbot/file-backend",
    "/usr/share/cups/ipptool"
  ]);
  const [results, setResults] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("query", query);
      rootDirs.forEach(dir => params.append("root_dirs", dir));

      const res = await fetch(`http://127.0.0.1:8000/api/search/?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    setLoading(false);
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
    );
  };

  return (
    <div className="container">
      <h1>🤖 AI File Search</h1>
      <input
        type="text"
        placeholder="Enter filename..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading results...</p>}

      <ul>
        {results.map(([path, size]) => (
          <li key={path}>
            {highlightMatch(path)} ({size} bytes)
          </li>
        ))}
      </ul>
    </div>
  );
}
