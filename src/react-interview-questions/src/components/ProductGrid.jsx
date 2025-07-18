import React, { useState, useCallback, useEffect } from 'react';
import useInfiniteScrolling from '../hooks/useInfiniteScrolling';
import './ProductGrid.css';

/**
 * Mock data generator for demonstration
 * In a real app, this would come from an API
 */
const generateMockProducts = (startIndex, count = 20) => {
  const products = [];
  const brands = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance'];
  const categories = ['Shoes', 'T-Shirts', 'Hoodies', 'Jeans', 'Jackets'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray'];

  for (let i = 0; i < count; i++) {
    const id = startIndex + i;
    const brand = brands[id % brands.length];
    const category = categories[id % categories.length];
    const color = colors[id % colors.length];
    
    products.push({
      id,
      name: `${brand} ${category} ${color}`,
      brand,
      category,
      color,
      price: Math.floor(Math.random() * 200) + 50, // $50-$250
      image: `https://picsum.photos/300/300?random=${id}`, // Random image
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
      reviews: Math.floor(Math.random() * 1000) + 10,
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0 // 30% chance of discount
    });
  }
  
  return products;
};

/**
 * ProductGrid Component with Infinite Scrolling
 * 
 * This component demonstrates:
 * 1. How to use the useInfiniteScrolling hook
 * 2. How to manage product data state
 * 3. How to implement a sentinel element
 * 4. How to handle loading and error states
 */
const ProductGrid = () => {
  // State for products and pagination
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Configuration
  const ITEMS_PER_PAGE = 20;
  const MAX_ITEMS = 200; // Safety limit

  /**
   * Function to load more products
   * This is passed to the useInfiniteScrolling hook
   * It simulates an API call with a delay
   */
  const loadMoreProducts = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate new products for this page
    const newProducts = generateMockProducts(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
    
    // Update state
    setProducts(prev => [...prev, ...newProducts]);
    setCurrentPage(prev => prev + 1);
    
    // Check if we've reached the limit
    if ((currentPage + 1) * ITEMS_PER_PAGE >= MAX_ITEMS) {
      setHasMore(false);
      console.log('🏁 Reached maximum items limit');
    }
    
    return newProducts;
  }, [currentPage]);

  /**
   * Load initial data when component mounts
   */
  useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      await loadMoreProducts();
      setIsInitialLoading(false);
    };
    
    loadInitialData();
  }, []); // Only run on mount

  /**
   * Use our custom infinite scrolling hook
   * 
   * Parameters:
   * - loadMoreProducts: Function to call when more data is needed
   * - hasMore: Boolean indicating if more data is available
   * - options: Configuration object
   */
  const {
    sentinelRef,      // Ref to attach to the sentinel element
    isLoading,        // Whether we're currently loading more data
    error,           // Any error that occurred
    updateItemCount, // Function to update item count
    triggerLoad      // Manual trigger function
  } = useInfiniteScrolling(loadMoreProducts, hasMore, {
    threshold: 0.1,        // Trigger when 10% of sentinel is visible
    rootMargin: '200px',   // Start loading 200px before sentinel enters viewport
    delay: 500,            // Minimum 500ms between loads
    maxItems: MAX_ITEMS    // Safety limit
  });

  /**
   * Update item count when products change
   * This helps the hook track progress
   */
  useEffect(() => {
    updateItemCount(products.length);
  }, [products.length, updateItemCount]);

  /**
   * Handle product click (in real app, navigate to product detail)
   */
  const handleProductClick = useCallback((product) => {
    console.log('🛍️ Product clicked:', product.name);
    // In real app: navigate to product detail page
  }, []);

  /**
   * Render individual product card
   */
  const renderProductCard = (product) => (
    <div 
      key={product.id} 
      className="product-card"
      onClick={() => handleProductClick(product)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
        {!product.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
          <span className="rating-text">({product.rating})</span>
          <span className="reviews">({product.reviews} reviews)</span>
        </div>
        
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="original-price">${product.price}</span>
              <span className="discounted-price">
                ${Math.round(product.price * (1 - product.discount / 100))}
              </span>
            </>
          ) : (
            <span className="price">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );

  // Show loading state for initial load
  if (isInitialLoading) {
    return (
      <div className="product-grid-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {/* Header with stats */}
      <div className="product-grid-header">
        <h2>Products ({products.length})</h2>
        {hasMore && <p>Scroll down to load more products</p>}
        {!hasMore && <p>All products loaded</p>}
      </div>

      {/* Product grid */}
      <div className="product-grid">
        {products.map(renderProductCard)}
      </div>

      {/* Error state */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={triggerLoad}>Try Again</button>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {isLoading && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          <p>Loading more products...</p>
        </div>
      )}

      {/* Sentinel element - this is what triggers infinite scrolling */}
      <div 
        ref={sentinelRef} 
        className="sentinel-element"
        aria-hidden="true"
      >
        {/* This div is invisible but crucial for infinite scrolling */}
        {/* When it becomes visible, the IntersectionObserver triggers loadMore */}
      </div>

      {/* End of products message */}
      {!hasMore && products.length > 0 && (
        <div className="end-message">
          <p>🎉 You've reached the end! All {products.length} products loaded.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;