'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search articles…', initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(v), 250);
    },
    [onSearch]
  );

  const clear = () => {
    setQuery('');
    onSearch('');
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search articles"
        className="w-full pl-12 pr-11 py-3.5 text-sm rounded-2xl transition-all"
        style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full transition-colors"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
