import apiClient from './api/apiClient';
import { PET_ENDPOINTS, REPORT_ENDPOINTS } from '../constants/apiEndpoints';

export const getReports = async (params = {}) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.GET_ALL, { params });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

export const createReport = async (payload) => {
  const response = await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
  return response.data;
};

export const uploadReportImage = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post(PET_ENDPOINTS.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data;
};
