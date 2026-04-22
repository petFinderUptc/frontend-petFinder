import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, BellOff, Monitor, Check, Globe, Shield, Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { changePassword, updateUserProfile } from '../../services/userService';

export default function SettingsPage() {
  const { theme, setTheme, isDark } = useTheme();
  const { user, updateUser } = useAuth();

  const [emailNotifications, setEmailNotifications] = useLocalStorage('email-notifications', true);
  const [profileVisibility, setProfileVisibility] = useLocalStorage('profile-visibility', 'public');
  const [showPhone, setShowPhone] = useLocalStorage('show-phone', true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // A3 — notifications preference from backend user object
  const notificationsEnabled = user?.notificationsEnabled ?? true;
  const [notifSaving, setNotifSaving] = useState(false);

  // A2 — change password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    showMsg('success', `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : newTheme === 'light' ? 'claro' : 'sistema'}`);
  };

  // A3 — toggle notifications via backend
  const handleNotificationToggle = async () => {
    const next = !notificationsEnabled;
    setNotifSaving(true);
    try {
      const updated = await updateUserProfile({ notificationsEnabled: next });
      updateUser(updated);
      showMsg('success', next ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
    } catch {
      showMsg('error', 'No fue posible actualizar la preferencia de notificaciones.');
    } finally {
      setNotifSaving(false);
    }
  };

  // A2 — submit change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    const { currentPassword, newPassword, confirmNewPassword } = pwForm;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwError('Completa todos los campos.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('Las contraseñas no coinciden.');
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showMsg('success', 'Contraseña actualizada correctamente.');
    } catch (err) {
      setPwError(err?.response?.data?.message || err?.message || 'No fue posible cambiar la contraseña.');
    } finally {
      setPwSaving(false);
    }
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
            {/* Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Apariencia
                </CardTitle>
                <CardDescription>Elige cómo quieres ver PetFinder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Claro', icon: <Sun className="h-8 w-8 text-yellow-500" /> },
                    { value: 'dark', label: 'Oscuro', icon: <Moon className="h-8 w-8 text-indigo-500" /> },
                    { value: 'system', label: 'Sistema', icon: <Monitor className="h-8 w-8 text-muted-foreground" /> },
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value)}
                      className={`p-4 border-2 rounded-lg transition-all hover:border-blue-400 ${
                        theme === value ? 'border-primary bg-accent' : 'border bg-card'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {icon}
                        <span className="font-medium text-sm">{label}</span>
                        {theme === value && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>Administra cómo y cuándo recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {notificationsEnabled ? (
                      <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    ) : (
                      <BellOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">Notificaciones en plataforma</h4>
                      <p className="text-sm text-muted-foreground">Recibe alertas de actividad en tu cuenta</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleNotificationToggle}
                    variant={notificationsEnabled ? 'default' : 'outline'}
                    size="sm"
                    disabled={notifSaving}
                  >
                    {notifSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : notificationsEnabled ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Notificaciones por Email</h4>
                      <p className="text-sm text-muted-foreground">Recibe resúmenes diarios por correo</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setEmailNotifications(!emailNotifications);
                      showMsg('success', emailNotifications ? 'Notificaciones por email desactivadas' : 'Notificaciones por email activadas');
                    }}
                    variant={emailNotifications ? 'default' : 'outline'}
                    size="sm"
                  >
                    {emailNotifications ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* A2 — Security / Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Cambia tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  {pwError && (
                    <Alert variant="destructive">{pwError}</Alert>
                  )}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Contraseña actual</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      disabled={pwSaving}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Nueva contraseña</label>
                    <Input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                      disabled={pwSaving}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Confirmar nueva contraseña</label>
                    <Input
                      type="password"
                      placeholder="Repite la nueva contraseña"
                      value={pwForm.confirmNewPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                      disabled={pwSaving}
                    />
                  </div>
                  <Button type="submit" disabled={pwSaving} className="gap-2">
                    {pwSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Actualizar contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidad
                </CardTitle>
                <CardDescription>Controla la visibilidad de tu información</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <Eye className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Visibilidad del Perfil</h4>
                      <p className="text-sm text-muted-foreground mb-3">Define quién puede ver tu perfil</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {[
                      { value: 'public', label: 'Público', desc: 'Cualquiera puede ver tu perfil' },
                      { value: 'private', label: 'Privado', desc: 'Solo usuarios registrados' },
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setProfileVisibility(value);
                          showMsg('success', `Perfil ${label.toLowerCase()}`);
                        }}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          profileVisibility === value
                            ? 'border-primary bg-accent'
                            : 'border bg-card hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{label}</span>
                          {profileVisibility === value && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {showPhone ? (
                      <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">Mostrar Teléfono</h4>
                      <p className="text-sm text-muted-foreground">Muestra tu número en los reportes</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowPhone(!showPhone);
                      showMsg('success', showPhone ? 'Teléfono oculto' : 'Teléfono visible');
                    }}
                    variant={showPhone ? 'default' : 'outline'}
                    size="sm"
                  >
                    {showPhone ? 'Visible' : 'Oculto'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-medium text-foreground mb-1">Más opciones próximamente</h4>
                <p className="text-sm text-muted-foreground">Configuración de idioma, zona horaria y más</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
