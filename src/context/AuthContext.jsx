/**
 * Authentication Context
 * 
 * Provides global authentication state management using Context API.
 * 
 * Benefits:
 * - Centralized auth state
 * - Accessible from any component
 * - Persistent authentication (localStorage)
 * - Automatic token management
 * 
 * Provides:
 * - user: Current user object
 * - isAuthenticated: Boolean authentication status
 * - isLoading: Loading state during auth checks
 * - login: Login function
 * - register: Register function
 * - logout: Logout function
 * - updateUser: Update user data function
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { STORAGE_KEYS } from '../constants/appConfig';
import { getItem, removeItem } from '../utils/storage';

/**
 * Create Authentication Context
 */
const AuthContext = createContext(undefined);

/**
 * Custom hook to use auth context
 * Throws error if used outside AuthProvider
 * @returns {Object} Auth context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize authentication state
   * Checks for stored tokens and validates them
   */
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check for stored token
      const token = getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const storedUser = getItem(STORAGE_KEYS.USER_DATA);
      
      if (token && storedUser) {
        // Verify token is still valid by fetching current user
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear stored data
          console.error('Token validation failed:', error);
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize authentication state from localStorage
   * Runs once on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login function
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Register function
   * @param {Object} userData - { email, password, username, phone }
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout function
   * Clears auth state and localStorage
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  }, []);

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  /**
   * Clear authentication data
   * Helper function to reset auth state
   */
  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeItem(STORAGE_KEYS.USER_DATA);
  };

  /**
   * Context value object
   */
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
