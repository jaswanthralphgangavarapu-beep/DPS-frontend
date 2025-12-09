import React, { useState } from "react";
import "../Goat Css/Productlarge.css";
import jewellery1 from '../assets/jewellery1.jpg';
import shoe1 from '../assets/shoe1.jpeg';
import bag1 from '../assets/bag1.png';
import ring1 from '../assets/ring1.jpeg';
import watch1 from '../assets/watch1.jpg';
const ProductDisplay = () => {
  const images = [
    shoe1,
    bag1,
    ring1,
    jewellery1,
  ]; // Replace with actual image URLs

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="product-container">
      <div className="image-gallery">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Thumbnail"
            className="thumbnail"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
      <div className="main-image">
        <img src={mainImage} alt="Main Product" />
      </div>
      <div className="product-info">
        <h2>New Diamond Necklace With Orman Shaped Nature</h2>
        <div className="rating">⭐⭐⭐⭐☆</div>
        <p className="price">
          <span className="discounted-price">₹1999</span>
          <span className="original-price">₹2999</span>
        </p>
        <button className="add-to-cart">Add To Cart</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
