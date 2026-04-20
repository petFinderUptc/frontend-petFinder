/**
 * Settings Page
 * 
 * Application settings including theme, notifications, and privacy.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, BellOff, Monitor, Check, Globe, Shield, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications-enabled', true);
  const [emailNotifications, setEmailNotifications] = useLocalStorage('email-notifications', true);
  const [profileVisibility, setProfileVisibility] = useLocalStorage('profile-visibility', 'public');
  const [showPhone, setShowPhone] = useLocalStorage('show-phone', true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setMessage({ 
      type: 'success', 
      text: `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}` 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setMessage({ 
      type: 'success', 
      text: notificationsEnabled 
        ? 'Notificaciones desactivadas' 
        : 'Notificaciones activadas' 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
    setMessage({ 
      type: 'success', 
      text: emailNotifications 
        ? 'Notificaciones por email desactivadas' 
        : 'Notificaciones por email activadas' 
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <motion.div
      className="min-h-screen py-8"
      style={{ background: '#faf9f5' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-1">Personaliza tu experiencia en PetFinder</p>
          </div>

          {message.text && (
            <Alert 
              variant={message.type === 'error' ? 'destructive' : 'default'}
              className="mb-6"
            >
              {message.text}
            </Alert>
          )}

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Elige cómo quieres ver PetFinder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {/* Light Theme */}
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 border-2 rounded-lg transition-all hover:border-[#004c22] ${
                      theme === 'light' 
                        ? 'border-primary bg-accent' 
                        : 'border bg-card'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Sun className="h-8 w-8 text-yellow-500" />
                      <span className="font-medium text-sm">Claro</span>
                      {theme === 'light' && (
                        <Check className="h-4 w-4 text-[#004c22]" />
                      )}
                    </div>
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 border-2 rounded-lg transition-all hover:border-[#004c22] ${
                      theme === 'dark' 
                        ? 'border-primary bg-accent' 
                        : 'border bg-card'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Moon className="h-8 w-8 text-indigo-500" />
                      <span className="font-medium text-sm">Oscuro</span>
                      {theme === 'dark' && (
                        <Check className="h-4 w-4 text-[#004c22]" />
                      )}
                    </div>
                  </button>

                  {/* System Theme */}
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 border-2 rounded-lg transition-all hover:border-[#004c22] ${
                      theme === 'system' 
                        ? 'border-primary bg-accent' 
                        : 'border bg-card'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Monitor className="h-8 w-8 text-muted-foreground" />
                      <span className="font-medium text-sm">Sistema</span>
                      {theme === 'system' && (
                        <Check className="h-4 w-4 text-[#004c22]" />
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Administra cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {notificationsEnabled ? (
                      <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    ) : (
                      <BellOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">Notificaciones Push</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleNotificationToggle}
                    variant={notificationsEnabled ? 'default' : 'outline'}
                    size="sm"
                  >
                    {notificationsEnabled ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Notificaciones por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibe resúmenes diarios por correo
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleEmailNotificationToggle}
                    variant={emailNotifications ? 'default' : 'outline'}
                    size="sm"
                  >
                    {emailNotifications ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidad
                </CardTitle>
                <CardDescription>
                  Controla la visibilidad de tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Visibility */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Eye className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Visibilidad del Perfil</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Define quién puede ver tu perfil
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <button
                      onClick={() => {
                        setProfileVisibility('public');
                        setMessage({ type: 'success', text: 'Perfil público' });
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                      }}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        profileVisibility === 'public'
                          ? 'border-primary bg-accent'
                          : 'border bg-card hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Público</span>
                        {profileVisibility === 'public' && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Cualquiera puede ver tu perfil</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        setProfileVisibility('private');
                        setMessage({ type: 'success', text: 'Perfil privado' });
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                      }}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        profileVisibility === 'private'
                          ? 'border-primary bg-accent'
                          : 'border bg-card hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Privado</span>
                        {profileVisibility === 'private' && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Solo usuarios registrados</p>
                    </button>
                  </div>
                </div>

                {/* Phone Visibility */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {showPhone ? (
                      <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">Mostrar Teléfono</h4>
                      <p className="text-sm text-muted-foreground">
                        Muestra tu número en los reportes
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowPhone(!showPhone);
                      setMessage({ 
                        type: 'success', 
                        text: showPhone ? 'Teléfono oculto' : 'Teléfono visible' 
                      });
                      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                    }}
                    variant={showPhone ? 'default' : 'outline'}
                    size="sm"
                  >
                    {showPhone ? 'Visible' : 'Oculto'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings (Future) */}
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium text-foreground mb-1">Más opciones próximamente</h4>
                <p className="text-sm text-muted-foreground">
                  Configuración de idioma, zona horaria y más
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
