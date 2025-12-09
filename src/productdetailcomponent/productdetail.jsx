"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../productdetailcomponent/productdetaildesign.css"

const ProductDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}

  const [isVisible, setIsVisible] = useState(false)
  const [selectedColor, setSelectedColor] = useState("night-blue")
  const [selectedSize, setSelectedSize] = useState("XXL")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const colors = [
    { name: "white", code: "#fff" },
    { name: "black", code: "#000" },
    { name: "red", code: "#e74c3c" },
    { name: "dark-blue", code: "#1a2332" },
    { name: "night-blue", code: "#2c3e50" },
    { name: "gray", code: "#bdc3c7" },
    { name: "teal", code: "#16a085" },
  ]

  const sizes = ["S", "M", "L", "XL", "XXL"]

  const productImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-02%20120836-fWUVwrHrAHVtuakg26XuEz1lEbd6It.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-02%20120836-fWUVwrHrAHVtuakg26XuEz1lEbd6It.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-02%20120836-fWUVwrHrAHVtuakg26XuEz1lEbd6It.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-02%20120836-fWUVwrHrAHVtuakg26XuEz1lEbd6It.png",
  ]

  useEffect(() => {
    if (!product) {
      navigate("/")
      return
    }
    setIsVisible(true)
  }, [product, navigate])

  const handleAddToBag = () => {
    toast.success("Added to cart successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const increaseQuantity = () => {
    if (quantity < 3) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (!product) return null

  return (
    <div className={`product-detail-container ${isVisible ? "visible" : ""}`}>
      
      <ToastContainer />

      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Products
      </button>

      <div className="product-detail-content">
        <div className="product-images-section">
          <div className="thumbnail-images">
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img || "/placeholder.svg"}
                alt={`Product ${index + 1}`}
                className={`thumbnail ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
          <div className="main-images">
            <img
              src={productImages[activeImage] || "/placeholder.svg"}
              alt="Product main view 1"
              className="main-image"
            />
            <img
              src={productImages[(activeImage + 1) % productImages.length] || "/placeholder.svg"}
              alt="Product main view 2"
              className="main-image"
            />
          </div>
        </div>

        <div className="product-details-section">
          <div className="product-header">
            <span className="product-id">Product ID: 40208</span>
            <button className="wishlist-button">♡</button>
          </div>

          <h1 className="product-title">
            Heavy Oversized T-Shirt
            <br />
            Night-blue
          </h1>

          <div className="color-selection">
            <div className="color-label">
              Color <span className="color-name">night-blue - 047</span>
            </div>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`color-swatch ${selectedColor === color.name ? "selected" : ""}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                >
                  {color.code === "#fff" && <span className="white-border"></span>}
                </button>
              ))}
            </div>
          </div>

          <div className="size-selection">
            <div className="size-header">
              <span className="size-label">Size</span>
              <button className="size-guide-link">Size Guide</button>
            </div>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? "selected" : ""} ${
                    size === "M" || size === "L" || size === "XL" ? "unavailable" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                  disabled={size === "M" || size === "L" || size === "XL"}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="price-section">
            <span className="price">47,40 €</span>
            <span className="tax-info">incl. VAT.</span>
          </div>

          <div className="actions-section">
            <div className="quantity-selector">
              <button className="quantity-button" onClick={decreaseQuantity} disabled={quantity === 1}>
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-button" onClick={increaseQuantity} disabled={quantity === 3}>
                +
              </button>
            </div>
            <button className="add-to-bag-button" onClick={handleAddToBag}>
              ADD TO BAG
            </button>
          </div>

          <div className="stock-indicator">
            <span className="stock-dot"></span>
            <span className="stock-text">only 3 remaining</span>
          </div>

          {product.discount && <div className="discount-tag">SAVE {product.discount}%</div>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail;
