/**
 * Notifications Page
 * 
 * Displays notification history and allows marking as read.
 */

import { useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Mail, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatDistanceToNow } from '../../utils/helpers';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'update':
        return <AlertCircle className="h-5 w-5 text-green-600" />;
      case 'message':
        return <Mail className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'contact':
        return 'border-blue-200 bg-blue-50';
      case 'update':
        return 'border-green-200 bg-green-50';
      case 'message':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 
                  ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                  : 'No tienes notificaciones sin leer'
                }
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read 
                      ? `border-2 ${getNotificationColor(notification.type)}` 
                      : 'border bg-white'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-3 rounded-full ${
                        !notification.read ? 'bg-white' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge variant="destructive" className="flex-shrink-0">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(notification.timestamp)}
                          </div>
                          
                          {!notification.read && (
                            <Button
                              onClick={() => markAsRead(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-7 text-xs"
                            >
                              <Check className="h-3 w-3" />
                              Marcar como leída
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-600 text-sm">
                  Cuando recibas notificaciones, aparecerán aquí
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    ¿Cuándo recibirás notificaciones?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Cuando alguien contacte tu reporte de mascota</li>
                    <li>• Cuando tu reporte sea verificado</li>
                    <li>• Actualizaciones importantes del sistema</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
