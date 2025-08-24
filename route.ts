const handleSearch = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append("query", query);
    rootDirs.forEach((dir) => params.append("root_dirs", dir));

    const res = await fetch(`http://127.0.0.1:8000/api/search/?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data); // <-- check in browser console
    setResults(data.results || []);
  } catch (err) {
    console.error("Fetch failed:", err);
    setResults([]);
  }
  setLoading(false);
};
