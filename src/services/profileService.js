/**
 * Profile Service
 * 
 * API calls for user profile management
 * NOTE: Algunas funcionalidades están simuladas temporalmente hasta que se implementen en backend
 */

import apiClient from './api/apiClient';
import { USER_ENDPOINTS } from '../constants/apiEndpoints';

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
  const response = await apiClient.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);
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
  // Simulación temporal hasta que se implemente en backend
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Almacenar temporalmente en localStorage
      localStorage.setItem('user_avatar_temp', reader.result);
      
      resolve({
        data: {
          avatarUrl: reader.result,
          message: 'Avatar cargado temporalmente (localStorage). Pendiente implementación en backend.',
        },
      });
    };
    reader.readAsDataURL(file);
  });
  
  // Implementación real cuando el backend esté listo:
  /*
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.post(USER_ENDPOINTS.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
  */
};

/**
 * Delete user avatar
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteAvatar = async () => {
  // Simulación temporal
  localStorage.removeItem('user_avatar_temp');
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.delete(USER_ENDPOINTS.DELETE_AVATAR);
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 * 
 * TODO: Endpoint pendiente de implementación en backend
 * Actualmente retorna datos simulados
 */
export const getUserStats = async () => {
  // Simulación temporal con datos de ejemplo
  return Promise.resolve({
    data: {
      reportsPublished: 0,
      successfulReunions: 0,
      helpedPets: 0,
      memberSince: new Date().toISOString(),
    },
  });
  
  // Implementación real cuando el backend esté listo:
  // const response = await apiClient.get(USER_ENDPOINTS.GET_STATS);
  // return response.data;
};

/**
 * Update user password
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const updatePassword = async (passwordData) => {
  // Simulación temporal - en producción esto NO debería pasar
  console.warn('⚠️ Cambio de contraseña simulado. Implementar endpoint en backend.');
  return Promise.resolve({
    data: {
      message: 'Cambio de contraseña simulado. Pendiente implementación en backend.',
    },
  });
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.put(USER_ENDPOINTS.CHANGE_PASSWORD, passwordData);
};

/**
 * Delete user account
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteAccount = async () => {
  // Simulación temporal
  console.warn('⚠️ Eliminación de cuenta simulada. Implementar endpoint en backend.');
  return Promise.resolve({
    data: {
      message: 'Eliminación de cuenta simulada. Pendiente implementación en backend.',
    },
  });
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.delete(USER_ENDPOINTS.DELETE_ACCOUNT);
};
