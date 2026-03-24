/**
 * Notification Service
 * 
 * API calls for notification management
 * Consumes notification endpoints from backend.
 */

import apiClient from './api/apiClient';
import { NOTIFICATION_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Get all notifications for current user
 * @param {Object} params - Query parameters (page, limit, read)
 * @returns {Promise<Array>} List of notifications
 */
export const getNotifications = async (params = {}) => {
  const response = await apiClient.get(NOTIFICATION_ENDPOINTS.GET_ALL, { params });
  // Backend devuelve estructura paginada: { data: [], pagination: {} }
  return Array.isArray(response.data) ? response.data : response.data?.data || [];
};

/**
 * Get unread notification count
 * @returns {Promise<number>} Unread count
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get(NOTIFICATION_ENDPOINTS.GET_UNREAD);
  // Backend devuelve: { count: number, notifications: [] }
  return response.data?.count ?? 0;
};

/**
 * Mark notification as read
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const markAsRead = async (notificationId) => {
  const response = await apiClient.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success message
 */
export const markAllAsRead = async () => {
  const response = await apiClient.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
  return response.data;
};

/**
 * Delete notification
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const deleteNotification = async (notificationId) => {
  const response = await apiClient.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId));
  return response.data;
};

/**
 * Get notification preferences - Almacenadas localmente en frontend
 * @returns {Promise<Object>} Notification preferences
 */
export const getNotificationPreferences = async () => {
  const prefs = localStorage.getItem('notification_preferences');
  return Promise.resolve({
    data: prefs ? JSON.parse(prefs) : {
      emailNotifications: true,
      pushNotifications: true,
      contactAlerts: true,
      updateAlerts: true,
    },
  });
};

/**
 * Update notification preferences - Almacenadas localmente en frontend
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} Updated preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  // Guardar en localStorage - backend no tiene este endpoint
  localStorage.setItem('notification_preferences', JSON.stringify(preferences));
  return Promise.resolve({ data: preferences });
  
  // Implementación real cuando el backend esté listo:
  // const response = await apiClient.put('/notifications/preferences', preferences);
  // return response.data;
};

/**
 * Subscribe to push notifications
 * @param {Object} subscription - Push subscription object
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const subscribeToPush = async (subscription) => {
  console.warn('⚠️ Suscripción a push notifications simulada. Implementar en backend.', subscription);
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.post('/notifications/subscribe', subscription);
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const unsubscribeFromPush = async () => {
  console.warn('⚠️ Desuscripción de push notifications simulada. Implementar en backend.');
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.post('/notifications/unsubscribe');
};
