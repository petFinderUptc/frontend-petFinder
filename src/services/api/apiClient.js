/**
 * Axios Instance Configuration
 * 
 * Centralized Axios configuration with interceptors for:
 * - Automatic JWT token injection
 * - Request/response logging
 * - Error handling
 * - Token refresh logic
 * 
 * Following best practices:
 * - Single Axios instance for consistency
 * - Automatic authentication header injection
 * - Centralized error handling
 * - Request/response transformation
 */

import axios from 'axios';
import { API_BASE_URL } from '../../constants/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/appConfig';
import { getItem, setItem, removeItem } from '../../utils/storage';

/**
 * Create Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * Automatically adds JWT token to requests if available.
 * Useful for authenticated endpoints.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get access token from storage
    const token = getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development mode
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    // Handle request error
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles responses and errors globally:
 * - Successful responses pass through
 * - 401 errors trigger token refresh or logout
 * - Other errors are formatted consistently
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    // Return the response data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development mode
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data and redirect to login
      // TODO: FASE 2 - Implementar refresh token logic
      removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      removeItem(STORAGE_KEYS.USER_DATA);
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'network_error',
      });
    }
    
    // Format error response consistently
    const formattedError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
      type: 'api_error',
    };
    
    return Promise.reject(formattedError);
  }
);

/**
 * Helper function to handle file uploads
 * @param {string} url - Upload endpoint
 * @param {FormData} formData - Form data with files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Axios response promise
 */
export const uploadFile = (url, formData, onUploadProgress) => {
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

/**
 * Helper function to download files
 * @param {string} url - Download endpoint
 * @param {string} filename - Desired filename
 * @returns {Promise} Axios response promise
 */
export const downloadFile = async (url, filename) => {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });
  
  // Create blob link to download
  const urlObject = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = urlObject;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return response;
};

export default apiClient;
