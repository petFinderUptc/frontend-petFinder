/**
 * useApi Hook
 * 
 * Custom hook for API calls with loading and error states.
 * Simplifies async operations and state management.
 * 
 * Features:
 * - Automatic loading state
 * - Error handling
 * - Data caching
 * - Manual execution control
 * 
 * @param {Function} apiFunction - API function to call
 * @param {boolean} immediate - Execute immediately on mount (default: false)
 * @returns {Object} API state and execute function
 */

import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API call
   */
  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...params);
      setData(result);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Execute immediately if specified
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};
