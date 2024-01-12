import { useEffect, useState } from "react";

export default function Header({ searchCallback }) {
  const [query, setQuery] = useState("");

  function handleSearchInputChange(e) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    searchCallback(query);
  }, [searchCallback, query]);

  return (
    <header className="horizontal-array">
      <p className="header-title">Peliculas</p>
      <input type="text" onChange={handleSearchInputChange} value={query} placeholder="Search..."></input>
    </header>
  );
}
