/**
 * Notification Service
 * 
 * API calls for notification management
 * NOTE: Sistema de notificaciones completamente pendiente de implementación en backend
 * Actualmente funciona con datos simulados en NotificationContext
 */

import apiClient from './api/apiClient';
import { NOTIFICATION_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Get all notifications for current user
 * @param {Object} params - Query parameters (page, limit, read)
 * @returns {Promise<Array>} List of notifications
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const getNotifications = async (params = {}) => {
  // Simulación temporal - los datos vienen del NotificationContext
  console.warn('⚠️ Servicio de notificaciones simulado. Implementar en backend.');
  return Promise.resolve({
    data: [],
  });
  
  // Implementación real cuando el backend esté listo:
  // const response = await apiClient.get(NOTIFICATION_ENDPOINTS.GET_ALL, { params });
  // return response.data;
};

/**
 * Get unread notification count
 * @returns {Promise<number>} Unread count
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const getUnreadCount = async () => {
  // Simulación temporal - la cuenta viene del NotificationContext
  return Promise.resolve({ count: 0 });
  
  // Implementación real cuando el backend esté listo:
  // const response = await apiClient.get(NOTIFICATION_ENDPOINTS.GET_UNREAD);
  // return response.data.count;
};

/**
 * Mark notification as read
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const markAsRead = async (notificationId) => {
  // Simulación temporal
  console.warn('⚠️ Marcado de notificación simulado. Implementar en backend.');
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.put(NOTIFICATION_ENDPOINTS.MARK_AS_READ(notificationId));
};

/**
 * Mark all notifications as read
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const markAllAsRead = async () => {
  // Simulación temporal
  console.warn('⚠️ Marcado masivo de notificaciones simulado. Implementar en backend.');
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.put(NOTIFICATION_ENDPOINTS.MARK_ALL_AS_READ);
};

/**
 * Delete notification
 * @param {string|number} notificationId - Notification ID
 * @returns {Promise<void>}
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const deleteNotification = async (notificationId) => {
  // Simulación temporal
  console.warn('⚠️ Eliminación de notificación simulada. Implementar en backend.');
  return Promise.resolve();
  
  // Implementación real cuando el backend esté listo:
  // await apiClient.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId));
};

/**
 * Get notification preferences
 * @returns {Promise<Object>} Notification preferences
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const getNotificationPreferences = async () => {
  // Simulación temporal - usar localStorage
  const prefs = localStorage.getItem('notification_preferences');
  return Promise.resolve({
    data: prefs ? JSON.parse(prefs) : {
      emailNotifications: true,
      pushNotifications: true,
      contactAlerts: true,
      updateAlerts: true,
    },
  });
  
  // Implementación real cuando el backend esté listo:
  // const response = await apiClient.get('/notifications/preferences');
  // return response.data;
};

/**
 * Update notification preferences
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} Updated preferences
 * 
 * TODO: Endpoint pendiente de implementación en backend
 */
export const updateNotificationPreferences = async (preferences) => {
  // Simulación temporal - guardar en localStorage
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
  console.warn('⚠️ Suscripción a push notifications simulada. Implementar en backend.');
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
