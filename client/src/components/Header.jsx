import "./Header.scss";
import { useEffect, useState } from "react";

export default function Header({ searchCallback, searchInput }) {
  const [query, setQuery] = useState("");

  function handleSearchInputChange(e) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    if (searchCallback) {
      searchCallback(query);
    }
  }, [searchCallback, query]);

  return (
    <header className="horizontal-array">
      <p className="header-title">Movies</p>
      { searchInput ?
        (<input className="search" type="text" onChange={handleSearchInputChange} value={query} placeholder="Search..."></input>) : undefined
      }
    </header>
  );
}
