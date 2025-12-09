// components/ProductGrid.js
import React from 'react';
import '../Goat Css/ProductGrid.css';
import { FaArrowRight } from 'react-icons/fa';
import shoe1 from '../assets/shoe1.jpeg';
import bag1 from '../assets/bag1.png';
import ring1 from '../assets/ring1.jpeg';
import watch1 from '../assets/watch1.jpg';
import jewellery from '../assets/jewellery.jpg';
import ladywatch from '../assets/lady watch.jpeg';
import fashion from '../assets/fashion.jpg';
import belt from '../assets/belt.jpeg';
import cap from '../assets/cap.jpeg';
import glass from '../assets/glass.jpg';
const ProductGridNew = () => {
  const categories = [
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        { name: "watch", image: watch1 },
        { name: "shoes", image: shoe1 },
        { name: "belts", image: belt },
        { name: "caps", image: cap },
      ],
      actionText: "See more",
      type: "product"
    },
    {
      title: "Revamp your home in style",
      items: [
        { name: "bags", image: bag1 },
        { name: "Figurines, jewels & more", image: jewellery },
        { name: "barby watch", image: ladywatch },
        { name: "Lighting fashion", image: fashion },
      ],
      actionText: "Explore all",
      type: "product"
    },
    {
      title: "Starting ₹149 | Headphones",
      items: [
        { name: "Starting ₹249 | boAt", image: ring1, brand: "boAt" },
        { name: "Starting ₹349 | boult", image: shoe1, brand: "boult" },
        { name: "Starting ₹649 | Noise", image: shoe1, brand: "Noise" },
        { name: "Starting ₹149 | Zebronics", image: glass, brand: "Zebronics" },
      ],
      actionText: "See all offers",
      type: "brand"
    },
    {
      title: "Automotive essentials | Up to 60% off",
      items: [
        { name: "Cleaning accessories", image: shoe1 },
        { name: "Tyre & rim care", image: shoe1 },
        { name: "Helmets", image: shoe1 },
        { name: "Vacuum cleaner", image: shoe1 },
      ],
      actionText: "See more",
      type: "product"
    }
  ];

  return (
    <div className="product-grid-container">
      {categories.map((category, index) => (
        <div className="category-card" key={index}>
          <h2 className="category-title">{category.title}</h2>
          <div className="product-grid">
            {category.items.map((item, itemIndex) => (
              <div className="product-item" key={itemIndex}>
                <div className="product-image-container">
                  <img src={item.image} alt={item.name} className="product-image" />
                </div>
                <p className="product-name">
                  {category.type === "brand" && item.brand && (
                    <img 
                      src={item.image} 
                      alt={item.brand} 
                      className="brand-logo" 
                    />
                  )}
                  {item.name}
                </p>
              </div>
            ))}
          </div>
          <div className="action-link">
            <span>{category.actionText}</span>
            <FaArrowRight className="arrow-icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridNew;