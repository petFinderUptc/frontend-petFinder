/**
 * Profile Page
 * 
 * User profile management with editable information and statistics.
 */

import { useState, useRef, useEffect } from 'react';
import { Camera, Save, X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert } from '../../components/ui/alert';
import { useForm } from '../../hooks/useForm';
import { getUserStats, uploadAvatar } from '../../services/profileService';
import { updateUserProfile } from '../../services/userService';

function formatMemberSince(value) {
  if (!value) return 'Fecha no disponible';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.profileImage || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    reportsPublished: 0,
    successfulReunions: 0,
    helpedPets: 0,
    memberSince: 'Enero 2024',
  });
  const fileInputRef = useRef(null);

  const { values, handleChange, setValues } = useForm({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    location: user?.location || [user?.city, user?.department].filter(Boolean).join(', '),
  });

  // Cargar estadísticas del usuario al montar el componente
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const response = await getUserStats();
        const statsData = response.data || response;
        setStats({
          reportsPublished: statsData.reportsPublished || 0,
          successfulReunions: statsData.successfulReunions || 0,
          helpedPets: statsData.helpedPets || 0,
          memberSince: formatMemberSince(user?.createdAt || statsData.memberSince || 'Enero 2024'),
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };

    loadUserStats();
  }, [user?.createdAt]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ 
          type: 'error', 
          text: 'La imagen debe ser menor a 5MB' 
        });
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let avatarUrl = avatarPreview;

      // Upload avatar si hay uno nuevo
      if (avatarFile) {
        const avatarResponse = await uploadAvatar(avatarFile);
        avatarUrl = avatarResponse.data?.avatarUrl || avatarResponse.avatarUrl;
      }

      // Actualizar perfil
      const profileData = {
        ...values,
        avatar: avatarUrl,
      };

      const updatedUser = await updateUserProfile(profileData);
      
      // Actualizar contexto de usuario
      updateUser(updatedUser);

      setMessage({ 
        type: 'success', 
        text: 'Perfil actualizado correctamente' 
      });
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValues({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || user?.phoneNumber || '',
      location: user?.location || [user?.city, user?.department].filter(Boolean).join(', '),
    });
    setAvatarPreview(user?.avatar || user?.profileImage || null);
    setMessage({ type: '', text: '' });
  };

  const getInitials = () => {
    if (values.firstName && values.lastName) {
      return `${values.firstName[0]}${values.lastName[0]}`.toUpperCase();
    }
    if (values.username) {
      return values.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground mt-1">Gestiona tu información personal y configuración</p>
          </div>

          {message.text && (
            <Alert 
              variant={message.type === 'error' ? 'destructive' : 'default'}
              className="mb-6"
            >
              {message.text}
            </Alert>
          )}

          {/* Profile Content */}
          <div className="grid gap-6">
            {/* Avatar and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu foto de perfil y datos personales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {/* Avatar Section */}
                  <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-semibold border-4 border-gray-200">
                          {getInitials()}
                        </div>
                      )}
                      
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {values.firstName || values.lastName 
                          ? `${values.firstName} ${values.lastName}` 
                          : values.username || 'Usuario'}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">@{values.username}</p>
                      
                      {!isEditing && (
                        <Button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          Editar Perfil
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Nombre
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Apellido
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tu apellido"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Nombre de usuario
                      </label>
                      <Input
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="usuario123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Ubicación
                      </label>
                      <Input
                        type="text"
                        name="location"
                        value={values.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Ciudad, País"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
                <CardDescription>
                  Tu impacto en la comunidad PetFinder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{stats.reportsPublished}</p>
                    <p className="text-sm text-muted-foreground mt-1">Reportes Publicados</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{stats.successfulReunions}</p>
                    <p className="text-sm text-muted-foreground mt-1">Reuniones Exitosas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{stats.helpedPets}</p>
                    <p className="text-sm text-muted-foreground mt-1">Mascotas Ayudadas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">{stats.memberSince}</p>
                    <p className="text-xs text-muted-foreground mt-1">Miembro desde</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
