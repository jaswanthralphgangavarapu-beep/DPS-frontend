"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaBox, FaMapMarkerAlt, FaEdit, FaPlus } from "react-icons/fa"
import {
  getUserIdFromCookie,
  getAddressesByUserId,
  getOrdersByUserId,
  createAddress,
  updateAddress,
} from "../usercredentialscomponent/apiservice"

const API_BASE = "http://195.35.45.56:4646"

const MyAccountPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("orders")
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [userId, setUserId] = useState(null)

  const [addressForm, setAddressForm] = useState({
    houseNo: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    isDefault: false,
  })

  useEffect(() => {
    const currentUserId = getUserIdFromCookie()

    if (!currentUserId) {
      navigate("/login")
      return
    }

    setUserId(currentUserId)
    fetchUserData(currentUserId)
  }, [navigate])

  const fetchUserData = async (uid) => {
    setIsLoading(true)
    try {
      const [ordersData, addressesData] = await Promise.all([getOrdersByUserId(uid), getAddressesByUserId(uid)])

      setOrders(ordersData)
      setAddresses(addressesData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    if (!userId) return

    try {
      const payload = {
        userId: userId,
        ...addressForm,
      }

      if (editingAddress) {
        await updateAddress(editingAddress.id, payload)
      } else {
        await createAddress(payload)
      }

      // Refresh addresses
      const updatedAddresses = await getAddressesByUserId(userId)
      setAddresses(updatedAddresses)

      // Reset form
      setShowAddressForm(false)
      setEditingAddress(null)
      setAddressForm({
        houseNo: "",
        street: "",
        locality: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        isDefault: false,
      })
    } catch (error) {
      console.error("Error saving address:", error)
      alert("Failed to save address")
    }
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressForm({
      houseNo: address.houseNo || "",
      street: address.street || "",
      locality: address.locality || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "India",
      pincode: address.pincode || "",
      isDefault: address.isDefault || false,
    })
    setShowAddressForm(true)
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "#2196f3"
      case "PROCESSING":
        return "#ff9800"
      case "SHIPPED":
        return "#9c27b0"
      case "DELIVERED":
        return "#4caf50"
      case "CANCELLED":
        return "#f44336"
      default:
        return "#666"
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <p>Loading your account...</p>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        paddingTop: "120px",
        paddingBottom: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", margin: "0 0 8px" }}>My Account</h1>
          <p style={{ color: "#666", margin: 0 }}>User ID: {userId}</p>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {/* Sidebar */}
          <div
            style={{
              width: "240px",
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              height: "fit-content",
            }}
          >
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: activeTab === "orders" ? "#000" : "transparent",
                color: activeTab === "orders" ? "#fff" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              <FaBox /> My Orders
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: activeTab === "addresses" ? "#000" : "transparent",
                color: activeTab === "addresses" ? "#fff" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              <FaMapMarkerAlt /> Addresses
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: activeTab === "profile" ? "#000" : "transparent",
                color: activeTab === "profile" ? "#fff" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
              }}
            >
              <FaUser /> Profile
            </button>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "20px", margin: "0 0 20px" }}>My Orders</h2>

                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <FaBox size={48} color="#ccc" />
                    <p style={{ color: "#666", marginTop: "16px" }}>No orders yet</p>
                    <button
                      onClick={() => navigate("/")}
                      style={{
                        marginTop: "12px",
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
                  <div style={{ display: "grid", gap: "16px" }}>
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: "8px",
                          padding: "16px",
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#f5f5f5",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaBox size={32} color="#999" />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "8px",
                            }}
                          >
                            <div>
                              <h4 style={{ margin: "0 0 4px", fontSize: "15px" }}>{order.productTitle}</h4>
                              <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Order ID: {order.orderId}</p>
                            </div>
                            <span
                              style={{
                                background: getStatusColor(order.status) + "20",
                                color: getStatusColor(order.status),
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#666" }}>
                            <span>Size: {order.productSize}</span>
                            <span>Qty: {order.quantity}</span>
                            <span style={{ fontWeight: "600", color: "#000" }}>
                              ₹{order.subtotal?.toLocaleString()}
                            </span>
                          </div>

                          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#999" }}>
                            Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2 style={{ fontSize: "20px", margin: 0 }}>My Addresses</h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null)
                      setAddressForm({
                        houseNo: "",
                        street: "",
                        locality: "",
                        city: "",
                        state: "",
                        country: "India",
                        pincode: "",
                        isDefault: false,
                      })
                      setShowAddressForm(true)
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <FaPlus /> Add New
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleAddressSubmit}
                    style={{
                      background: "#f5f5f5",
                      padding: "20px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 16px" }}>{editingAddress ? "Edit Address" : "Add New Address"}</h4>

                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="House/Flat No *"
                          value={addressForm.houseNo}
                          onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
                          required
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="Street/Road *"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                          style={inputStyle}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Locality/Landmark"
                        value={addressForm.locality}
                        onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                        style={inputStyle}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="City *"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="State *"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="Pincode *"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          required
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          style={inputStyle}
                        />
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        />
                        <span style={{ fontSize: "14px" }}>Set as default address</span>
                      </label>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false)
                          setEditingAddress(null)
                        }}
                        style={{
                          padding: "10px 20px",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "10px 20px",
                          background: "#000",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {editingAddress ? "Update Address" : "Save Address"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                {addresses.length === 0 && !showAddressForm ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <FaMapMarkerAlt size={48} color="#ccc" />
                    <p style={{ color: "#666", marginTop: "16px" }}>No addresses saved</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "12px" }}>
                    {addresses.map((addr) => (
                      <div
                        key={addr.addressId}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: "8px",
                          padding: "16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                          <strong>
                            {addr.houseNo}, {addr.street}
                          </strong>
                          {addr.locality && <>, {addr.locality}</>}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                          <br />
                          {addr.country}
                          {addr.isDefault && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: "8px",
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
                        <button
                          onClick={() => handleEditAddress(addr)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#1976d2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px" }}>
                <h2 style={{ fontSize: "20px", margin: "0 0 20px" }}>Profile</h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#f5f5f5",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaUser size={32} color="#999" />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>DripCo Customer</h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>User ID: {userId}</p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <p style={{ margin: "0 0 8px" }}>
                    <strong>Total Orders:</strong> {orders.length}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Saved Addresses:</strong> {addresses.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
}

export default MyAccountPage;
