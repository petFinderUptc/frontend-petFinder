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
  // Lee un token tanto de localStorage como de sessionStorage
  const getStoredToken = () => {
    try {
      const fromLocal = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const fromSession = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const raw = fromLocal || fromSession;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getStoredUser = () => {
    try {
      const fromLocal = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const fromSession = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
      const raw = fromLocal || fromSession;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const login = useCallback(async (credentials, rememberMe = false) => {
    try {
      const data = await authService.login(credentials, rememberMe);
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
    // Limpiar tanto localStorage como sessionStorage
    removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeItem(STORAGE_KEYS.USER_DATA);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch {
      // sessionStorage no disponible
    }
  };

  /**
   * Context value object
   */
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
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
