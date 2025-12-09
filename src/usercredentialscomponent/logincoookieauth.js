// src/usercredentialscomponent/logincookieauth.js
// Global cookie-based auth helpers (JS)

let isUserLoggedIn = false;
let loginChecked = false;

/**
 * Get cookie value by name
 * @param {string} name
 * @returns {string|null}
 */
export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Set a persistent cookie for userId (10 years).
 * Also updates local in-memory flags.
 * @param {string} userId
 */
export const setUserIdCookie = (userId) => {
  if (typeof document === "undefined") return;
  // 10 years in seconds
  const maxAge = 10 * 365 * 24 * 60 * 60; // 315360000
  // Include SameSite=Lax and path=/; don't set Secure here because local dev may not be https
  document.cookie = `userId=${encodeURIComponent(userId)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  isUserLoggedIn = true;
  loginChecked = true;
};

/**
 * Remove cookie (if needed).
 */
export const removeUserIdCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = "userId=; Max-Age=0; Path=/; SameSite=Lax";
  isUserLoggedIn = false;
  loginChecked = true;
};

/**
 * Check login status:
 * - If a userId cookie exists, validate with backend.
 * - If no cookie, return false.
 * - This caches the check per page load (loginChecked).
 *
 * @param {string} validateUrlPrefix - e.g. "http://195.35.45.56:4646/api/v2"
 * @returns {Promise<boolean>}
 */
export const checkLoginStatus = async (validateUrlPrefix = "http://195.35.45.56:4646/api/v2") => {
  // If we've checked this session already, return cached result
  if (loginChecked) return isUserLoggedIn;

  const userId = getCookie("userId");
  if (!userId) {
    isUserLoggedIn = false;
    loginChecked = true;
    return false;
  }

  // Validate userId with backend
  try {
    const res = await fetch(`${validateUrlPrefix}/users/${encodeURIComponent(userId)}`, {
      method: "GET",
      credentials: "include", // include cookies if server sets them
      headers: {
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      isUserLoggedIn = true;
    } else {
      // invalid userId: remove cookie
      removeUserIdCookie();
      isUserLoggedIn = false;
    }
  } catch (err) {
    // On network error, be conservative: remove cookie (optional).
    // If you prefer to assume logged out only on 4xx/5xx, change behavior.
    removeUserIdCookie();
    isUserLoggedIn = false;
  }

  loginChecked = true;
  return isUserLoggedIn;
};

/**
 * Mark user as logged in (in-memory + optionally set cookie).
 * Prefer calling setUserIdCookie(userId) when you have the returned userId from backend.
 */
export const setUserLoggedIn = () => {
  isUserLoggedIn = true;
  loginChecked = true;
};
