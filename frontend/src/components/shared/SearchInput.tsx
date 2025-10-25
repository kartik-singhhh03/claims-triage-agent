import { useEffect, useState, useCallback, useRef } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  clearable?: boolean;
  initialValue?: string;
  icon?: string;
}

export default function SearchInput({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  clearable = true,
  initialValue = '',
  icon = '🔍',
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleDebouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onSearch(query);
      }, debounceMs);
    },
    [debounceMs, onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleDebouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="search-input-wrapper">
      <div className="search-input-container">
        <span className="search-icon">{icon}</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          aria-label="Search"
        />
        {clearable && value && (
          <button
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
