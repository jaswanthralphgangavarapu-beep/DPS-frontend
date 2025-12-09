"use client"

import { useEffect, useState } from "react"
import { getUserIdFromCookie, placeOrder } from "../usercredentialscomponent/apiservice"

const PaymentForm = ({
  formData,
  setFormData,
  total,
  cart,
  selectedAddressId,
  onOrderSuccess,
  onBack,
  isPlacingOrder,
  setIsPlacingOrder,
}) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [generatedOrderId, setGeneratedOrderId] = useState(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
      console.log("[v0] Razorpay script loaded successfully")
    }
    script.onerror = () => {
      console.error("[v0] Failed to load Razorpay script")
      setPaymentError("Failed to load payment gateway. Please try again.")
    }
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const createRazorpayOrder = async () => {
    try {
      console.log("[v0] Creating Razorpay order...")
      const userId = getUserIdFromCookie()

      const orderId = generatedOrderId || "ORD-" + Date.now()
      setGeneratedOrderId(orderId)
      console.log("[v0] Generated orderId:", orderId)

      const response = await fetch("http://localhost:4646/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          userId,
          orderId,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      const orderData = await response.json()
      console.log("[v0] Razorpay order created:", orderData)
      return orderData
    } catch (error) {
      console.error("[v0] Error creating Razorpay order:", error)
      setPaymentError("Failed to create payment order. Please try again.")
      throw error
    }
  }

  const handleRazorpayPayment = async (e) => {
    e.preventDefault()
    console.log("[v0] handleRazorpayPayment called")

    if (!razorpayLoaded) {
      setPaymentError("Payment gateway is loading. Please try again.")
      return
    }

    setIsProcessing(true)
    setPaymentError("")
    setIsPlacingOrder(true)

    try {
      // Create order on backend
      const orderData = await createRazorpayOrder()

      const userId = getUserIdFromCookie()

      const options = {
        key: orderData.keyId,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "DripCo Store",
        description: "Purchase from DripCo Store",
        order_id: orderData.razorpayOrderId,
        customer_notif: 1,
        notify: {
          sms: 1,
          email: 1,
        },
        handler: async (response) => {
          console.log("[v0] Payment successful, verifying on backend...", response)

          try {
            const verifyResponse = await fetch("http://localhost:4646/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }

            const verificationData = await verifyResponse.json()
            console.log("[v0] Payment verified successfully:", verificationData)

            const placedOrders = []
            for (const item of cart) {
              const orderPayload = {
                userId,
                addressId: selectedAddressId,
                productId: String(item.productId || item.id || "PROD-" + Date.now()),
                productTitle: item.name || "Unknown Product",
                productCategory: item.category || "General",
                productSize: item.size || "N/A",
                unitPrice: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
              }

              console.log("[v0] Placing order with payload:", orderPayload)
              const placedOrder = await placeOrder(orderPayload)
              placedOrders.push(placedOrder)
              console.log("[v0] Order placed successfully:", placedOrder)
            }

            const orderDate = new Date().toISOString().split("T")[0]
            const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

            const newOrder = {
              id: placedOrders.length > 0 ? placedOrders[0].orderId : generatedOrderId || "ORD-" + Date.now(),
              items: [...cart],
              total,
              subtotal: total,
              tax: 0,
              shipping: 0,
              status: "PAID",
              orderDate,
              deliveryDate,
              tracking: response.razorpay_payment_id,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              customer: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.houseNo}, ${formData.street}, ${
                  formData.locality ? formData.locality + ", " : ""
                }${formData.city}, ${formData.state} - ${formData.pincode}`,
              },
              orders: placedOrders,
            }

            // Store order in localStorage
            const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
            existingOrders.unshift(newOrder)
            localStorage.setItem("userOrders", JSON.stringify(existingOrders))

            console.log("[v0] Order success, calling onOrderSuccess")
            onOrderSuccess(newOrder)
          } catch (verifyError) {
            console.error("[v0] Payment verification failed:", verifyError)
            setPaymentError("Payment verified but order placement failed. Please contact support.")
            setIsProcessing(false)
            setIsPlacingOrder(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: () => {
            console.log("[v0] Payment modal closed by user")
            setIsProcessing(false)
            setIsPlacingOrder(false)
            setPaymentError("Payment was cancelled. Please try again.")
          },
        },
      }

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        throw new Error("Razorpay is not loaded")
      }
    } catch (error) {
      console.error("[v0] Error in handleRazorpayPayment:", error)
      setPaymentError(error.message || "Payment processing failed. Please try again.")
      setIsProcessing(false)
      setIsPlacingOrder(false)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    console.log("[v0] handlePaymentSubmit called, method:", formData.paymentMethod)

    if (!formData.paymentMethod) {
      alert("Please select a payment method!")
      return
    }

    if (formData.paymentMethod === "razorpay") {
      await handleRazorpayPayment(e)
      return
    }

    if (formData.paymentMethod === "cod") {
      const userId = getUserIdFromCookie()
      if (!userId) {
        alert("Please login first!")
        return
      }

      setIsPlacingOrder(true)
      try {
        const placedOrders = []
        for (const item of cart) {
          const orderPayload = {
            userId,
            addressId: selectedAddressId,
            productId: String(item.productId || item.id || "PROD-" + Date.now()),
            productTitle: item.name || "Unknown Product",
            productCategory: item.category || "General",
            productSize: item.size || "N/A",
            unitPrice: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          }
          const placedOrder = await placeOrder(orderPayload)
          placedOrders.push(placedOrder)
        }

        const orderDate = new Date().toISOString().split("T")[0]
        const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

        const newOrder = {
          id: placedOrders.length > 0 ? placedOrders[0].orderId : "ORD-" + Date.now(),
          items: [...cart],
          total,
          subtotal: total,
          tax: 0,
          shipping: 0,
          status: "PENDING",
          paymentMethod: "COD",
          orderDate,
          deliveryDate,
          tracking: "COD-" + Date.now(),
          customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.houseNo}, ${formData.street}, ${
              formData.locality ? formData.locality + ", " : ""
            }${formData.city}, ${formData.state} - ${formData.pincode}`,
          },
          orders: placedOrders,
        }

        const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
        existingOrders.unshift(newOrder)
        localStorage.setItem("userOrders", JSON.stringify(existingOrders))

        onOrderSuccess(newOrder)
      } catch (error) {
        console.error("[v0] COD order error:", error)
        alert("Failed to place COD order. Please try again.")
      } finally {
        setIsPlacingOrder(false)
      }
      return
    }

    alert(`${formData.paymentMethod.toUpperCase()} payment is currently under maintenance. Please use Razorpay.`)
  }

  const inputStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    borderRadius: "6px",
    boxSizing: "border-box",
    marginTop: "8px",
  }

  return (
    <div style={{ flex: "1", minWidth: "300px", background: "#fff", padding: "20px", borderRadius: "8px" }}>
      {/* Delivery Address Section */}
      <div style={{ background: "#f5f5f5", padding: "14px", borderRadius: "8px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h4 style={{ margin: 0, fontSize: "14px" }}>Delivering to:</h4>
          <button
            type="button"
            onClick={onBack}
            style={{ background: "none", border: "none", color: "#1976d2", fontSize: "12px", cursor: "pointer" }}
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

      {paymentError && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          {paymentError}
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handlePaymentSubmit}>
        <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Select Payment Method</h2>

        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {[
            { value: "razorpay", label: "Razorpay (Card, UPI, Net Banking)", icon: "💳" },
             
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
                onChange={(e) => {
                  setFormData({ ...formData, paymentMethod: e.target.value })
                  setPaymentError("")
                }}
                style={{ width: "18px", height: "18px" }}
              />
              <span style={{ fontSize: "14px" }}>{method.icon}</span>
              <span style={{ fontSize: "15px", fontWeight: "500" }}>{method.label}</span>
            </label>
          ))}
        </div>

        {formData.paymentMethod === "razorpay" && (
          <div
            style={{
              background: "#e3f2fd",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "12px",
              color: "#1565c0",
            }}
          >
            <strong>Test Mode:</strong> Use test credentials:
            <br />
            Card: 4111 1111 1111 1111 | Expiry: Any Future Date | CVV: Any 3 digits
            <br />
            Or enter success@razorpay as UPI ID
          </div>
        )}

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
            onClick={onBack}
            disabled={isProcessing}
            style={{
              flex: 1,
              background: isProcessing ? "#e0e0e0" : "#f5f5f5",
              color: "#000",
              padding: "14px",
              border: "none",
              fontSize: "15px",
              cursor: isProcessing ? "not-allowed" : "pointer",
              borderRadius: "4px",
            }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isProcessing || !formData.paymentMethod || !razorpayLoaded}
            style={{
              flex: 2,
              background: isProcessing || !formData.paymentMethod || !razorpayLoaded ? "#ccc" : "#000",
              color: "#fff",
              padding: "14px",
              border: "none",
              fontSize: "16px",
              cursor: isProcessing || !formData.paymentMethod || !razorpayLoaded ? "not-allowed" : "pointer",
              borderRadius: "4px",
            }}
          >
            {isProcessing
              ? "Processing Payment..."
              : formData.paymentMethod === "cod"
                ? "Confirm Order"
                : `Pay Rs.${total.toLocaleString()}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm;
