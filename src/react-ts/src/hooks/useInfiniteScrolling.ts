import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollingProps {
  onLoadMore: () => Promise<void> | void;
  hasMore?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const useInfiniteScrolling = ({
  onLoadMore,
  hasMore = true,
  threshold = 0.1,
  rootMargin = "0px 0px 100px 0px",
}: UseInfiniteScrollingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        try {
          await onLoadMore();
        } catch (error) {
          console.error("Error loading more data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Reset loading state when hasMore changes to false
  useEffect(() => {
    if (!hasMore) {
      setIsLoading(false);
    }
  }, [hasMore]);

  return {
    sentinelRef,
    isLoading,
  };
};

export default useInfiniteScrolling;
