// src/productgridcomponent/Productlayout3.jsx
import { useState, useEffect } from "react";
import "../productgridcomponent/productlayout.css";

// MAIN THUMBNAILS
import image1 from "../assets/oqojcgrka.jpg";
import image2 from "../assets/product13.png";
import image3 from "../assets/product16.png";
import image4 from "../assets/product17.png";

// EXTRA IMAGES (you can keep placeholders or real ones)
import t1_extra1 from "../assets/lmjhaskf.jpg";
import t1_extra2 from "../assets/meshiwq.jpg";
import t1_extra3 from "../assets/lmjhaskf.jpg";

import t2_extra1 from "../assets/lmjhaskf.jpg";
import t2_extra2 from "../assets/lmjhaskf.jpg";
import t2_extra3 from "../assets/lmjhaskf.jpg";

import t3_extra1 from "../assets/lmjhaskf.jpg";
import t3_extra2 from "../assets/lmjhaskf.jpg";
import t3_extra3 from "../assets/lmjhaskf.jpg";

import t4_extra1 from "../assets/lmjhaskf.jpg";
import t4_extra2 from "../assets/lmjhaskf.jpg";
import t4_extra3 from "../assets/lmjhaskf.jpg";

import { useNavigate } from "react-router-dom";

const Productlayout3 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const products = [
    {
      id: 9,
      name: "DRIPCO LEGEND SERIES OVERSIZED TSHIRT - GOKU",
      currentPrice: "599.00",
      originalPrice: "1,299.00",
      discount: 50,
      mainImage: image1,
      gallery: [t1_extra1, t1_extra2, t1_extra3],
      category: "TSHIRT'S",
      inStock: true, // Available
    },
    {
      id: 10,
      name: "DRIPCO SHADOW REFLECTIVE TSHIRT - PHANTOM",
      currentPrice: "699.00",
      originalPrice: "1,499.00",
      discount: 53,
      mainImage: image2,
      gallery: [t2_extra1, t2_extra2, t2_extra3],
      category: "TSHIRT'S",
      inStock: false,  
    },
    {
      id: 11,
      name: "DRIPCO MINIMAL LUXE TSHIRT - ELEGANCE",
      currentPrice: "599.00",
      originalPrice: "1,299.00",
      discount: 54,
      mainImage: image3,
      gallery: [t3_extra1, t3_extra2, t3_extra3],
      category: "TSHIRT'S",
      inStock: false, // OUT OF STOCK
    },
    {
      id: 12,
      name: "DRIPCO ACID WASH VINTAGE TSHIRT - REBEL",
      currentPrice: "749.00",
      originalPrice: "1,599.00",
      discount: 53,
      mainImage: image4,
      gallery: [t4_extra1, t4_extra2, t4_extra3],
      category: "TSHIRT'S",
      inStock: false, // OUT OF STOCK
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleProductClick = (product) => {
    if (!product.inStock) return; // Prevent navigation if out of stock

    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/product/${product.id}`, {
      state: {
        product: {
          ...product,
          mainImage: product.mainImage,
          gallery: product.gallery || [],
        },
      },
    });
  };

  return (
    <div className={`product-grid-container ${isVisible ? "visible" : ""}`}>
      {/* Fixed Tab */}
      <div className="tabs-container">
        <button className="tab-button active">TSHIRT'S</button>
      </div>

      {/* Product Grid */}
      <div className="products-grid">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`product-card-wrapper ${!product.inStock ? "out-of-stock" : ""}`}
            onClick={() => handleProductClick(product)}
            style={{
              transitionDelay: `${index * 0.15}s`,
              cursor: product.inStock ? "pointer" : "not-allowed",
            }}
          >
            <div className="product-card">
              <div className="product-image-wrapper">
                {/* Discount Badge */}
                {product.discount && product.inStock && (
                  <div className="discount-badge">SAVE {product.discount}%</div>
                )}

                {/* Out of Stock Ribbon */}
                {!product.inStock && (
                  <div className="out-of-stock-ribbon">
                    <span>OUT OF STOCK</span>
                  </div>
                )}

                <img
                  src={product.mainImage}
                  alt={product.name}
                  className={`product-image ${!product.inStock ? "dimmed" : ""}`}
                  loading="lazy"
                />

                {/* Quick View Overlay - only for in-stock */}
                {product.inStock && (
                  <div className="quick-view-overlay">
                    <span>QUICK VIEW</span>
                  </div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-prices">
                  <span className="current-price">RS. {product.currentPrice}</span>
                  <span className="original-price">RS. {product.originalPrice}</span>
                </div>

                {/* Optional: Show "Sold Out" text below price */}
                {!product.inStock && (
                  <div className="sold-out-text">Currently Unavailable</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productlayout3;