"use client"

import { useState } from "react"
import "../productgridcomponent/newarraivellandingdesigncarousel.css"
import newarr from "../assets/newarraivel.png"

const NewCarouselTaping = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = [
    {
      id: 1,
      image: newarr,
      label: "JUST IN",
      title: "Men White Crew Neck Full Sleeves C...",
      price: "₹ 2,299",
      category: "Sweatshirts",
      color: "White",
      colorCode: "#F5F5F5",
    },
    {
      id: 2,
      image: "/navy-polo-neck-sweatshirt.jpg",
      label: "JUST IN",
      title: "Men Navy Polo Neck Full Sleeves Ca...",
      price: "₹ 2,799",
      category: "Sweatshirts",
      color: "Navy",
      colorCode: "#001F3F",
    },
    {
      id: 3,
      image: "/black-print-polo.jpg",
      label: "JUST IN",
      title: "Men Black Print Polo N...",
      price: "₹ 1,799",
      category: "Printed T-Shirts",
      color: "Black",
      colorCode: "#000000",
    },
    {
      id: 4,
      image: "/gray-tshirt-casual.jpg",
      label: "JUST IN",
      title: "Men Gray Casual T-Shirt",
      price: "₹ 1,499",
      category: "T-Shirts",
      color: "Gray",
      colorCode: "#808080",
    },
    {
      id: 5,
      image: "/blue-sweatshirt.jpg",
      label: "JUST IN",
      title: "Men Blue Crew Neck Sweatshirt",
      price: "₹ 2,199",
      category: "Sweatshirts",
      color: "Blue",
      colorCode: "#0066CC",
    },
    {
      id: 6,
      image: "/red-polo-shirt.jpg",
      label: "JUST IN",
      title: "Men Red Polo Shirt",
      price: "₹ 1,899",
      category: "Polo Shirts",
      color: "Red",
      colorCode: "#FF0000",
    },
  ]

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= products.length ? 0 : prevIndex + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? products.length - 1 : prevIndex - 1))
  }

  const getVisibleProducts = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      visible.push(products[(currentIndex + i) % products.length])
    }
    return visible
  }

  return (
    <div className="chepak-carousel-container">
      {/* Pagination Dots */}
      <div className="chepak-pagination-container">
        <div className="chepak-pagination-dots">
          {products.map((_, index) => (
            <div key={index} className={`chepak-dot ${index === currentIndex ? "chepak-dot-active" : ""}`} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="chepak-content-wrapper">
        {/* New Arrivals Section */}
        <div className="chepak-new-arrivals-box">
          <img src={newarr} alt="New Arrivals Featured Product" className="chepak-arrivals-image" />
          <div className="chepak-arrivals-banner">
            <svg className="chepak-arrivals-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h2 className="chepak-arrivals-title">New Arrivals</h2>
            <button className="chepak-shop-button">SHOP NOW</button>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="chepak-carousel-section">
          {/* Left Arrow */}
          <button className="chepak-carousel-arrow chepak-arrow-left" onClick={handlePrev}>
            <span>‹</span>
          </button>

          {/* Products Container */}
          <div className="chepak-products-container">
            {getVisibleProducts().map((product, index) => (
              <div
                key={product.id}
                className="chepak-product-card"
                style={{
                  transform: `translateX(${-currentIndex * 33.333}%)`,
                }}
              >
                <div className="chepak-product-image-wrapper">
                  <img src={product.image || "/placeholder.svg"} alt={product.title} className="chepak-product-image" />
                  <div className="chepak-just-in-label">{product.label}</div>
                  <button className="chepak-wishlist-btn">♡</button>
                </div>
                <div className="chepak-product-info">
                  <p className="chepak-product-category">{product.category}</p>
                  <h3 className="chepak-product-title">{product.title}</h3>
                  <p className="chepak-product-price">{product.price}</p>
                  <div className="chepak-color-options">
                    <div
                      className="chepak-color-dot chepak-color-active"
                      style={{ backgroundColor: product.colorCode }}
                      title={product.color}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="chepak-carousel-arrow chepak-arrow-right" onClick={handleNext}>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewCarouselTaping;
