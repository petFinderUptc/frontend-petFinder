/**
 * API Endpoints Constants
 * 
 * Centralized location for all API endpoint definitions.
 * This improves maintainability and makes it easy to update endpoints.
 * 
 * Following best practices:
 * - Single source of truth for endpoints
 * - Easy to maintain and update
 * - Type-safe with JSDoc annotations
 */

// Base URL from environment variables with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Authentication related endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
};

/**
 * Pet/Report related endpoints
 */
export const PET_ENDPOINTS = {
  GET_ALL: '/posts',
  GET_BY_ID: (id) => `/posts/${id}`,
  CREATE: '/posts',
  UPDATE: (id) => `/posts/${id}`,
  DELETE: (id) => `/posts/${id}`,
  SEARCH: '/posts',
  MY_REPORTS: '/posts/my-posts',
  UPLOAD_IMAGE: '/posts/upload-image',
};

/**
 * User related endpoints
 */
export const USER_ENDPOINTS = {
  // Endpoints disponibles en backend actual
  GET_PROFILE: '/users/profile/me',
  UPDATE_PROFILE: '/users/profile/me',
  
  // Endpoints pendientes de implementación en backend (temporalmente manejados con mock/fallback)
  DELETE_ACCOUNT: '/users/account', // TODO: Implementar en backend
  CHANGE_PASSWORD: '/users/change-password', // TODO: Implementar en backend
  GET_MY_PETS: '/posts/my-posts', // Usando endpoint de posts existente
  UPLOAD_AVATAR: '/users/avatar', // TODO: Implementar en backend
  DELETE_AVATAR: '/users/avatar', // TODO: Implementar en backend
  GET_STATS: '/users/stats', // TODO: Implementar en backend
};

/**
 * Location/Geolocation related endpoints
 */
export const LOCATION_ENDPOINTS = {
  NEARBY_PETS: '/location/nearby',
  GEOCODE: '/location/geocode',
  REVERSE_GEOCODE: '/location/reverse-geocode',
};

/**
 * Notification related endpoints
 * NOTE: Sistema de notificaciones pendiente de implementación completa en backend
 */
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications', // TODO: Implementar en backend
  GET_UNREAD: '/notifications/unread', // TODO: Implementar en backend
  MARK_AS_READ: (id) => `/notifications/${id}/read`, // TODO: Implementar en backend
  MARK_ALL_AS_READ: '/notifications/read-all', // TODO: Implementar en backend
  DELETE: (id) => `/notifications/${id}`, // TODO: Implementar en backend
};
