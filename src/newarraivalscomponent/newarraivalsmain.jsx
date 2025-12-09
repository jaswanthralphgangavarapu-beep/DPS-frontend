import { useState, useEffect } from "react"
import "../newarraivalscomponent/newarraivaldesign.css"

const NewArrivalAsNew = () => {
  const [activeTab, setActiveTab] = useState("tshirts")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Dummy product data
  const products = {
    tshirts: [
      {
        id: 1,
        name: "Essential Black Tee",
        price: "$89",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        tag: "bestseller",
      },
      {
        id: 2,
        name: "Minimalist White Tee",
        price: "$85",
        image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3433?w=500&h=500&fit=crop",
        tag: "luxury",
      },
      {
        id: 3,
        name: "Premium Gray Tee",
        price: "$95",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
        tag: "new",
      },
      {
        id: 4,
        name: "Signature Cream Tee",
        price: "$92",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        tag: "bestseller",
      },
      {
        id: 5,
        name: "Urban Black Edition",
        price: "$99",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        tag: "new",
      },
      {
        id: 6,
        name: "Silk Touch Tee",
        price: "$105",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
        tag: "luxury",
      },
    ],
    hoodies: [
      {
        id: 1,
        name: "Luxury Black Hoodie",
        price: "$189",
        image: "https://images.unsplash.com/photo-1556821552-107a0c2eea69?w=500&h=500&fit=crop",
        tag: "bestseller",
      },
      {
        id: 2,
        name: "Premium Gray Hoodie",
        price: "$199",
        image: "https://images.unsplash.com/photo-1458668383970-8542f3b71d5f?w=500&h=500&fit=crop",
        tag: "new",
      },
      {
        id: 3,
        name: "Minimalist Cream Hoodie",
        price: "$185",
        image: "https://images.unsplash.com/photo-1556821552-107a0c2eea69?w=500&h=500&fit=crop",
        tag: "luxury",
      },
      {
        id: 4,
        name: "Oversized Black Hoodie",
        price: "$215",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop",
        tag: "new",
      },
      {
        id: 5,
        name: "Tech White Hoodie",
        price: "$195",
        image: "https://images.unsplash.com/photo-1458668383970-8542f3b71d5f?w=500&h=500&fit=crop",
        tag: "bestseller",
      },
      {
        id: 6,
        name: "Elite Gray Hoodie",
        price: "$225",
        image: "https://images.unsplash.com/photo-1556821552-107a0c2eea69?w=500&h=500&fit=crop",
        tag: "luxury",
      },
    ],
  }

  const currentProducts = products[activeTab]
  const itemsPerSlide = 3
  const totalSlides = Math.ceil(currentProducts.length / itemsPerSlide)

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000)
    return () => clearInterval(interval)
  }, [totalSlides])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const getVisibleProducts = () => {
    const start = currentIndex * itemsPerSlide
    return currentProducts.slice(start, start + itemsPerSlide)
  }

  return (
    <div className="new-arrival-container">
      {/* Hero Section */}
      <section className="new-arrival-hero">
        <div className="new-arrival-hero-content">
          <h1 className="new-arrival-title">New Arrivals</h1>
          <p className="new-arrival-subtitle">Curated luxury collection for the discerning taste</p>
          <div className="new-arrival-accent-line"></div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="new-arrival-tab-section">
        <div className="new-arrival-tabs">
          <button
            className={`new-arrival-tab-btn ${activeTab === "tshirts" ? "new-arrival-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("tshirts")
              setCurrentIndex(0)
            }}
          >
            <span className="new-arrival-tab-label">T-Shirts</span>
            <span className="new-arrival-tab-count">{products.tshirts.length}</span>
          </button>
          <button
            className={`new-arrival-tab-btn ${activeTab === "hoodies" ? "new-arrival-tab-active" : ""}`}
            onClick={() => {
              setActiveTab("hoodies")
              setCurrentIndex(0)
            }}
          >
            <span className="new-arrival-tab-label">Hoodies</span>
            <span className="new-arrival-tab-count">{products.hoodies.length}</span>
          </button>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="new-arrival-carousel-section">
        <div className="new-arrival-carousel-wrapper">
          {/* Left Arrow */}
          <button className="new-arrival-arrow new-arrival-arrow-left" onClick={handlePrev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="new-arrival-carousel">
            <div className="new-arrival-carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div key={slideIdx} className="new-arrival-slide">
                  {currentProducts.slice(slideIdx * itemsPerSlide, (slideIdx + 1) * itemsPerSlide).map((product) => (
                    <div key={product.id} className="new-arrival-product-card">
                      <div className="new-arrival-product-image-wrapper">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="new-arrival-product-image"
                        />
                        <div className={`new-arrival-product-tag new-arrival-tag-${product.tag}`}>
                          {product.tag.charAt(0).toUpperCase() + product.tag.slice(1)}
                        </div>
                        <button className="new-arrival-product-btn">View Details</button>
                      </div>
                      <div className="new-arrival-product-info">
                        <h3 className="new-arrival-product-name">{product.name}</h3>
                        <p className="new-arrival-product-price">{product.price}</p>
                        <button className="new-arrival-add-to-cart">Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button className="new-arrival-arrow new-arrival-arrow-right" onClick={handleNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="new-arrival-indicators">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              className={`new-arrival-indicator ${idx === currentIndex ? "new-arrival-indicator-active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            ></button>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="new-arrival-brand-story">
        <div className="new-arrival-story-content">
          <div className="new-arrival-story-text">
            <h2 className="new-arrival-story-title">Crafted with Intent</h2>
            <p className="new-arrival-story-desc">
              Each piece in our new collection represents our commitment to quality, sustainability, and timeless style.
              We believe in creating garments that tell your story.
            </p>
            <ul className="new-arrival-story-list">
              <li className="new-arrival-list-item">Premium materials sourced responsibly</li>
              <li className="new-arrival-list-item">Ethically manufactured with care</li>
              <li className="new-arrival-list-item">Timeless designs for the modern individual</li>
            </ul>
          </div>
          <div className="new-arrival-story-visual"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="new-arrival-cta-section">
        <h2 className="new-arrival-cta-title">Explore Full Collection</h2>
        <button className="new-arrival-cta-btn">Shop Now</button>
      </section>
    </div>
  )
}

export default NewArrivalAsNew;
