/**
 * useToggle Hook
 * 
 * Custom hook for boolean state toggling.
 * Simplifies modal, drawer, and menu state management.
 * 
 * @param {boolean} initialValue - Initial state value
 * @returns {Array} [value, toggle, setTrue, setFalse] 
 */

import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};
