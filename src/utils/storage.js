/**
 * Local Storage Utility Functions
 * 
 * Provides a safe and consistent interface for localStorage operations.
 * Includes error handling and JSON serialization/deserialization.
 * 
 * Following best practices:
 * - Error handling for storage quota exceeded
 * - JSON serialization for complex objects
 * - Safe parsing with fallback values
 */

/**
 * Set an item in storage.
 * If the key already exists only in sessionStorage (rememberMe=false session),
 * it is updated there. Otherwise localStorage is used.
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    // Keep tokens in sessionStorage when that is where the active session lives
    if (sessionStorage.getItem(key) !== null && localStorage.getItem(key) === null) {
      sessionStorage.setItem(key, serializedValue);
    } else {
      localStorage.setItem(key, serializedValue);
    }
    return true;
  } catch (error) {
    console.error(`Error saving to storage: ${error.message}`);
    return false;
  }
};

/**
 * Get an item from storage.
 * Checks localStorage first (rememberMe sessions), then sessionStorage (temporary sessions).
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed value or default value
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal !== null) return JSON.parse(fromLocal);
    const fromSession = sessionStorage.getItem(key);
    if (fromSession !== null) return JSON.parse(fromSession);
    return defaultValue;
  } catch (error) {
    console.error(`Error reading from storage: ${error.message}`);
    return defaultValue;
  }
};

/**
 * Remove an item from both localStorage and sessionStorage.
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    try { sessionStorage.removeItem(key); } catch { /* sessionStorage unavailable */ }
    return true;
  } catch (error) {
    console.error(`Error removing from storage: ${error.message}`);
    return false;
  }
};

/**
 * Clear all items from localStorage and sessionStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    localStorage.clear();
    try { sessionStorage.clear(); } catch { /* sessionStorage unavailable */ }
    return true;
  } catch (error) {
    console.error(`Error clearing storage: ${error.message}`);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isAvailable = () => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
