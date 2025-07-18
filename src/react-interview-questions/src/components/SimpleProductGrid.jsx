import React, { useState, useCallback, useEffect } from 'react';
import useSimpleInfiniteScroll from '../hooks/useSimpleInfiniteScroll';
import './ProductGrid.css';

/**
 * Simple ProductGrid with Infinite Scroll - Interview Version
 * 
 * This demonstrates the core concept without all the production features.
 * Perfect for explaining infinite scrolling in interviews.
 */

// Simple mock data generator
const generateProducts = (startIndex, count = 10) => {
  const products = [];
  const brands = ['Nike', 'Adidas', 'Puma'];
  const types = ['Shoes', 'T-Shirt', 'Hoodie'];
  
  for (let i = 0; i < count; i++) {
    const id = startIndex + i;
    products.push({
      id,
      name: `${brands[id % brands.length]} ${types[id % types.length]}`,
      price: Math.floor(Math.random() * 100) + 50,
      image: `https://picsum.photos/300/300?random=${id}`
    });
  }
  
  return products;
};

const SimpleProductGrid = () => {
  // State
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load more function - this is what gets called when sentinel becomes visible
  const loadMore = useCallback(async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new products
    const newProducts = generateProducts(page * 10, 10);
    
    // Add to existing products
    setProducts(prev => [...prev, ...newProducts]);
    setPage(prev => prev + 1);
    
    // Stop after 5 pages (50 products total)
    if (page >= 4) {
      setHasMore(false);
    }
  }, [page]);

  // Load initial data
  useEffect(() => {
    loadMore();
  }, []);

  // Use our simple infinite scroll hook
  const { sentinelRef, isLoading } = useSimpleInfiniteScroll(loadMore, hasMore);

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2>Simple Product Grid ({products.length} products)</h2>
        <p>Scroll down to see infinite scrolling in action!</p>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">
                <span className="price">${product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          <p>Loading more products...</p>
        </div>
      )}

      {/* Sentinel Element - This is the key to infinite scrolling! */}
      <div 
        ref={sentinelRef} 
        className="sentinel-element"
        style={{ 
          height: '20px', 
          background: 'transparent',
          border: '2px dashed #007bff',
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#007bff',
          fontSize: '12px'
        }}
      >
        🎯 Sentinel Element (triggers loading when visible)
      </div>

      {/* End message */}
      {!hasMore && (
        <div className="end-message">
          <p>🎉 All products loaded! ({products.length} total)</p>
        </div>
      )}
    </div>
  );
};

export default SimpleProductGrid; 