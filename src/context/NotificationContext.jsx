/**
 * Notification Context
 * 
 * Manages notifications and unread count for the user.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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

  // Simulación de notificaciones (luego conectar con API real)
  useEffect(() => {
    if (isAuthenticated) {
      // Aquí iría la llamada a la API para obtener notificaciones
      const mockNotifications = [
        {
          id: 1,
          type: 'contact',
          title: 'Nuevo contacto en tu reporte',
          message: 'Alguien está interesado en tu reporte de "Max"',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
        {
          id: 2,
          type: 'update',
          title: 'Reporte actualizado',
          message: 'Tu reporte ha sido verificado correctamente',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
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
