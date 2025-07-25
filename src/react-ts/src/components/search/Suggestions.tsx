import React from "react";
import type { SuggestionItem } from "./types";

interface SuggestionsProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSuggestionClick: (suggestion: SuggestionItem) => void;
}

export const Suggestions = React.forwardRef<HTMLDivElement, SuggestionsProps>(
  ({ suggestions, selectedIndex, onSuggestionClick }, ref) => {
    if (suggestions?.length === 0) return null;

    return (
      <div
        ref={ref}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
        role="listbox"
        id="suggestions-list"
        aria-label="Search suggestions"
      >
        {suggestions?.map((suggestion, index) => (
          <div
            key={suggestion.id}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              index === selectedIndex ? "bg-blue-100" : ""
            }`}
            onClick={() => onSuggestionClick(suggestion)}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <div className="flex items-center space-x-3">
              <img
                src={suggestion.image}
                alt={`${suggestion.name} character`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {suggestion.name}
                </div>
                <div className="text-sm text-gray-500">
                  {suggestion.species} • {suggestion.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Suggestions.displayName = "Suggestions";
