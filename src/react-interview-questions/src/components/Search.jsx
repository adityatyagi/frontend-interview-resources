import React, { useState, useCallback, useRef, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import SimpleProductGrid from './SimpleProductGrid';
import './Search.css';

// LRU Cache Implementation
class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  set(key, value) {
    // If key exists, remove it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If at capacity, remove least recently used (first item)
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Add to end (most recently used)
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

const Search = () => {
  // State management
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  // Refs for accessibility and performance
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const currentRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  // Proper LRU Cache for suggestions
  const suggestionCache = useRef(new LRUCache(50)); // Max 50 cached queries

  // Constants
  const DEBOUNCE_DELAY = 300;
  const MAX_RECENT_SEARCHES = 10;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches) => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }, []);

  // Add search to recent searches (MRU pattern)
  const addToRecentSearches = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== searchTerm);
      const updated = [searchTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(updated);
      return updated;
    });
  }, [saveRecentSearches]);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    // Check cache first
    const cacheKey = searchQuery.toLowerCase();
    const cached = suggestionCache.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setSuggestions(cached.data);
      setIsDropdownOpen(true);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const requestId = ++currentRequestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      
      const response = await fetch(`https://rickandmortyapi.com/api/character?name=${encodeURIComponent(searchQuery)}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if this is still the latest request
      if (requestId !== currentRequestIdRef.current) {
        return; // Stale request, ignore
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the result (LRU will handle eviction if needed)
      suggestionCache.current.set(cacheKey, {
        data: data.results,
        timestamp: Date.now()
      });

      setSuggestions(data.results);
      setIsDropdownOpen(true);
      setSelectedIndex(-1);

      // Measure and log latency
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      // Log to analytics (in real app, send to monitoring service)
      console.log('Suggest latency:', latency);
      if (latency > 100) {
        console.warn('High suggest latency detected:', latency);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }
      
      if (requestId === currentRequestIdRef.current) {
        setError('Failed to fetch suggestions');
        console.error('Search error:', error);
      }
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, DEBOUNCE_DELAY);
  }, [fetchSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setIsDropdownOpen(false);
    addToRecentSearches(suggestion);
    
    // Trigger search (in real app, navigate to results page)
    console.log('Searching for:', suggestion);
  }, [addToRecentSearches]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          addToRecentSearches(query);
          console.log('Searching for:', query);
        }
        break;
      
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isDropdownOpen, suggestions, selectedIndex, query, handleSuggestionClick, addToRecentSearches]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      addToRecentSearches(query);
      console.log('Searching for:', query);
    }
  }, [query, addToRecentSearches]);

  // Focus management for accessibility
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

      return (
      <>
        <div className="search-container" ref={dropdownRef}>
          <form onSubmit={handleSubmit} role="search">
            <div className="search-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0 || recentSearches.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                placeholder="Search products..."
                aria-label="Search products"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                role="combobox"
                className="search-input"
                autoComplete="off"
                spellCheck="false"
              />
              
              {isLoading && (
                <div className="search-spinner" aria-hidden="true">
                  <div className="spinner"></div>
                </div>
              )}
              
              {error && (
                <div className="search-error" role="alert">
                  {error}
                </div>
              )}
            </div>

            {isDropdownOpen && (
              <div 
                id="search-suggestions"
                className="search-dropdown"
                role="listbox"
                aria-label="Search suggestions"
              >
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <div className="section-title">Suggestions</div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion}
                        className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        role="option"
                        aria-selected={index === selectedIndex}
                        tabIndex={-1}
                      >
                        {suggestion.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent searches */}
                {recentSearches.length > 0 && suggestions.length === 0 && (
                  <div className="recent-searches-section">
                    <div className="section-title">Recent searches</div>
                    {recentSearches.map((search, index) => (
                      <div
                        key={search}
                        className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleSuggestionClick(search)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        role="option"
                        aria-selected={index === selectedIndex}
                        tabIndex={-1}
                      >
                        {search}
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {suggestions.length === 0 && recentSearches.length === 0 && query.trim() && !isLoading && (
                  <div className="no-results">
                    No suggestions found for "{query}"
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        
        {/* Simple version for interview demonstration */}
        <SimpleProductGrid />
        
        {/* Full version with all features */}
        {/* <ProductGrid/> */}
      </>
    );
};

export default Search;