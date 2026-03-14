/**
 * User Service
 * 
 * Handles user-related API calls.
 * Manages user profile operations:
 * - Get user profile
 * - Update profile
 * - Change password
 * - Delete account
 * 
 * NOTE: Algunas funcionalidades están pendientes de implementación en backend
 */

import apiClient from './api/apiClient';
import { USER_ENDPOINTS } from '../constants/apiEndpoints';
import { setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/appConfig';
import { normalizeUserFromBackend, toBackendProfilePayload } from '../utils/userAdapter';

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.GET_PROFILE);
  return normalizeUserFromBackend(response.data);
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  const payload = toBackendProfilePayload(profileData);
  const response = await apiClient.put(USER_ENDPOINTS.UPDATE_PROFILE, payload);
  const normalizedUser = normalizeUserFromBackend(response.data);
  
  // Update stored user data
  setItem(STORAGE_KEYS.USER_DATA, normalizedUser);
  
  return normalizedUser;
};

/**
 * Change user password
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise<Object>} Password change confirmation
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const changePassword = async (passwordData) => {
  const response = await apiClient.put(USER_ENDPOINTS.CHANGE_PASSWORD, passwordData);
  return response.data;
};

/**
 * Delete user account
 * @param {string} password - User password for confirmation
 * @returns {Promise<Object>} Deletion confirmation
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteAccount = async (password) => {
  const response = await apiClient.delete(USER_ENDPOINTS.DELETE_ACCOUNT, {
    data: { password },
  });
  return response.data;
};

/**
 * Get user's pet reports
 * @returns {Promise<Array>} User's pet reports
 */
export const getMyPets = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.GET_MY_PETS);
  return response.data;
};
