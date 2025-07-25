import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import type { SuggestionItem } from "./types";
import { Suggestions } from "./Suggestions";
import { ProductGrid } from "./ProductGrid";
import RecentSearches from "./RecentSearches";

// [oldest,... ,... ,... ,... newest]
// re-orderdering
// leaset "accessed" element is removed
interface CacheEntry<V> {
  value: V;
  timestamp: number;
}

class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, CacheEntry<V>>;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // get the value
    const entry = this.cache.get(key)!;

    // delete from the current position
    this.cache.delete(key);

    // update in the new position
    this.cache.set(key, entry);

    return entry.value;
  }

  set(key: K, value: V): void {
    console.log("saving in cache", [key, value]);
    // if the key is already available, then delete it
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // check if we need to remove the oldest item
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    // update in the new position - at the end
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  has(key: K, ttl?: number): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const entry = this.cache.get(key)!;

    // Check TTL if provided
    if (ttl && Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  status(): { size: number; keys: K[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export default function Search() {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdCounterRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestionsCache = useRef(
    new LRUCache<string, { data: SuggestionItem[]; timestamp: number }>(50)
  );

  // constants
  const DEBOUNCE_DELAY = 300;
  const CACHE_TTL = 5 * 60 * 1000; // 5 min
  const MAX_RECENT_SEARCHES = 10;

  // load recent searches from the localStorage
  useEffect(() => {
    const recentSearchesFromLS = localStorage.getItem("recentSearches");
    if (recentSearchesFromLS) {
      setRecentSearches(JSON.parse(recentSearchesFromLS));
    }
  }, []);

  // When user navigates with arrows, ensure selected item is visible
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedItem = suggestionsRef.current.children[selectedIndex];
      selectedItem?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm && !searchTerm.trim()) {
      console.log("resetting the suggestions to []");
      setSuggestions([]);
      return;
    }

    const searchedKey = searchTerm.trim().toLowerCase();

    // check cache - LRU with TTL
    // check if searchedKey is present and is not expired
    if (suggestionsCache.current.has(searchedKey, CACHE_TTL)) {
      const cachedData = suggestionsCache.current.get(searchedKey);
      if (cachedData) {
        console.log("cached suggestions", cachedData);
        setSuggestions([...cachedData.data]);
        setIsOpen(true);
        return;
      }
    }

    // Abort controller + RequestID
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const requestId = ++requestIdCounterRef.current;

    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?name=${encodeURIComponent(
          searchTerm
        )}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // check request counter
      if (requestId !== requestIdCounterRef.current) {
        // stale, ignore
        return;
      }

      // check if response was ok
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      // save in LRU cache with TTL
      suggestionsCache.current.set(searchedKey, {
        data: data.results,
        timestamp: Date.now(),
      });

      console.log(suggestionsCache.current.status());

      // set state
      setSuggestions(data.results);
      setIsOpen(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "Abort") {
        return;
      }

      if (requestId === requestIdCounterRef.current) {
        console.error("Something went wrong!");
      }
    } finally {
      if (requestId === requestIdCounterRef.current) {
        // set loading to false
      }
    }
  };

  const debouncedSearch = (searchTerm: string) => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    debouncedRef.current = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, DEBOUNCE_DELAY);
  };

  const addToRecentSearches = (query: string) => {
    if (!query) return;

    // MRU pattern
    // check for duplicates
    setRecentSearches((prevRecentSearches) => {
      const filteredRecentSearches = prevRecentSearches.filter(
        (item) => item !== query
      );
      // maintain the max size
      const updatedRecentSearches = [query, ...filteredRecentSearches].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      // also save recent searches in localstorage
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedRecentSearches)
      );
      return updatedRecentSearches;
    });
  };

  // for going to the search list page and adding to the recent searches - MRU - will only save the final search term - [] based
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToRecentSearches(query);
    }
  };

  // for getting the suggestions (system generated) - LRU (will save search term + results) - Map based
  // the change should be debounced
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // index of the suggestions selected
    setSelectedIndex(-1);

    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Don't set isOpen here - let fetchSuggestions handle it
    // This prevents the premature opening before we have suggestions
    debouncedSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex];
          setQuery(selectedSuggestion.name);
          addToRecentSearches(selectedSuggestion.name);
          setIsOpen(false);
          setSelectedIndex(-1);
        } else {
          // Trigger form submission manually
          const form = inputRef.current?.closest("form");
          if (form) {
            const formEvent = new Event("submit", {
              bubbles: true,
              cancelable: true,
            });
            form.dispatchEvent(formEvent);
          }
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    setQuery(suggestion.name);
    addToRecentSearches(suggestion.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow for suggestion clicks
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative">
        <RecentSearches recentSearches={recentSearches} />
        <form role="search" onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              ref={inputRef}
              id="search"
              name="search"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={query}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search characters..."
              aria-label="Search for characters"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls="suggestions-list"
              autoComplete="off"
              type="text"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </form>
        {isOpen && (
          <Suggestions
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            onSuggestionClick={handleSuggestionClick}
            ref={suggestionsRef}
          />
        )}
      </div>

      {suggestions?.length > 0 && (
        <div className="mt-8">
          <ProductGrid suggestions={suggestions} />
        </div>
      )}
    </div>
  );
}
