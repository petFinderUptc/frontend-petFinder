/**
 * useLocalStorage Hook
 * 
 * Custom hook to sync state with localStorage.
 * Provides a React state that persists across page refreshes.
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {Array} [storedValue, setValue] - Similar to useState
 */

import { useState, useEffect } from 'react';
import { getItem, setItem as setStorageItem } from '../utils/storage';

export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    return getItem(key, initialValue);
  });

  // Update localStorage when state changes
  useEffect(() => {
    setStorageItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
