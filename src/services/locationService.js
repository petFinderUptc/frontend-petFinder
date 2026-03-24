import apiClient from './api/apiClient';
import { LOCATION_ENDPOINTS } from '../constants/apiEndpoints';

export const searchAddress = async (query, limit = 6) => {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return [];
  }

  const response = await apiClient.get(LOCATION_ENDPOINTS.SEARCH_ADDRESS, {
    params: {
      q: trimmed,
      limit,
    },
  });

  return Array.isArray(response.data) ? response.data : [];
};

export const reverseGeocode = async (lat, lon) => {
  const response = await apiClient.get(LOCATION_ENDPOINTS.REVERSE_GEOCODE, {
    params: {
      lat,
      lon,
    },
  });

  return response.data || null;
};

export const getNearbyReports = async (params) => {
  const response = await apiClient.get(LOCATION_ENDPOINTS.NEARBY_PETS, { params });
  return response.data;
};
