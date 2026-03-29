"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [searching, setSearching] = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (debounced) {
      setSearching(true);
      router.push(`/search?q=${encodeURIComponent(debounced)}`);
      setTimeout(() => setSearching(false), 300);
    }
  }, [debounced, router]);

  return (
    <div className="search-bar">
      <div className="search-bar-icon">
        {searching ? (
          <svg className="search-spinner" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
            <circle cx="9" cy="9" r="7" strokeDasharray="32" strokeDashoffset="8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
            <circle cx="7.5" cy="7.5" r="5.5" />
            <path d="M12 12l4 4" />
          </svg>
        )}
      </div>
      <input
        type="search"
        placeholder="Search videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
      {query && (
        <button className="search-bar-clear" onClick={() => { setQuery(""); router.push("/search"); }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
