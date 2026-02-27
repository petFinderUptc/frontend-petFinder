/**
 * Form Validation Utility Functions
 * 
 * Provides reusable validation functions for forms.
 * Follows Single Responsibility Principle - each function validates one thing.
 * 
 * Benefits:
 * - Reusable across components
 * - Easy to test
 * - Consistent validation logic
 * - Helpful error messages
 */

import { VALIDATION } from '../constants/appConfig';

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters` 
    };
  }
  
  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Username must not exceed ${VALIDATION.USERNAME_MAX_LENGTH} characters` 
    };
  }
  
  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { 
      isValid: false, 
      error: 'Username can only contain letters, numbers, and underscores' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: '' };
};
