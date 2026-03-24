import apiClient from './api/apiClient';
import { REPORT_ENDPOINTS } from '../constants/apiEndpoints';

export const getReports = async (params = {}) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.GET_ALL, { params });
  return response.data;
};

export const getReportById = async (id) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

export const getMyReports = async () => {
  const response = await apiClient.get(REPORT_ENDPOINTS.MY_REPORTS);
  return Array.isArray(response.data) ? response.data : [];
};

export const createReport = async (payload) => {
  const response = await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
  return response.data;
};

export const updateReport = async (id, payload) => {
  const response = await apiClient.put(REPORT_ENDPOINTS.UPDATE(id), payload);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await apiClient.delete(REPORT_ENDPOINTS.DELETE(id));
  return response.data;
};

export const uploadReportImage = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post(REPORT_ENDPOINTS.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data;
};
