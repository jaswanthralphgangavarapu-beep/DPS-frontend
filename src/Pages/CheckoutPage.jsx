"use client"

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

const CheckoutPage = () => {
  const { cartItems: cart, clearCart, getTotalPrice } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedAddressDbId, setSelectedAddressDbId] = useState(null)
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
  const [orderNumber, setOrderNumber] = useState("") // New state for order number

  const subtotal = getTotalPrice()
  const tax = Math.round(subtotal * 0.18)
  const shipping = 0
  const total = subtotal + tax + shipping

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserIdFromCookie()
      console.log("[v0] CheckoutPage mounted, userId from cookie:", userId)

      if (!userId) {
        console.log("[v0] No userId found, showing new address form")
        setIsLoading(false)
        return
      }

      try {
        // First try API, it will automatically fallback to localStorage if it fails
        let addresses = await getAddressesByUserId(userId)
        console.log("[v0] Loaded addresses (API or localStorage):", addresses)

        // If still empty, check localStorage directly as extra safety
        if (!addresses || addresses.length === 0) {
          console.log("[v0] No addresses from API, checking localStorage directly")
          addresses = getAddressesFromLocal(userId)
          console.log("[v0] Addresses from localStorage:", addresses)
        }

        setSavedAddresses(addresses || [])

        // If user has addresses, select the default one or first one
        if (addresses && addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]
          setSelectedAddressId(defaultAddr.addressId)
          setSelectedAddressDbId(defaultAddr.id)

          // Pre-fill form with selected address
          setFormData((prev) => ({
            ...prev,
            houseNo: defaultAddr.houseNo || "",
            street: defaultAddr.street || "",
            locality: defaultAddr.locality || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            country: defaultAddr.country || "India",
            pincode: defaultAddr.pincode || "",
          }))

          console.log("[v0] Pre-filled form with saved address:", defaultAddr.addressId)
        }
      } catch (error) {
        console.log("[v0] Error fetching addresses (non-fatal):", error)
        // Last resort: try localStorage
        const localAddresses = getAddressesFromLocal(userId)
        if (localAddresses.length > 0) {
          setSavedAddresses(localAddresses)
          const defaultAddr = localAddresses[0]
          setSelectedAddressId(defaultAddr.addressId)
          setSelectedAddressDbId(defaultAddr.id)
          setFormData((prev) => ({
            ...prev,
            houseNo: defaultAddr.houseNo || "",
            street: defaultAddr.street || "",
            locality: defaultAddr.locality || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            country: defaultAddr.country || "India",
            pincode: defaultAddr.pincode || "",
          }))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.addressId)
    setSelectedAddressDbId(address.id)
    setFormData((prev) => ({
      ...prev,
      houseNo: address.houseNo || "",
      street: address.street || "",
      locality: address.locality || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      pincode: address.pincode || "",
    }))
    setIsEditingAddress(false)
  }

  const handleShippingSubmit = async (e) => {
    e.preventDefault()
    console.log("[v0] handleShippingSubmit called")

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.houseNo ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill all required fields!")
      return
    }

    const userId = getUserIdFromCookie()
    console.log("[v0] userId from cookie:", userId)

    if (!userId) {
      alert("Please login to continue!")
      return
    }

    setIsLoading(true)

    try {
      const addressPayload = {
        userId: userId,
        houseNo: formData.houseNo,
        street: formData.street,
        locality: formData.locality || "",
        city: formData.city,
        state: formData.state,
        country: formData.country || "India",
        pincode: formData.pincode,
        isDefault: savedAddresses.length === 0,
      }

      console.log("[v0] Address payload:", addressPayload)

      let savedAddress

      if (savedAddresses.length > 0 && !isEditingAddress && selectedAddressId) {
        // Use existing address, no need to create again
        console.log("[v0] Using existing saved address:", selectedAddressId)
        savedAddress = savedAddresses.find((a) => a.addressId === selectedAddressId) || savedAddresses[0]
      } else {
        // Create new address
        console.log("[v0] Creating new address...")
        savedAddress = await createAddress(addressPayload)

        if (savedAddress && savedAddress.addressId) {
          saveAddressToLocal(userId, savedAddress)
          // Update local state
          setSavedAddresses((prev) => {
            const exists = prev.find((a) => a.addressId === savedAddress.addressId)
            if (exists) return prev
            return [...prev, savedAddress]
          })
        }
      }

      console.log("[v0] Using address:", savedAddress)

      if (savedAddress && savedAddress.addressId) {
        setSelectedAddressId(savedAddress.addressId)
        setSelectedAddressDbId(savedAddress.id)
        console.log("[v0] Address ready, addressId:", savedAddress.addressId)
      }

      // Try to refresh addresses but don't fail if it errors
      try {
        const updatedAddresses = await getAddressesByUserId(userId)
        setSavedAddresses(updatedAddresses || [])
      } catch (refreshError) {
        console.log("[v0] Failed to refresh addresses (non-fatal):", refreshError)
      }

      // Move to payment step
      console.log("[v0] Moving to step 2 (payment)")
      setStep(2)
    } catch (error) {
      console.error("[v0] Error in handleShippingSubmit:", error)
      alert("Failed to save address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    console.log("[v0] handlePaymentSubmit called")

    if (!formData.paymentMethod) {
      alert("Please select a payment method!")
      return
    }

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
        alert("Please fill all card details!")
        return
      }
    }

    if (formData.paymentMethod === "upi" && !formData.upiId.includes("@")) {
      alert("Enter valid UPI ID")
      return
    }

    const userId = getUserIdFromCookie()
    console.log("[v0] userId:", userId, "selectedAddressId:", selectedAddressId)

    if (!userId) {
      alert("Missing user information! Please login again.")
      return
    }

    // Use selectedAddressId if available, otherwise create a temporary one
    let addressIdToUse = selectedAddressId
    if (!addressIdToUse) {
      // Generate a temporary address ID if we don't have one
      addressIdToUse = "ADDR-" + Math.random().toString(36).substring(2, 10).toUpperCase()
      console.log("[v0] Generated temporary addressId:", addressIdToUse)
    }

    setIsPlacingOrder(true)

    try {
      console.log("[v0] Cart items to order:", cart)

      const placedOrders = []

      // Place order for each cart item
      for (const item of cart) {
        const orderPayload = {
          userId: userId,
          addressId: addressIdToUse,
          productId: String(item.productId || item.id || "PROD-" + Date.now()),
          productTitle: item.name || "Unknown Product",
          productCategory: item.category || "General",
          productSize: item.size || "N/A",
          unitPrice: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }

        console.log("[v0] Placing order for item:", orderPayload)

        try {
          const placedOrder = await placeOrder(orderPayload)
          console.log("[v0] Order placed successfully:", placedOrder)
          placedOrders.push(placedOrder)
        } catch (orderError) {
          console.error("[v0] Failed to place order for item:", item.name, orderError)
          throw orderError
        }
      }

      console.log("[v0] All orders placed:", placedOrders)

      // Store order locally for order display
      const orderDate = new Date().toISOString().split("T")[0]
      const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const newOrder = {
        // Use placed order's ID if available, otherwise generate one
        id: placedOrders.length > 0 ? placedOrders[0].orderId : "ORD-" + Date.now(),
        items: [...cart],
        total: total,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        status: "PLACED",
        orderDate: orderDate,
        deliveryDate: deliveryDate,
        tracking: "TRACK" + Math.floor(Math.random() * 1000000),
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.houseNo}, ${formData.street}, ${formData.locality ? formData.locality + ", " : ""}${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        orders: placedOrders,
      }

      // Save to localStorage for order history
      const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
      existingOrders.unshift(newOrder)
      localStorage.setItem("userOrders", JSON.stringify(existingOrders))

      // Show success
      setFinalOrderItems([...cart])
      setFinalTotal(total)
      setOrderDetails(newOrder)
      setOrderPlaced(true)
      // Set the order number
      setOrderNumber(newOrder.id)
      clearCart()

      console.log("[v0] Order flow completed successfully!")
    } catch (error) {
      console.error("[v0] Error placing order:", error)
      alert("Failed to place order. Please try again. Error: " + error.message)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    else navigate(-1)
  }

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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f9f9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="loading-spinner"
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #eee",
              borderTop: "4px solid #000",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p>Loading your information...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", fontSize: "18px" }}>
        <p>Your bag is empty!</p>
        <button
          onClick={handleContinueShopping}
          style={{
            padding: "12px 24px",
            background: "#000",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9f9f9",
        padding: "0",
        margin: "0",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <br />
        <br />
        <br />
        <br />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            background: "#fff",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "20px" }}>
            Checkout {step === 1 ? "(1/2) - Shipping" : "(2/2) - Payment"}
          </h1>
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>

        {orderPlaced ? (
          // Order Success View
          <div style={{ background: "#fff", padding: "24px", marginTop: "20px", borderRadius: "8px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 16px",
                  background: "#e8f5e9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 style={{ fontSize: "28px", margin: "0 0 8px", color: "#2e7d32" }}>Order Confirmed!</h1>
              <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>Thank you for shopping with DripCo</p>
              <p style={{ margin: "8px 0 0", fontSize: "18px" }}>
                Order ID: <strong>{orderDetails?.id}</strong>
              </p>
            </div>

            <div
              style={{
                background: "#f5f5f5",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "16px", margin: "0 0 12px", color: "#333" }}>Delivery Address</h3>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#555" }}>
                {orderDetails?.customer?.name}
                <br />
                {orderDetails?.customer?.address}
                <br />
                Phone: {orderDetails?.customer?.phone}
              </p>
            </div>

            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <h3 style={{ fontSize: "16px", margin: "16px 0 12px" }}>Order Summary</h3>
              {finalOrderItems.map((item, index) => (
                <div
                  key={item.cartId || index}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500" }}>{item.name}</div>
                    <div style={{ color: "#666", fontSize: "13px" }}>
                      Size: {item.size} | Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}

              <div style={{ borderTop: "1px solid #eee", margin: "12px 0", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Subtotal:</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Tax (18%):</span>
                  <span>Rs.{tax.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span>Shipping:</span>
                  <span style={{ color: "green" }}>FREE</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "2px solid #000",
                  }}
                >
                  <span>TOTAL PAID:</span>
                  <span>Rs.{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "#fff3e0",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#e65100",
              }}
            >
              <p style={{ margin: "0 0 8px" }}>
                <strong>Tracking:</strong> {orderDetails?.tracking}
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <strong>Estimated Delivery:</strong> {orderDetails?.deliveryDate} (3-5 business days)
              </p>
              <p style={{ margin: 0 }}>
                <strong>Confirmation:</strong> Sent to {orderDetails?.customer?.email}
              </p>
            </div>

            <button
              onClick={handleContinueShopping}
              style={{
                width: "100%",
                background: "#000",
                color: "#fff",
                padding: "16px",
                border: "none",
                fontSize: "16px",
                marginTop: "24px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Checkout Form
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div style={{ flex: "1", minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
                {/* Cart Items Preview */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "16px", margin: "0 0 12px", fontWeight: "600" }}>
                    Your Items ({cart.length})
                  </h3>
                  <div style={{ maxHeight: "250px", overflowY: "auto", paddingRight: "8px" }}>
                    {cart.map((item, index) => (
                      <div
                        key={item.cartId || index}
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "10px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            flexShrink: 0,
                            background: "#f5f5f5",
                            borderRadius: "6px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={item.image || "https://via.placeholder.com/60"}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, fontSize: "13px" }}>
                          <div style={{ fontWeight: "500" }}>{item.name}</div>
                          <div style={{ color: "#666", margin: "4px 0" }}>
                            Size: {item.size} | Qty: {item.quantity}
                          </div>
                          <div style={{ fontWeight: "600" }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && !isEditingAddress && (
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <h3 style={{ fontSize: "16px", margin: 0, fontWeight: "600" }}>Saved Addresses</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(true)
                          setSelectedAddressId(null)
                          setSelectedAddressDbId(null)
                          setFormData((prev) => ({
                            ...prev,
                            houseNo: "",
                            street: "",
                            locality: "",
                            city: "",
                            state: "",
                            pincode: "",
                          }))
                        }}
                        style={{
                          background: "none",
                          border: "1px solid #000",
                          padding: "6px 12px",
                          fontSize: "12px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        + Add New
                      </button>
                    </div>

                    <div style={{ display: "grid", gap: "10px" }}>
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.addressId}
                          onClick={() => handleAddressSelect(addr)}
                          style={{
                            padding: "12px",
                            border: selectedAddressId === addr.addressId ? "2px solid #000" : "1px solid #ddd",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: selectedAddressId === addr.addressId ? "#f5f5f5" : "#fff",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
                              <strong>
                                {addr.houseNo}, {addr.street}
                              </strong>
                              {addr.locality && <>, {addr.locality}</>}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                              <br />
                              {addr.country}
                            </div>
                            {addr.isDefault && (
                              <span
                                style={{
                                  background: "#e8f5e9",
                                  color: "#2e7d32",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                }}
                              >
                                DEFAULT
                              </span>
                            )}
                          </div>
                          {selectedAddressId === addr.addressId && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsEditingAddress(true)
                              }}
                              style={{
                                marginTop: "8px",
                                background: "none",
                                border: "none",
                                color: "#1976d2",
                                fontSize: "12px",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              Edit this address
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Form */}
                <form onSubmit={handleShippingSubmit}>
                  <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>
                    {savedAddresses.length > 0 && !isEditingAddress ? "Contact Information" : "Shipping Information"}
                  </h2>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {/* Contact Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </div>

                    {/* Address Fields - Show if no saved address or editing */}
                    {(savedAddresses.length === 0 || isEditingAddress) && (
                      <>
                        <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", marginTop: "4px" }}>
                          <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#666" }}>
                            {isEditingAddress ? "Edit Address" : "Delivery Address"}
                          </h4>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                          <input
                            type="text"
                            name="houseNo"
                            placeholder="House/Flat No *"
                            value={formData.houseNo}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          />
                          <input
                            type="text"
                            name="street"
                            placeholder="Street/Road *"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <input
                          type="text"
                          name="locality"
                          placeholder="Locality/Landmark"
                          value={formData.locality}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <input
                            type="text"
                            name="city"
                            placeholder="City *"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          />
                          <input
                            type="text"
                            name="state"
                            placeholder="State *"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode *"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          />
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleInputChange}
                            style={inputStyle}
                          />
                        </div>

                        {isEditingAddress && savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingAddress(false)
                              if (savedAddresses.length > 0) {
                                handleAddressSelect(savedAddresses[0])
                              }
                            }}
                            style={{
                              background: "#f5f5f5",
                              border: "none",
                              padding: "10px",
                              fontSize: "14px",
                              cursor: "pointer",
                              borderRadius: "6px",
                            }}
                          >
                            Cancel - Use Saved Address
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      background: isLoading ? "#ccc" : "#000",
                      color: "#fff",
                      padding: "14px",
                      border: "none",
                      marginTop: "20px",
                      fontSize: "16px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    {isLoading ? "Saving..." : "Proceed to Payment"}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={{ flex: "1", minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
                {/* Delivery Address Summary */}
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "14px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: "14px" }}>Delivering to:</h4>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1976d2",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Change
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#555" }}>
                    <strong>
                      {formData.firstName} {formData.lastName}
                    </strong>
                    <br />
                    {formData.houseNo}, {formData.street}
                    {formData.locality && <>, {formData.locality}</>}
                    <br />
                    {formData.city}, {formData.state} - {formData.pincode}
                    <br />
                    Phone: {formData.phone}
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Select Payment Method</h2>

                  <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                    {[
                      { value: "card", label: "Credit/Debit Card", icon: "CARD" },
                      { value: "upi", label: "UPI (Google Pay, PhonePe)", icon: "UPI" },
                      { value: "netbanking", label: "Net Banking", icon: "BANK" },
                      { value: "cod", label: "Cash on Delivery", icon: "COD" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px",
                          border: formData.paymentMethod === method.value ? "2px solid #000" : "1px solid #ddd",
                          borderRadius: "8px",
                          background: formData.paymentMethod === method.value ? "#f5f5f5" : "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleInputChange}
                          style={{ width: "18px", height: "18px" }}
                        />
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#666" }}>{method.icon}</span>
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === "card" && (
                    <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>Card Details</h4>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        style={inputStyle}
                        maxLength="19"
                      />
                      <input
                        type="text"
                        name="cardName"
                        placeholder="Name on Card"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, marginTop: "10px" }}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          style={inputStyle}
                          maxLength="5"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          style={inputStyle}
                          maxLength="4"
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {formData.paymentMethod === "upi" && (
                    <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 12px", fontSize: "14px" }}>UPI Details</h4>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="UPI ID (e.g. name@oksbi)"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        style={inputStyle}
                      />
                      <p style={{ fontSize: "12px", color: "#666", margin: "8px 0 0" }}>
                        You will receive a payment request on your UPI app
                      </p>
                    </div>
                  )}

                  {/* Net Banking */}
                  {formData.paymentMethod === "netbanking" && (
                    <div style={{ borderTop: "1px solid #eee", padding: "16px 0", textAlign: "center", color: "#666" }}>
                      <p style={{ margin: 0 }}>You will be redirected to your bank's website</p>
                    </div>
                  )}

                  {/* COD Notice */}
                  {formData.paymentMethod === "cod" && (
                    <div
                      style={{
                        borderTop: "1px solid #eee",
                        padding: "16px",
                        background: "#fff3e0",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "13px", color: "#e65100" }}>
                        Pay Rs.{total.toLocaleString()} when your order arrives.
                        <br />
                        Please keep exact change ready.
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1,
                        background: "#f5f5f5",
                        color: "#000",
                        padding: "14px",
                        border: "none",
                        fontSize: "15px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPlacingOrder || !formData.paymentMethod}
                      style={{
                        flex: 2,
                        background: isPlacingOrder || !formData.paymentMethod ? "#ccc" : "#000",
                        color: "#fff",
                        padding: "14px",
                        border: "none",
                        fontSize: "16px",
                        cursor: isPlacingOrder || !formData.paymentMethod ? "not-allowed" : "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      {isPlacingOrder
                        ? "Placing Order..."
                        : formData.paymentMethod === "cod"
                          ? "Confirm Order"
                          : `Pay Rs.${total.toLocaleString()}`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Order Summary Sidebar */}
            <div
              style={{
                flex: "0 0 320px",
                background: "#fff",
                padding: "16px",
                position: "sticky",
                top: "100px",
                alignSelf: "flex-start",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ fontSize: "18px", margin: "0 0 12px" }}>Order Summary</h2>
              <div style={{ fontSize: "14px" }}>
                {cart.map((item, index) => (
                  <div
                    key={item.cartId || index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      {item.name} <span style={{ color: "#666" }}>x{item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: "500" }}>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1px dashed #ccc", margin: "12px 0", paddingTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>Subtotal:</span>
                    <span>Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>Tax (18%):</span>
                    <span>Rs.{tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span>Shipping:</span>
                    <span style={{ color: "green" }}>FREE</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "2px solid #000",
                    }}
                  >
                    <span>Total:</span>
                    <span>Rs.{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "#e8f5e9",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#2e7d32",
                }}
              >
                <strong>FREE Shipping</strong> on all orders!
                <br />
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
