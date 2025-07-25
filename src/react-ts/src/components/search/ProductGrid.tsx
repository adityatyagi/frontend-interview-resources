import type { SuggestionItem } from "./types";
import { ProductCard } from "./ProductCard";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

interface ProductGridProps {
  suggestions: SuggestionItem[];
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
}

export function ProductGrid({
  suggestions,
  onLoadMore,
  hasMore = false,
}: ProductGridProps) {
  const { sentinelRef, isLoading } = useInfiniteScrolling({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    threshold: 0.1,
    rootMargin: "0px 0px 200px 0px",
  });

  if (suggestions.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {suggestions.map((item) => (
          <ProductCard key={item.id} cardDetails={item} />
        ))}
      </div>

      {/* Sentinel element for infinite scroll detection */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-20 w-full flex items-center justify-center"
        >
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && suggestions.length > 0 && (
        <div className="h-10 w-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">No more results</span>
        </div>
      )}
    </>
  );
}
