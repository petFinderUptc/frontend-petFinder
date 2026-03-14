/**
 * Servicio de Autenticación
 * 
 * Maneja todas las llamadas API relacionadas con autenticación.
 * Siguiendo el Principio de Responsabilidad Única - este servicio solo maneja operaciones de autenticación.
 * 
 * Funciones incluidas:
 * - Login
 * - Registro
 * - Logout
 * - Restablecimiento de contraseña
 * - Verificación de email
 * - Obtener usuario actual
 */

import apiClient from './api/apiClient';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import { STORAGE_KEYS } from '../constants/appConfig';
import { setItem, removeItem } from '../utils/storage';
import { normalizeUserFromBackend } from '../utils/userAdapter';

/**
 * Iniciar sesión
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Datos de usuario y token
 */
export const login = async (credentials) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
  
  const { accessToken, user } = response.data;
  const normalizedUser = normalizeUserFromBackend(user);
  
  // Guardar token y datos de usuario
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.USER_DATA, normalizedUser);
  
  return {
    ...response.data,
    user: normalizedUser,
  };
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - { email, password, firstName, lastName, phoneNumber (opcional) }
 * @returns {Promise<Object>} Datos de usuario y token
 */
export const register = async (userData) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
  
  const { accessToken, user } = response.data;
  const normalizedUser = normalizeUserFromBackend(user);
  
  // Guardar token y datos de usuario
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.USER_DATA, normalizedUser);
  
  return {
    ...response.data,
    user: normalizedUser,
  };
};

/**
 * Cerrar sesión
 * Limpia el almacenamiento local y hace la petición de logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Siempre limpiar datos locales, incluso si la llamada API falla
    removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    removeItem(STORAGE_KEYS.USER_DATA);
  }
};

/**
 * Obtener usuario autenticado actual
 * @returns {Promise<Object>} Datos del usuario
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(AUTH_ENDPOINTS.ME);
  const normalizedUser = normalizeUserFromBackend(response.data?.user || response.data);
  
  // Actualizar datos de usuario almacenados
  setItem(STORAGE_KEYS.USER_DATA, normalizedUser);
  
  return normalizedUser;
};

/**
 * Verificar dirección de email
 * @param {string} token - Token de verificación del email
 * @returns {Promise<Object>} Resultado de verificación
 */
export const verifyEmail = async (token) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  return response.data;
};

/**
 * Solicitar restablecimiento de contraseña
 * @param {string} email - Email del usuario
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
