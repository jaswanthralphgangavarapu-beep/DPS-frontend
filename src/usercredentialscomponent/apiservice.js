// API Service for connecting to Spring Boot backend
const API_BASE = "http://195.35.45.56:4646/api"

// ============ LOCAL STORAGE KEYS ============
const LOCAL_ADDRESSES_KEY = "dripco_saved_addresses"

// ============ LOCAL STORAGE HELPERS ============
export const saveAddressToLocal = (userId, address) => {
  try {
    const allAddresses = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || "{}")
    if (!allAddresses[userId]) {
      allAddresses[userId] = []
    }
    const existingIndex = allAddresses[userId].findIndex((a) => a.addressId === address.addressId)
    if (existingIndex >= 0) {
      allAddresses[userId][existingIndex] = address
    } else {
      allAddresses[userId].push(address)
    }
    localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(allAddresses))
    console.log("[v0] Address saved to localStorage:", address)
  } catch (error) {
    console.log("[v0] Error saving address to localStorage:", error)
  }
}

export const getAddressesFromLocal = (userId) => {
  try {
    const allAddresses = JSON.parse(localStorage.getItem(LOCAL_ADDRESSES_KEY) || "{}")
    return allAddresses[userId] || []
  } catch (error) {
    console.log("[v0] Error reading addresses from localStorage:", error)
    return []
  }
}

// ============ ADDRESS APIs ============
export const createAddress = async (addressData) => {
  console.log("[v0] Creating address with payload:", addressData)
  const response = await fetch(`${API_BASE}/addresses/address`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addressData),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.log("[v0] Create address error:", errorText)
    throw new Error("Failed to create address")
  }
  const result = await response.json()
  console.log("[v0] Address created successfully:", result)
  if (result && result.addressId && addressData.userId) {
    saveAddressToLocal(addressData.userId, result)
  }
  return result
}

export const getAddressesByUserId = async (userId) => {
  try {
    console.log("[v0] Fetching addresses for userId:", userId)
    const response = await fetch(`${API_BASE}/addresses/getAddressByUserId/${userId}`)
    if (!response.ok) {
      console.log("[v0] Fetch addresses failed with status:", response.status)
      console.log("[v0] Falling back to localStorage for addresses")
      return getAddressesFromLocal(userId)
    }
    const result = await response.json()
    console.log("[v0] Fetched addresses from API:", result)
    if (result && result.length > 0) {
      result.forEach((addr) => saveAddressToLocal(userId, addr))
    }
    return result
  } catch (error) {
    console.log("[v0] Error fetching addresses:", error)
    console.log("[v0] Falling back to localStorage for addresses")
    return getAddressesFromLocal(userId)
  }
}

export const updateAddress = async (id, addressData) => {
  console.log("[v0] Updating address id:", id, "with payload:", addressData)
  try {
    const response = await fetch(`${API_BASE}/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Update address error:", errorText)
      console.log("[v0] Update failed, creating new address instead")
      return await createAddress(addressData)
    }
    const result = await response.json()
    console.log("[v0] Address updated successfully:", result)
    return result
  } catch (error) {
    console.log("[v0] Exception in updateAddress:", error)
    return await createAddress(addressData)
  }
}

export const getAddressById = async (addressId) => {
  const response = await fetch(`${API_BASE}/addresses/${addressId}/details`)
  if (!response.ok) throw new Error("Failed to fetch address")
  return response.json()
}

// ============ ORDER APIs ============
export const placeOrder = async (orderData) => {
  console.log("[v0] Placing order with payload:", JSON.stringify(orderData, null, 2))
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.log("[v0] Place order error:", response.status, errorText)
    throw new Error("Failed to place order: " + errorText)
  }
  const result = await response.json()
  console.log("[v0] Order placed successfully:", result)
  return result
}

export const getOrdersByUserId = async (userId) => {
  try {
    console.log("[v0] Fetching orders for userId:", userId)
    const response = await fetch(`${API_BASE}/orders/getOrdersByUserId/${userId}`)
    if (!response.ok) {
      console.log("[v0] Fetch orders failed with status:", response.status)
      return []
    }
    const result = await response.json()
    console.log("[v0] Fetched orders:", result)
    return result
  } catch (error) {
    console.log("[v0] Error fetching orders:", error)
    return []
  }
}

export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_BASE}/orders/${orderId}`)
  if (!response.ok) throw new Error("Failed to fetch order")
  return response.json()
}

export const updateOrderStatus = async (userId, status) => {
  const response = await fetch(`${API_BASE}/orders/user/${userId}/status?status=${status}`, {
    method: "PUT",
  })
  if (!response.ok) throw new Error("Failed to update order status")
  return response.json()
}

// ============ USER APIs ============
export const getUserByUserId = async (userId) => {
  const response = await fetch(`${API_BASE}/v2/users/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

// ============ HELPER: Cookie Functions ============
const COOKIE_NAME = "dripco_userId"
const COOKIE_EXPIRY_HOURS = 1

export const getUserIdFromCookie = () => {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === COOKIE_NAME) {
      return value
    }
  }
  return null
}

export const setUserIdCookie = (userId) => {
  const expiryDate = new Date()
  expiryDate.setTime(expiryDate.getTime() + COOKIE_EXPIRY_HOURS * 60 * 60 * 1000)
  document.cookie = `${COOKIE_NAME}=${userId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
}

export const clearUserIdCookie = () => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
