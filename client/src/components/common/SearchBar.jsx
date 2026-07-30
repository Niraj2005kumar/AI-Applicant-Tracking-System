import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  buttonText = "Search",
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");

    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <button
        type="submit"
        className="search-btn"
      >
        {buttonText}
      </button>

      {query && (
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </form>
  );
};

export default SearchBar;