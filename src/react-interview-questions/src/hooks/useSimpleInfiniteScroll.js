import { useRef, useEffect, useState } from 'react';

/**
 * Simple Infinite Scroll Hook - Interview Version
 * 
 * This is a simplified version that's easy to explain in interviews.
 * It demonstrates the core concept without all the production features.
 * 
 * How it works:
 * 1. We create a "sentinel" element at the bottom of the list
 * 2. IntersectionObserver watches when this element becomes visible
 * 3. When visible, we call the loadMore function
 * 4. This creates the infinite scroll effect
 */
const useSimpleInfiniteScroll = (loadMore, hasMore) => {
  // Ref for the sentinel element (the "trigger" at the bottom)
  const sentinelRef = useRef(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no sentinel element or no more data, don't set up observer
    if (!sentinelRef.current || !hasMore) {
      return;
    }

    // Create the IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // If sentinel is visible and we're not already loading
        if (entry.isIntersecting && !isLoading) {
          console.log('🚀 Sentinel visible - loading more data!');
          
          setIsLoading(true);
          
          // Call the loadMore function
          loadMore()
            .then(() => {
              console.log('✅ Data loaded successfully');
            })
            .catch((error) => {
              console.error('❌ Error loading data:', error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      },
      {
        // Trigger when 10% of the sentinel is visible
        threshold: 0.1,
        // Start loading 100px before the sentinel enters viewport
        rootMargin: '100px'
      }
    );

    // Start observing the sentinel element
    observer.observe(sentinelRef.current);

    // Cleanup: disconnect observer when component unmounts
    return () => {
      observer.disconnect();
    };
  }, [loadMore, hasMore, isLoading]);

  return {
    sentinelRef,  // Attach this ref to your sentinel element
    isLoading     // Whether we're currently loading
  };
};

export default useSimpleInfiniteScroll; 