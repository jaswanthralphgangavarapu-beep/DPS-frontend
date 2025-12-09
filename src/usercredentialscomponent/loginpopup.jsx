"use client"

import { useState } from "react"
import { FaTimes, FaUser, FaPhone } from "react-icons/fa"

const API_BASE = "http://195.35.45.56:4646/api/v2"

const DripLoginPopup = ({ onClose, onRegisterSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccessMessage("")
  }

  // Check if user exists by phone number
  const findUserByPhone = async (phoneNumber) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!response.ok) {
        return null
      }

      const users = await response.json()
      // Find user with matching phone number
      const existingUser = users.find((user) => user.phoneNumber === phoneNumber)
      return existingUser || null
    } catch (err) {
      console.error("Error checking user:", err)
      return null
    }
  }

  // Create new user
  const createUser = async (name, phoneNumber) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name,
          phoneNumber: phoneNumber,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create account")
      }

      const newUser = await response.json()
      return newUser
    } catch (err) {
      throw err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number")
      setIsLoading(false)
      return
    }

    // Validate name
    if (formData.name.trim().length < 2) {
      setError("Please enter a valid name")
      setIsLoading(false)
      return
    }

    try {
      // First check if user already exists
      const existingUser = await findUserByPhone(formData.phoneNumber)

      if (existingUser) {
        // User exists - log them in
        setSuccessMessage(`Welcome back, ${existingUser.name}!`)
        setTimeout(() => {
          onRegisterSuccess(existingUser.userId)
        }, 1000)
      } else {
        // New user - create account
        const newUser = await createUser(formData.name, formData.phoneNumber)
        setSuccessMessage(`Account created! Welcome, ${newUser.name}!`)
        setTimeout(() => {
          onRegisterSuccess(newUser.userId)
        }, 1000)
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #000 0%, #333 100%)",
            padding: "24px",
            color: "#fff",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <FaTimes size={14} />
          </button>

          <h2 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "700" }}>Welcome to DripCo</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>Enter your details to continue shopping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: "#e8f5e9",
                color: "#2e7d32",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Name Input */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <FaUser
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "14px 14px 14px 42px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          {/* Phone Number Input */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <FaPhone
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (10 digits)"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              maxLength={10}
              style={{
                width: "100%",
                padding: "14px 14px 14px 42px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "15px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || successMessage}
            style={{
              width: "100%",
              padding: "14px",
              background: isLoading || successMessage ? "#666" : "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading || successMessage ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isLoading ? "Please wait..." : successMessage ? "Redirecting..." : "Continue"}
          </button>

          <p
            style={{
              textAlign: "center",
              margin: "16px 0 0",
              fontSize: "12px",
              color: "#888",
            }}
          >
            We'll use your phone number to identify you
          </p>
        </form>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            background: "#f5f5f5",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          By continuing, you agree to DripCo's{" "}
          <a href="#" style={{ color: "#000", textDecoration: "none" }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "#000", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}

export default DripLoginPopup;
