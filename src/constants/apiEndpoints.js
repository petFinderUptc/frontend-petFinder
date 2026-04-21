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
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
  ME: '/users/profile/me',
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
 * Reports related endpoints (paginated CRUD)
 */
export const REPORT_ENDPOINTS = {
  GET_ALL: '/reports',
  SEARCH: '/reports/search',
  GET_BY_ID: (id) => `/reports/${id}`,
  CREATE: '/reports',
  UPDATE: (id) => `/reports/${id}`,
  DELETE: (id) => `/reports/${id}`,
  MY_REPORTS: '/reports/my-reports',
  UPLOAD_IMAGE: '/reports/upload-image',
  EXPORT: '/reports/export',
  EXPORT_CSV: '/reports/export/csv',
  BACKFILL_EMBEDDINGS: '/reports/backfill-embeddings',
  ANALYZE_IMAGE: '/reports/analyze-image',
  AI_STATUS: '/reports/ai-status',
};

/**
 * User related endpoints
 */
export const ADMIN_ENDPOINTS = {
  GET_ALL_USERS: '/users',
  DELETE_USER: (id) => `/users/${id}`,
};

export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/profile/me',
  UPDATE_PROFILE: '/users/profile/me',

  DELETE_ACCOUNT: '/users/account',
  CHANGE_PASSWORD: '/users/change-password',
  GET_MY_PETS: '/posts/my-posts',
  UPLOAD_AVATAR: '/users/avatar',
  DELETE_AVATAR: '/users/avatar',
  GET_STATS: '/users/stats',
};

/**
 * Location/Geolocation related endpoints
 */
export const LOCATION_ENDPOINTS = {
  NEARBY_PETS: '/location/nearby',
  GEOCODE: '/location/geocode',
  SEARCH_ADDRESS: '/location/search-address',
  REVERSE_GEOCODE: '/location/reverse-geocode',
};

/**
 * Admin related endpoints
 */
export const ADMIN_ENDPOINTS = {
  GET_ALL_USERS: '/users',
  DELETE_USER: (id) => `/users/${id}`,
  ADMIN_DELETE_REPORT: (id) => `/reports/admin/${id}`,
};

/**
 * Notification related endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/notifications',
  GET_UNREAD: '/notifications/unread',
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_AS_READ: '/notifications/read-all',
  DELETE: (id) => `/notifications/${id}`,
};
