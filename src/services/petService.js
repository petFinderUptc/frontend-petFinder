/**
 * Pet Service
 * 
 * Handles all pet/report-related API calls.
 * This service manages:
 * - Fetching pet reports (all, by ID, user's reports)
 * - Creating new reports
 * - Updating existing reports
 * - Deleting reports
 * - Searching and filtering
 * - Image uploads
 */

import apiClient, { uploadFile } from './api/apiClient';
import { PET_ENDPOINTS } from '../constants/apiEndpoints';
import { buildQueryString } from '../utils/helpers';

/**
 * Get all pet reports with optional filters
 * @param {Object} filters - { page, limit, status, type, search }
 * @returns {Promise<Object>} List of pets and pagination info
 */
export const getAllPets = async (filters = {}) => {
  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`${PET_ENDPOINTS.GET_ALL}${queryString}`);
  return response.data;
};

/**
 * Get pet report by ID
 * @param {string} id - Pet report ID
 * @returns {Promise<Object>} Pet report details
 */
export const getPetById = async (id) => {
  const response = await apiClient.get(PET_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

/**
 * Create new pet report
 * @param {Object} petData - Pet report data
 * @returns {Promise<Object>} Created pet report
 */
export const createPet = async (petData) => {
  const response = await apiClient.post(PET_ENDPOINTS.CREATE, petData);
  return response.data;
};

/**
 * Update existing pet report
 * @param {string} id - Pet report ID
 * @param {Object} petData - Updated pet data
 * @returns {Promise<Object>} Updated pet report
 */
export const updatePet = async (id, petData) => {
  const response = await apiClient.put(PET_ENDPOINTS.UPDATE(id), petData);
  return response.data;
};

/**
 * Delete pet report
 * @param {string} id - Pet report ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deletePet = async (id) => {
  const response = await apiClient.delete(PET_ENDPOINTS.DELETE(id));
  return response.data;
};

/**
 * Search pets with advanced filters
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} Search results
 */
export const searchPets = async (searchParams) => {
  const queryString = buildQueryString(searchParams);
  const response = await apiClient.get(`${PET_ENDPOINTS.SEARCH}${queryString}`);
  return response.data;
};

/**
 * Get user's pet reports
 * @returns {Promise<Array>} User's pet reports
 */
export const getMyReports = async () => {
  const response = await apiClient.get(PET_ENDPOINTS.MY_REPORTS);
  return response.data;
};

/**
 * Upload pet image
 * @param {File} file - Image file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result with image URL
 */
export const uploadPetImage = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await uploadFile(
    PET_ENDPOINTS.UPLOAD_IMAGE,
    formData,
    (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    }
  );
  
  return response.data;
};

/**
 * Upload multiple pet images
 * @param {Array<File>} files - Array of image files
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultiplePetImages = async (files, onProgress) => {
  const uploadPromises = files.map((file, index) => 
    uploadPetImage(file, (percent) => {
      if (onProgress) {
        // Calculate overall progress
        const fileProgress = percent / files.length;
        const overallProgress = Math.round(
          ((index / files.length) * 100) + fileProgress
        );
        onProgress(overallProgress);
      }
    })
  );
  
  const results = await Promise.all(uploadPromises);
  return results;
};
