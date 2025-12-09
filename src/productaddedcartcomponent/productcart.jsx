import { useNavigate } from "react-router-dom"
import { FaTrash, FaShoppingBag, FaArrowLeft } from "react-icons/fa"
import { useCart } from "../context/CartContext"
import "../productaddedcartcomponent/productcartdesign.css"

const ProductCart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  const handleContinueShopping = () => {
    navigate("/")
  }

  const handleCheckout = () => {
    alert("Proceeding to checkout...")
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart-section">
            <FaShoppingBag className="empty-cart-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={handleContinueShopping}>
            <FaArrowLeft /> Back to Shopping
          </button>
          <h1>Shopping Cart ({getTotalItems()} items)</h1>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.cartId} className="cart-item-card">
                <div className="cart-item-image-wrapper">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-size">Size: {item.size}</p>

                  <div className="cart-item-quantity-section">
                    <span className="quantity-label">Quantity:</span>
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price-section">
                    <span className="item-price">₹{item.price}</span>
                    <span className="item-total">Total: ₹{item.price * item.quantity}</span>
                  </div>
                </div>

                <button className="remove-item-btn" onClick={() => removeFromCart(item.cartId)}>
                  <FaTrash />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₹{getTotalPrice()}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>₹0</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-price">₹{getTotalPrice()}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button className="continue-shopping-link" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>

             
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCart;
