"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../Pages/ProductDetail.css";

const ProductDetailsAll = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = state?.product;

  const [selectedSize, setSelectedSize] = useState("XL");

  // 4 Images exactly like your screenshot
  const smallImages = [
    "https://via.placeholder.com/600x800/001133/ffffff?text=ORDER+NOW+1",
    "https://via.placeholder.com/600x800/111111/ffffff?text=ORDER+NOW+2",
    "https://via.placeholder.com/600x800/000000/ffffff?text=ORDER+NOW+3",
    "https://via.placeholder.com/600x800/222222/ffffff?text=ORDER+NOW+4",
  ];

  if (!product) {
    return <div style={{ padding: 40, textAlign: "center" }}>No product found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });
    alert("Added to cart!");
  };

  return (
    <div className="prod-wrapper">

      {/* LEFT SIDE - Main + 2×2 Grid */}
      <div className="prod-left">
        <img src={product.image} alt={product.title} className="prod-main-img" />

        <div className="small-images-grid">
          {smallImages.map((img, i) => (
            <div key={i} className="small-img-wrapper">
              <img src={img} alt={`view ${i + 1}`} />
              <div className="order-now-banner">ORDER NOW</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="prod-right">
        <h1 className="prod-title">{product.title || "Men Black Textured Crew Neck T-Shirt"}</h1>

        <div className="prod-price-box">
          <span className="prod-mrp">MRP</span>
          <span className="prod-mrp-strike">₹1,999.00</span>
          <span className="prod-price">₹1,779.00</span>
          <span className="prod-off">11% OFF</span>
          <span style={{ color: "#27ae60", fontWeight: "600", marginLeft: "10px" }}>
            Gem 53 PTS
          </span>
        </div>

        <div className="size-box">
          <p>SIZE: <strong>{selectedSize}</strong></p>
          <div className="size-grid">
            {["S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
              <button
                key={s}
                className={`size-btn ${selectedSize === s ? "active" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <a href="#" className="size-chart">View Size Chart Down</a>
        </div>

        <button className="buy-now" onClick={handleAddToCart}>
          BUY NOW
        </button>

        <button className="add-bag" onClick={() => navigate(-1)}>
          GO TO BAG
        </button>
      </div>

      {/* BOTTOM SPECS */}
      <div className="specs-grid">
        <div><strong>Material:</strong> 50% Cotton, 46% Modal and 4% Spandex</div>
        <div><strong>Fit:</strong> Oversized Fit</div>
        <div><strong>Style Code:</strong> ALKC4DSF886679</div>
        <div><strong>Brand:</strong> Allen Solly</div>
        <div><strong>Color:</strong> Black</div>
        <div><strong>Neck:</strong> Crew Neck</div>
        <div><strong>Occasion:</strong> Casual</div>
        <div><strong>Pattern:</strong> Textured</div>
        <div><strong>Sleeves:</strong> Half Sleeves</div>
        <div><strong>Subbrand:</strong> Allen Solly Jeans</div>
        <div><strong>Product Type:</strong> T-Shirt</div>
        <div><strong>Collection:</strong> AL Authentic</div>
      </div>
    </div>
  );
};

export default ProductDetailsAll;