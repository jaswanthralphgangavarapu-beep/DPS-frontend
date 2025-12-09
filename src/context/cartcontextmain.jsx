"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getUserIdFromCookie } from "../api/apiService"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [userId, setUserId] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const currentUserId = getUserIdFromCookie()
    setUserId(currentUserId)

    if (currentUserId) {
      // Load user-specific cart
      const savedCart = localStorage.getItem(`dripco_cart_${currentUserId}`)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } else {
      // Load guest cart
      const guestCart = localStorage.getItem("dripco_cart_guest")
      if (guestCart) {
        setCartItems(JSON.parse(guestCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const currentUserId = getUserIdFromCookie()
    if (currentUserId) {
      localStorage.setItem(`dripco_cart_${currentUserId}`, JSON.stringify(cartItems))
    } else {
      localStorage.setItem("dripco_cart_guest", JSON.stringify(cartItems))
    }
  }, [cartItems])

  // Sync cart when user logs in
  const syncCartOnLogin = useCallback((newUserId) => {
    setUserId(newUserId)

    // Get guest cart
    const guestCart = localStorage.getItem("dripco_cart_guest")
    const guestItems = guestCart ? JSON.parse(guestCart) : []

    // Get existing user cart
    const userCart = localStorage.getItem(`dripco_cart_${newUserId}`)
    const userItems = userCart ? JSON.parse(userCart) : []

    // Merge carts (guest items take priority for duplicates)
    const mergedCart = [...userItems]
    guestItems.forEach((guestItem) => {
      const existingIndex = mergedCart.findIndex(
        (item) => item.productId === guestItem.productId && item.size === guestItem.size,
      )
      if (existingIndex === -1) {
        mergedCart.push(guestItem)
      } else {
        mergedCart[existingIndex].quantity += guestItem.quantity
      }
    })

    setCartItems(mergedCart)
    localStorage.setItem(`dripco_cart_${newUserId}`, JSON.stringify(mergedCart))
    localStorage.removeItem("dripco_cart_guest")
  }, [])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.productId && item.size === product.size)

      if (existingIndex !== -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += product.quantity || 1
        return updated
      }

      return [
        ...prev,
        {
          ...product,
          cartId: `${product.productId}-${product.size}-${Date.now()}`,
          quantity: product.quantity || 1,
        },
      ]
    })
  }

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity: newQuantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    const currentUserId = getUserIdFromCookie()
    if (currentUserId) {
      localStorage.removeItem(`dripco_cart_${currentUserId}`)
    } else {
      localStorage.removeItem("dripco_cart_guest")
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        userId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        syncCartOnLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
