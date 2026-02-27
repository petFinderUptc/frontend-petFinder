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

export const API_BASE_URL = 'http://localhost:3000/api';

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
  GET_ALL: '/pets',
  GET_BY_ID: (id) => `/pets/${id}`,
  CREATE: '/pets',
  UPDATE: (id) => `/pets/${id}`,
  DELETE: (id) => `/pets/${id}`,
  SEARCH: '/pets/search',
  MY_REPORTS: '/pets/my-reports',
  UPLOAD_IMAGE: '/pets/upload-image',
};

/**
 * User related endpoints
 */
export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  DELETE_ACCOUNT: '/users/account',
  CHANGE_PASSWORD: '/users/change-password',
  GET_MY_PETS: '/users/my-pets',
};

/**
 * Location/Geolocation related endpoints
 */
export const LOCATION_ENDPOINTS = {
  NEARBY_PETS: '/location/nearby',
  GEOCODE: '/location/geocode',
  REVERSE_GEOCODE: '/location/reverse-geocode',
};
