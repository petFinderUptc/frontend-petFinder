/**
 * Profile Service
 * 
 * API calls for user profile management
 * NOTE: Algunas funcionalidades están simuladas temporalmente hasta que se implementen en backend
 */

import apiClient from './api/apiClient';
import { USER_ENDPOINTS } from '../constants/apiEndpoints';
import { toAbsoluteMediaUrl, toBackendProfilePayload } from '../utils/userAdapter';

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.GET_PROFILE);
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
  const payload = toBackendProfilePayload(profileData);
  const response = await apiClient.put(USER_ENDPOINTS.UPDATE_PROFILE, payload);
  return response.data;
};

/**
 * Upload user avatar
 * @param {File} file - Avatar image file
 * @returns {Promise<Object>} Avatar URL
 * 
 * TODO: Endpoint pendiente de implementación en backend
 * Actualmente simula la funcionalidad mediante localStorage
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.post(USER_ENDPOINTS.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    ...response.data,
    avatarUrl: toAbsoluteMediaUrl(response.data?.avatarUrl),
  };
};

/**
 * Delete user avatar
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteAvatar = async () => {
  await apiClient.delete(USER_ENDPOINTS.DELETE_AVATAR);
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 * 
 * TODO: Endpoint pendiente de implementación en backend
 * Actualmente retorna datos simulados
 */
export const getUserStats = async () => {
  const response = await apiClient.get(USER_ENDPOINTS.GET_STATS);
  return response.data;
};

/**
 * Update user password
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const updatePassword = async (passwordData) => {
  const response = await apiClient.put(USER_ENDPOINTS.CHANGE_PASSWORD, passwordData);
  return response.data;
};

/**
 * Delete user account
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteAccount = async (password) => {
  const response = await apiClient.delete(USER_ENDPOINTS.DELETE_ACCOUNT, {
    data: { password },
  });
  return response.data;
};
