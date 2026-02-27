/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 * Following Single Responsibility Principle - this service only handles auth operations.
 * 
 * Functions include:
 * - Login
 * - Register
 * - Logout
 * - Password reset
 * - Email verification
 * - Get current user
 */

import apiClient from './api/apiClient';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import { STORAGE_KEYS } from '../constants/appConfig';
import { setItem, removeItem } from '../utils/storage';

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User data and tokens
 */
export const login = async (credentials) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  const { accessToken, refreshToken, user } = response.data;
  
  // Store tokens and user data
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  setItem(STORAGE_KEYS.USER_DATA, user);
  
  return response.data;
};

/**
 * Register new user
 * @param {Object} userData - { email, password, username, phone }
 * @returns {Promise<Object>} User data and tokens
 */
export const register = async (userData) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
  
  const { accessToken, refreshToken, user } = response.data;
  
  // Store tokens and user data
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  setItem(STORAGE_KEYS.USER_DATA, user);
  
  return response.data;
};

/**
 * Logout user
 * Clears local storage and makes logout request
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local data, even if API call fails
    removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(AUTH_ENDPOINTS.ME);
  
  // Update stored user data
  setItem(STORAGE_KEYS.USER_DATA, response.data.user);
  
  return response.data.user;
};

/**
 * Verify email address
 * @param {string} token - Verification token from email
 * @returns {Promise<Object>} Verification result
 */
export const verifyEmail = async (token) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset request result
 */
export const forgotPassword = async (email) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {Object} data - { token, newPassword }
 * @returns {Promise<Object>} Reset result
 */
export const resetPassword = async (data) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  return response.data;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  
  // Update stored tokens
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (newRefreshToken) {
    setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
  }
  
  return response.data;
};
