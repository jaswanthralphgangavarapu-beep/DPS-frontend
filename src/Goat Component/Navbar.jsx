import { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaPhoneAlt, FaUser, FaHeart, FaShoppingBag, FaBars, FaBoxOpen, FaSignOutAlt } from "react-icons/fa"
import { useCart } from "../context/CartContext"
import logo from "../assets/logo.jpg"
import adityaBirla from "../assets/Eshoppers.jpg"
import "../Goat Css/navbar.css"
import { getUserIdFromCookie, clearUserIdCookie } from "../usercredentialscomponent/apiservice"

const Navbar = ({ toggleSidebar }) => {
  const [isSticky, setIsSticky] = useState(false)
  const { getTotalItems, cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart()
  const [showBagPopup, setShowBagPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const popupRef = useRef(null)

  // Check login status
  useEffect(() => {
    const userId = getUserIdFromCookie()
    setIsLoggedIn(!!userId)
  }, [cartItems]) // Re-check when cart changes (could indicate login)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const navbarHeight = document.querySelector(".navbar-container")?.offsetHeight || 0
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      if (scrollPosition + windowHeight >= documentHeight - navbarHeight) {
        setIsSticky(false)
      } else {
        setIsSticky(scrollPosition > 100)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowLoginPopup(false)
      }
    }
    if (showLoginPopup) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showLoginPopup])

  const openBag = () => setShowBagPopup(true)

  const handleLogout = () => {
    clearUserIdCookie()
    setIsLoggedIn(false)
    setShowLoginPopup(false)
    navigate("/")
    window.location.reload()
  }

  const handleProceedToCheckout = () => {
    setShowBagPopup(false)

    if (!isLoggedIn) {
      alert("Please login to proceed to checkout")
      return
    }

    navigate("/checkout")
  }

  return (
    <>
      <header className={`navbar-container ${isSticky ? "sticky" : ""}`}>
        <div className="top-nav">
          <div className="more-brands-container">
            <button className="more-brands-btn">The DripCo.store</button>
            <button className="mobile-cart-btn" onClick={openBag}>
              <FaShoppingBag style={{ color: "#ffffff" }} />
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </button>
          </div>

          <div className="top-nav-right">
            <Link to="/supportdripco" style={{ textDecoration: "none" }}>
              <button className="top-nav-btn">
                <FaPhoneAlt/> SUPPORT
              </button>
            </Link>

            <button className="top-nav-btn" onClick={() => setShowLoginPopup(!showLoginPopup)}>
              <FaUser/> {isLoggedIn ? "Account" : "Login"}
            </button>
            <button className="top-nav-btn wishlist">
              <FaHeart/>
            </button>
            <button className="top-nav-btn cart" onClick={openBag}>
              <FaShoppingBag/>
              {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            </button>
          </div>
        </div>

        <div className="main-nav">
          <div className="hamburger-menu" onClick={toggleSidebar}>
            <FaBars />
          </div>
          <div className="logo-container">
            <Link to="/">
              <img src={logo || "/placeholder.svg"} alt="The Drip.co" className="logo" />
            </Link>
          </div>
          <nav className="nav-links">
            <ul>
              <li>
                <a href="#">PRODUCTS</a>
              </li>
              <li>
                <Link to="/new-arrivals">NEW ARRIVALS</Link>
              </li>
              <li>
                <a href="#">SPECIAL SIZES</a>
              </li>
            </ul>
          </nav>
          <div className="search-container"></div>
          <div className="express-delivery">
            <div className="delivery-text">
              <strong>SHOP NOW</strong>
            </div>
          </div>
          <div className="aditya-birla">
            <img src={adityaBirla || "/placeholder.svg"} alt="Aditya Birla Fashion" />
          </div>
        </div>
      </header>

      {/* BAG POPUP */}
      {showBagPopup && (
        <div className="bag-overlay" onClick={() => setShowBagPopup(false)}>
          <div className="bag-popup-modern" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bag-header-modern">
              <div>
                <h3>My Bag ({getTotalItems()})</h3>
                <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                  {getTotalItems() === 1 ? "1 item" : `${getTotalItems()} items`}
                </p>
              </div>
              <button onClick={() => setShowBagPopup(false)} className="close-btn-modern">
                ×
              </button>
            </div>

            {/* Items List */}
            <div className="bag-items-modern">
              {cartItems.length === 0 ? (
                <div className="empty-bag-modern">
                  <FaShoppingBag size={60} opacity={0.3} />
                  <p>Your bag feels light</p>
                  <button
                    onClick={() => {
                      setShowBagPopup(false)
                      navigate("/")
                    }}
                    style={{
                      marginTop: "16px",
                      padding: "10px 24px",
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartId} className="bag-item-modern">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-img-modern" />
                    <div className="item-info-modern">
                      <h4>{item.name}</h4>
                      <p className="size-text">
                        Size: <strong>{item.size}</strong>
                      </p>
                      <div className="qty-price-row">
                        <div className="qty-controls-modern">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                        </div>
                        <div className="price-text">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="remove-btn-modern">
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="bag-footer-modern">
                <div className="total-row">
                  <span>Subtotal</span>
                  <strong>₹{getTotalPrice().toLocaleString()}</strong>
                </div>
                <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 12px" }}>Tax calculated at checkout</p>
                <button className="checkout-btn-modern" onClick={handleProceedToCheckout}>
                  PROCEED TO CHECKOUT
                </button>
                <p className="secure-text">🔒 Secure Checkout • Free Shipping • Easy Returns</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGIN DROPDOWN POPUP */}
      {showLoginPopup && (
        <div className="login-dropdown-wrapper">
          <div className="login-dropdown-popup" ref={popupRef}>
            <div className="login-dropdown-content">
              <div className="designcolordrop">
                <h2>{isLoggedIn ? "MY ACCOUNT" : "WELCOME!"}</h2>
                <p>{isLoggedIn ? "Manage your DripCo account" : "Treat yourself with DripCo."}</p>
                {!isLoggedIn && (
                  <Link to="/login" onClick={() => setShowLoginPopup(false)}>
                    <button className="login-signup-btn">Hi!</button>
                  </Link>
                )}
              </div>
              <div className="login-links-container">
                <Link to="/myaccount" style={{ textDecoration: "none" }} onClick={() => setShowLoginPopup(false)}>
                  <button className="login-link-item">
                    <FaUser className="login-icon" /> My Account
                  </button>
                </Link>
                <Link to="/myaccount" style={{ textDecoration: "none" }} onClick={() => setShowLoginPopup(false)}>
                  <button className="login-link-item">
                    <FaBoxOpen className="login-icon" /> Track Orders
                  </button>
                </Link>
                {isLoggedIn && (
                  <button className="login-link-item" onClick={handleLogout}>
                    <FaSignOutAlt className="login-icon" /> Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar;
