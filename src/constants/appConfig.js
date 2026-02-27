/**
 * Application Configuration Constants
 * 
 * Central configuration file for application-wide settings.
 * This approach provides:
 * - Easy environment-based configuration
 * - Single source of truth for app settings
 * - Better maintainability
 */

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'petfinder_access_token',
  REFRESH_TOKEN: 'petfinder_refresh_token',
  USER_DATA: 'petfinder_user_data',
  THEME: 'petfinder_theme',
  LANGUAGE: 'petfinder_language',
};

/**
 * Pet types
 */
export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  OTHER: 'other',
};

/**
 * Report status types
 */
export const REPORT_STATUS = {
  LOST: 'lost',
  FOUND: 'found',
  REUNITED: 'reunited',
  CLOSED: 'closed',
};

/**
 * Pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

/**
 * File upload settings
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

/**
 * Validation rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 500,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

/**
 * Map configuration
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: [4.6097, -74.0817], // Bogotá, Colombia
  DEFAULT_ZOOM: 13,
  MAX_ZOOM: 18,
  MIN_ZOOM: 3,
  SEARCH_RADIUS: 10, // kilometers
};

/**
 * Application metadata
 */
export const APP_INFO = {
  NAME: 'PetFinder',
  VERSION: '1.0.0',
  DESCRIPTION: 'Platform for reporting and searching lost pets',
  AUTHOR: 'UPTC Team',
  SUPPORT_EMAIL: 'support@petfinder.com',
};

/**
 * Toast notification duration (milliseconds)
 */
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};
