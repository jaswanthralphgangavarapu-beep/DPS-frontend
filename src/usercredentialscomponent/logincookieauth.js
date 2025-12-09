// Cookie utility functions for DripCo user authentication
// Cookie valid for 1 hour

const COOKIE_NAME = "dripco_userId"
const COOKIE_EXPIRY_HOURS = 1

// Set user cookie with 1 hour expiry
export const setUserLoggedIn = (userId) => {
  const expiryDate = new Date()
  expiryDate.setTime(expiryDate.getTime() + COOKIE_EXPIRY_HOURS * 60 * 60 * 1000)
  document.cookie = `${COOKIE_NAME}=${userId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
}

// Get userId from cookie
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

// Check if user is logged in (cookie exists and not expired)
export const checkLoginStatus = async () => {
  const userId = getUserIdFromCookie()
  if (userId) {
    return true
  }
  return false
}

// Remove cookie (logout)
export const clearUserCookie = () => {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Get remaining time on cookie in minutes
export const getCookieRemainingTime = () => {
  const userId = getUserIdFromCookie()
  if (!userId) return 0
  return COOKIE_EXPIRY_HOURS * 60
}
