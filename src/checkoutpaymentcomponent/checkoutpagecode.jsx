import { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import {
  getUserIdFromCookie,
  getAddressesByUserId,
  createAddress,
  placeOrder,
  getAddressesFromLocal,
  saveAddressToLocal,
} from "../usercredentialscomponent/apiservice"
import "../Pages/C.css"
import PaymentForm from "../checkoutpaymentcomponent/paymentformcode"

const CheckoutPage = () => {
  const { cartItems: cart, clearCart, getTotalPrice } = useCart()
  // renamed to avoid conflict
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    paymentMethod: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  })

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [finalOrderItems, setFinalOrderItems] = useState([])
  const [finalTotal, setFinalTotal] = useState(0)

  const subtotal = getTotalPrice()
  const total = subtotal // No tax shown anywhere

  useEffect(() => {
    const loadAddresses = async () => {
      const userId = getUserIdFromCookie()
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        let addresses = await getAddressesByUserId(userId)
        if (!addresses || addresses.length === 0) {
          addresses = getAddressesFromLocal(userId)
        }
        setSavedAddresses(addresses || [])

        if (addresses?.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]
          setSelectedAddressId(defaultAddr.addressId)

          setFormData(prev => ({
            ...prev,
            firstName: defaultAddr.firstName || "",
            lastName: defaultAddr.lastName || "",
            email: defaultAddr.email || "",
            phone: defaultAddr.phone || "",
            houseNo: defaultAddr.houseNo || "",
            street: defaultAddr.street || "",
            locality: defaultAddr.locality || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            pincode: defaultAddr.pincode || "",
            country: defaultAddr.country || "India",
          }))
        }
      } catch (e) {
        console.log("Address load error:", e)
      } finally {
        setIsLoading(false)
      }
    }
    loadAddresses()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.addressId)
    setFormData(prev => ({
      ...prev,
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      email: addr.email || "",
      phone: addr.phone || "",
      houseNo: addr.houseNo || "",
      street: addr.street || "",
      locality: addr.locality || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
    }))
    setIsEditingAddress(false)
  }

  const handleShippingSubmit = async (e) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.houseNo || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill all required fields!")
      return
    }

    const userId = getUserIdFromCookie()
    if (!userId) return alert("Please login!")

    setIsLoading(true)

    try {
      const payload = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        houseNo: formData.houseNo,
        street: formData.street,
        locality: formData.locality || "",
        city: formData.city,
        state: formData.state,
        country: formData.country || "India",
        pincode: formData.pincode,
        isDefault: savedAddresses.length === 0,
      }

      let savedAddr = selectedAddressId
        ? savedAddresses.find(a => a.addressId === selectedAddressId)
        : null

      if (!savedAddr || isEditingAddress) {
        savedAddr = await createAddress(payload)
        if (savedAddr?.addressId) {
          saveAddressToLocal(userId, savedAddr)
          setSavedAddresses(prev => [...prev.filter(x => x.addressId !== savedAddr.addressId), savedAddr])
        }
      }

      setSelectedAddressId(savedAddr.addressId)
      setStep(2)
    } catch (err) {
      alert("Failed to save address")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderSuccess = (orderData) => {
    setFinalOrderItems([...cart])
    setFinalTotal(total)
    setOrderDetails(orderData)
    setOrderPlaced(true)
    clearCart()
  }

  const handleBack = () => (step === 2 ? setStep(1) : navigate(-1))
  const handleContinueShopping = () => navigate("/")

  const inputStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    borderRadius: "6px",
    boxSizing: "border-box",
  }

  if (isLoading && cart.length > 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid #eee", borderTop: "4px solid #000", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p>Loading your information...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <p style={{ fontSize: "18px" }}>Your bag is empty!</p>
        <button onClick={handleContinueShopping} style={{ padding: "12px 32px", background: "#000", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <br /><br /><br /><br />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff", borderBottom: "1px solid #eee", borderRadius: "8px 8px 0 0" }}>
          <h1 style={{ margin: 0, fontSize: "20px" }}>
            Checkout {step === 1 ? "(1/2) - Shipping" : "(2/2) - Payment"}
          </h1>
          <button onClick={handleBack} style={{ background: "none", border: "none", fontSize: "28px", cursor: "pointer" }}>×</button>
        </div>

        {/* ============ ORDER SUCCESS PAGE ============ */}
        {orderPlaced ? (
          <div style={{ background: "#fff", padding: "32px", marginTop: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ width: "90px", height: "90px", margin: "0 auto 20px", background: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="4">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 style={{ fontSize: "32px", margin: "0 0 8px", color: "#2e7d32" }}>Order Confirmed!</h1>
              <p style={{ fontSize: "18px", color: "#444" }}>Thank you for shopping with DripCo</p>
              <p style={{ fontSize: "20px", marginTop: "16px" }}>
                Order ID: <strong style={{ color: "#000" }}>{orderDetails?.id || "ORD-123456"}</strong>
              </p>
            </div>

            {/* Delivery Address */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "17px" }}>Delivery Address</h3>
              <p style={{ margin: 0, lineHeight: "1.7", fontSize: "15px" }}>
                <strong>{orderDetails?.customer?.name || "N/A"}</strong><br />
                {orderDetails?.customer?.address || "Address not found"}<br />
                Phone: {orderDetails?.customer?.phone || "N/A"}
              </p>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "17px", marginBottom: "16px" }}>Order Items</h3>
              {finalOrderItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid #eee" }}>
                  <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "16px" }}>{item.name}</div>
                    <div style={{ color: "#666", fontSize: "14px" }}>Size: {item.size} | Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Price Summary - NO TAX */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", fontSize: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>Subtotal</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#2e7d32" }}>
                <span>Shipping</span>
                <strong>FREE</strong>
              </div>
              <div style={{ borderTop: "2px solid #000", paddingTop: "12px", fontSize: "20px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                <span>Total Paid</span>
                <span>Rs.{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Tracking Info */}
            <div style={{ marginTop: "24px", padding: "16px", background: "#fff3e0", borderRadius: "8px", fontSize: "14px" }}>
              <p style={{ margin: "8px 0" }}><strong>Tracking ID:</strong> {orderDetails?.tracking || "TRACK123456"}</p>
              <p style={{ margin: "8px 0" }}><strong>Estimated Delivery:</strong> {orderDetails?.deliveryDate || "3-5 business days"}</p>
              <p style={{ margin: "8px 0" }}>Order confirmation sent to <strong>{orderDetails?.customer?.email}</strong></p>
            </div>

            <button
              onClick={handleContinueShopping}
              style={{ width: "100%", marginTop: "32px", padding: "16px", background: "#000", color: "#fff", border: "none", fontSize: "18px", borderRadius: "6px", cursor: "pointer" }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ============ CHECKOUT FLOW ============ */
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "20px" }}>
            {/* Shipping Step */}
            {step === 1 && (
              <div style={{ flex: "1", minWidth: "320px", background: "#fff", padding: "24px", borderRadius: "12px" }}>
                {/* Cart Items */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Your Items ({cart.length})</h3>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #eee" }}>
                      <img src={item.image || "https://via.placeholder.com/60"} alt="" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>{item.name}</div>
                        <div style={{ fontSize: "13px", color: "#666" }}>Size: {item.size} × {item.quantity}</div>
                        <div style={{ fontWeight: "600" }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && !isEditingAddress && (
                  <div style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "18px" }}>Saved Addresses</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(true)
                          setSelectedAddressId(null)
                          setFormData(prev => ({ ...prev, houseNo: "", street: "", locality: "", city: "", state: "", pincode: "" }))
                        }}
                        style={{ padding: "8px 16px", border: "1px solid #000", background: "transparent", borderRadius: "6px" }}
                      >
                        + Add New
                      </button>
                    </div>
                    {savedAddresses.map(addr => (
                      <div
                        key={addr.addressId}
                        onClick={() => handleAddressSelect(addr)}
                        style={{
                          padding: "16px",
                          border: selectedAddressId === addr.addressId ? "2px solid #000" : "1px solid #ddd",
                          borderRadius: "10px",
                          background: selectedAddressId === addr.addressId ? "#f8f9fa" : "#fff",
                          cursor: "pointer",
                          marginBottom: "12px"
                        }}
                      >
                        <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                          {addr.firstName} {addr.lastName}
                          {addr.isDefault && <span style={{ marginLeft: "10px", background: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" }}>DEFAULT</span>}
                        </div>
                        <div style={{ fontSize: "14px", color: "#555" }}>
                          {addr.phone}<br />
                          {addr.houseNo}, {addr.street}{addr.locality && `, ${addr.locality}`}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shipping Form */}
                <form onSubmit={handleShippingSubmit}>
                  <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
                    {savedAddresses.length > 0 && !isEditingAddress ? "Contact Information" : "Shipping Address"}
                  </h2>

                  <div style={{ display: "grid", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} required style={inputStyle} />
                      <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} required style={inputStyle} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} required style={inputStyle} />
                      <input name="phone" placeholder="Phone *" value={formData.phone} onChange={handleInputChange} required style={inputStyle} />
                    </div>

                    {(savedAddresses.length === 0 || isEditingAddress) && (
                      <>
                        <input name="houseNo" placeholder="House/Flat No *" value={formData.houseNo} onChange={handleInputChange} required style={inputStyle} />
                        <input name="street" placeholder="Street/Road *" value={formData.street} onChange={handleInputChange} required style={inputStyle} />
                        <input name="locality" placeholder="Locality (Optional)" value={formData.locality} onChange={handleInputChange} style={inputStyle} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <input name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} required style={inputStyle} />
                          <input name="state" placeholder="State *" value={formData.state} onChange={handleInputChange} required style={inputStyle} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <input name="pincode" placeholder="Pincode *" value={formData.pincode} onChange={handleInputChange} required style={inputStyle} />
                          <input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} style={inputStyle} />
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{ width: "100%", padding: "16px", background: "#000", color: "#fff", border: "none", marginTop: "20px", fontSize: "17px", borderRadius: "6px" }}
                    >
                      {isLoading ? "Saving Address..." : "Proceed to Payment"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Step */}
            {step === 2 && (
              <PaymentForm
                formData={formData}
                setFormData={setFormData}
                total={total}
                cart={cart}
                selectedAddressId={selectedAddressId}
                onOrderSuccess={handleOrderSuccess}
                onBack={() => setStep(1)}
                isPlacingOrder={isPlacingOrder}
                setIsPlacingOrder={setIsPlacingOrder}
              />
            )}

            {/* Order Summary Sidebar */}
            <div style={{ flex: "0 0 340px", background: "#fff", padding: "24px", borderRadius: "12px", position: "sticky", top: "20px", alignSelf: "flex-start" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Order Summary</h2>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: "15px" }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: "600" }}>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #ccc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#2e7d32", fontWeight: "600" }}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div style={{ borderTop: "2px solid #000", marginTop: "16px", paddingTop: "12px", fontSize: "22px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: "20px", padding: "12px", background: "#e8f5e9", borderRadius: "8px", fontSize: "13px", color: "#2e7d32" }}>
                <strong>FREE Shipping</strong> on all orders<br />
                Estimated delivery: 3-5 business days
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage;












