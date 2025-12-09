const API_BASE = "http://localhost:4646/api"

export const createRazorpayOrder = async (orderDetails) => {
  try {
    console.log("[v0] Creating Razorpay order with details:", orderDetails)
    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Create order error:", errorText)
      throw new Error("Failed to create Razorpay order")
    }

    const result = await response.json()
    console.log("[v0] Razorpay order created successfully:", result)
    return result
  } catch (error) {
    console.log("[v0] Error creating Razorpay order:", error)
    throw error
  }
}

export const verifyRazorpayPayment = async (paymentData) => {
  try {
    console.log("[v0] Verifying Razorpay payment:", paymentData)
    const response = await fetch(`${API_BASE}/payments/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Verify payment error:", errorText)
      throw new Error("Payment verification failed")
    }

    const result = await response.json()
    console.log("[v0] Payment verified successfully:", result)
    return result
  } catch (error) {
    console.log("[v0] Error verifying payment:", error)
    throw error
  }
}

export const getPaymentByPaymentId = async (paymentId) => {
  try {
    console.log("[v0] Fetching payment details for paymentId:", paymentId)
    const response = await fetch(`${API_BASE}/payments/payment/${paymentId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch payment details")
    }

    const result = await response.json()
    console.log("[v0] Payment details fetched:", result)
    return result
  } catch (error) {
    console.log("[v0] Error fetching payment details:", error)
    throw error
  }
}

export const getPaymentsByUserId = async (userId) => {
  try {
    console.log("[v0] Fetching all payments for userId:", userId)
    const response = await fetch(`${API_BASE}/payments/user/${userId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch payments")
    }

    const result = await response.json()
    console.log("[v0] Payments fetched:", result)
    return result
  } catch (error) {
    console.log("[v0] Error fetching payments:", error)
    return []
  }
}
