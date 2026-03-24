import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../constants/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/appConfig';
import { pushAppAlert } from '../../utils/alerts';
import { getItem, setItem, removeItem } from '../../utils/storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let waitingQueue = [];

const processWaitingQueue = (error, nextAccessToken) => {
  waitingQueue.forEach((promiseHandlers) => {
    if (error) {
      promiseHandlers.reject(error);
      return;
    }

    promiseHandlers.resolve(nextAccessToken);
  });

  waitingQueue = [];
};

const clearAuthAndRedirect = () => {
  removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeItem(STORAGE_KEYS.USER_DATA);

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const shouldSkipRefresh = (url) => {
  const endpoint = String(url || '');
  return (
    endpoint.includes(AUTH_ENDPOINTS.LOGIN) ||
    endpoint.includes(AUTH_ENDPOINTS.REGISTER) ||
    endpoint.includes(AUTH_ENDPOINTS.REFRESH_TOKEN) ||
    endpoint.includes(AUTH_ENDPOINTS.FORGOT_PASSWORD) ||
    endpoint.includes(AUTH_ENDPOINTS.RESET_PASSWORD)
  );
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const statusCode = error.response?.status;

    if (statusCode === 401 && !originalRequest._retry && !shouldSkipRefresh(originalRequest.url)) {
      originalRequest._retry = true;

      const refreshToken = getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        pushAppAlert({
          type: 'warning',
          message: 'Tu sesion expiro. Inicia sesion nuevamente.',
        });
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingQueue.push({ resolve, reject });
        })
          .then((nextAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
            return apiClient(originalRequest);
          })
          .catch((queuedError) => Promise.reject(queuedError));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No se recibio un nuevo access token.');
        }

        setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        processWaitingQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processWaitingQueue(refreshError, null);
        pushAppAlert({
          type: 'warning',
          message: 'Tu sesion expiro. Inicia sesion nuevamente.',
        });
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      const networkError = {
        message: 'Error de red. Verifica tu conexion a internet.',
        type: 'network_error',
      };
      pushAppAlert({
        type: 'error',
        message: networkError.message,
      });
      return Promise.reject(networkError);
    }

    const formattedError = {
      message: error.response?.data?.message || 'Ocurrio un error inesperado.',
      status: statusCode,
      data: error.response?.data,
      type: 'api_error',
    };

    if (statusCode >= 500) {
      pushAppAlert({
        type: 'error',
        message: 'El servidor no pudo procesar la solicitud. Intenta nuevamente.',
      });
    }

    return Promise.reject(formattedError);
  },
);

export const uploadFile = (url, formData, onUploadProgress) => {
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const downloadFile = async (url, filename) => {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

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
