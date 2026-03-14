/**
 * Notification Context
 * 
 * Manages notifications and unread count for the user.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getNotifications,
  getUnreadCount,
  markAsRead as markNotificationAsRead,
  markAllAsRead as markEveryNotificationAsRead,
} from '../services/notificationService';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const normalizeNotification = useCallback((notification) => ({
    ...notification,
    timestamp: notification?.timestamp || notification?.createdAt || new Date().toISOString(),
  }), []);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const [notificationsData, unread] = await Promise.all([
        getNotifications({ page: 1, limit: 20 }),
        getUnreadCount(),
      ]);

      const normalizedNotifications = Array.isArray(notificationsData)
        ? notificationsData.map(normalizeNotification)
        : [];

      setNotifications(normalizedNotifications);
      setUnreadCount(Number.isFinite(unread) ? unread : 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, normalizeNotification]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markEveryNotificationAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
