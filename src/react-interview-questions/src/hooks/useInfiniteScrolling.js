import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling using IntersectionObserver
 * 
 * How IntersectionObserver works:
 * 1. Creates an observer that watches for when a target element enters/exits the viewport
 * 2. When the target (sentinel element) becomes visible, it triggers the callback
 * 3. This allows us to load more data before the user reaches the bottom
 * 
 * @param {Function} loadMore - Function to call when more data should be loaded
 * @param {boolean} hasMore - Whether there's more data to load
 * @param {Object} options - Configuration options
 * @returns {Object} - { sentinelRef, isLoading, error }
 */
const useInfiniteScrolling = (loadMore, hasMore, options = {}) => {
  // Configuration options with defaults
  const {
    threshold = 0.1,        // How much of the element needs to be visible (0-1)
    rootMargin = '100px',   // Margin around the viewport to trigger early
    delay = 1000,           // Minimum delay between loads (ms)
    maxItems = 1000         // Safety limit to prevent infinite loops
  } = options;

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(0);

  // Refs for the sentinel element and observer
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const lastLoadTimeRef = useRef(0);

  /**
   * Callback function that IntersectionObserver calls when sentinel becomes visible
   * This is the heart of infinite scrolling
   */
  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    
    // Only proceed if:
    // 1. The sentinel element is intersecting (visible)
    // 2. There's more data to load
    // 3. We're not currently loading
    // 4. We haven't exceeded the safety limit
    // 5. Enough time has passed since last load (debouncing)
    if (
      entry.isIntersecting && 
      hasMore && 
      !isLoading && 
      itemCount < maxItems &&
      Date.now() - lastLoadTimeRef.current > delay
    ) {
      console.log('🚀 Intersection detected - loading more data...');
      
      // Update last load time to prevent rapid successive calls
      lastLoadTimeRef.current = Date.now();
      
      // Set loading state
      setIsLoading(true);
      setError(null);
      
      // Call the loadMore function
      loadMore()
        .then(() => {
          console.log('✅ More data loaded successfully');
        })
        .catch((err) => {
          console.error('❌ Error loading more data:', err);
          setError(err.message || 'Failed to load more data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [hasMore, isLoading, itemCount, maxItems, delay, loadMore]);

  /**
   * Set up the IntersectionObserver
   * This is the core mechanism that watches for when our sentinel element becomes visible
   */
  useEffect(() => {
    // Clean up any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Only create observer if we have a sentinel element and more data to load
    if (sentinelRef.current && hasMore) {
      console.log('👁️ Setting up IntersectionObserver...');
      
      // Create new IntersectionObserver
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold,    // Trigger when 10% of element is visible
        rootMargin,   // Start loading 100px before element enters viewport
        root: null    // Use viewport as root (default)
      });

      // Start observing the sentinel element
      observerRef.current.observe(sentinelRef.current);
      
      console.log('✅ IntersectionObserver is now watching the sentinel');
    }

    // Cleanup function - disconnect observer when component unmounts or dependencies change
    return () => {
      if (observerRef.current) {
        console.log('🧹 Cleaning up IntersectionObserver...');
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, hasMore, threshold, rootMargin]);

  /**
   * Update item count when data changes
   * This helps us track how many items we've loaded
   */
  const updateItemCount = useCallback((count) => {
    setItemCount(count);
  }, []);

  /**
   * Manual trigger for loading more data
   * Useful for testing or manual refresh
   */
  const triggerLoad = useCallback(() => {
    if (hasMore && !isLoading) {
      handleIntersection([{ isIntersecting: true }]);
    }
  }, [hasMore, isLoading, handleIntersection]);

  return {
    sentinelRef,      // Ref to attach to the sentinel element
    isLoading,        // Whether we're currently loading
    error,           // Any error that occurred during loading
    itemCount,       // Number of items loaded so far
    updateItemCount, // Function to update item count
    triggerLoad      // Manual trigger function
  };
};

export default useInfiniteScrolling; 