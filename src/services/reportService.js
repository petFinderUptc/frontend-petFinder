import apiClient from './api/apiClient';
import { REPORT_ENDPOINTS, ADMIN_ENDPOINTS } from '../constants/apiEndpoints';

export const getReportStats = async () => {
  const response = await apiClient.get(REPORT_ENDPOINTS.STATS);
  return response.data;
};

export const getReports = async (params = {}) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.GET_ALL, { params });
  return response.data;
};

/**
 * Búsqueda semántica con IA.
 * @param {string} query - Descripción libre de la mascota
 * @param {Object} params - Filtros y paginación
 * @param {number} [params.lat] - Latitud del usuario (para filtro geográfico)
 * @param {number} [params.lon] - Longitud del usuario (para filtro geográfico)
 * @param {number} [params.radiusKm] - Radio de búsqueda en km (default 15)
 */
export const searchReports = async (query, params = {}) => {
  const response = await apiClient.get(REPORT_ENDPOINTS.SEARCH, {
    params: { query, ...params },
  });
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
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  return response.data;
};

export const exportReportsJson = async () => {
  const response = await apiClient.get(REPORT_ENDPOINTS.EXPORT);
  return response.data;
};

export const exportReportsCsv = async () => {
  const response = await apiClient.get(REPORT_ENDPOINTS.EXPORT_CSV, {
    responseType: 'text',
  });
  return response.data;
};

/**
 * Dispara el backfill de embeddings para reportes sin vector.
 * Requiere autenticación.
 */
export const backfillEmbeddings = async () => {
  const response = await apiClient.post(REPORT_ENDPOINTS.BACKFILL_EMBEDDINGS);
  return response.data;
};

export const adminDeleteReport = async (id) => {
  const response = await apiClient.delete(ADMIN_ENDPOINTS.ADMIN_DELETE_REPORT(id));
  return response.data;
};

export const analyzeReportImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post(REPORT_ENDPOINTS.ANALYZE_IMAGE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAiStatus = async () => {
  const response = await apiClient.get(REPORT_ENDPOINTS.AI_STATUS);
  return response.data;
};
