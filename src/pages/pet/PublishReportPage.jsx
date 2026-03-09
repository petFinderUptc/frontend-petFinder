import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Phone, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { PET_TYPES } from '../../constants/appConfig';
import { PROTECTED_ROUTES } from '../../constants/routes';
import { createPet } from '../../services/petService';
import { useAuth } from '../../context/AuthContext';

export default function PublishReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [useMyContact, setUseMyContact] = useState(true); // Marcado por defecto
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    color: '',
    size: '',
    status: 'lost',
    description: '',
    location: '',
    city: '',
    neighborhood: '',
    date: '',
    contactPhone: '',
    contactEmail: '',
    image: null
  });

  // Prellenar información de contacto del usuario
  useEffect(() => {
    if (useMyContact && user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || '',
        contactPhone: user.phoneNumber || ''
      }));
    } else if (!useMyContact) {
      // Limpiar campos cuando se desmarca
      setFormData(prev => ({
        ...prev,
        contactEmail: '',
        contactPhone: ''
      }));
    }
  }, [useMyContact, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.type || !formData.status || !formData.city || !formData.neighborhood || !formData.contactPhone || !formData.color || !formData.size || !formData.date) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Map frontend data to backend CreatePostDto format
      const postData = {
        type: formData.status, // 'lost' or 'found'
        petName: formData.name,
        petType: formData.type, // 'dog', 'cat', etc.
        breed: formData.breed || undefined,
        color: formData.color,
        size: formData.size, // 'small', 'medium', 'large'
        description: formData.description || 'Sin descripción adicional',
        location: {
          city: formData.city,
          neighborhood: formData.neighborhood,
          address: formData.location || undefined
        },
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail || undefined,
        lostOrFoundDate: formData.date
      };

      console.log('Submitting report:', postData);
      await createPet(postData);
      navigate(PROTECTED_ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Error al publicar el reporte. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">Publicar Reporte</h1>
            <p className="text-lg text-gray-600">
              Ayúdanos a reunir mascotas con sus familias compartiendo información
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Mascota</CardTitle>
              <CardDescription>
                Completa todos los campos para ayudar a otros a identificar la mascota
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de la Mascota *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        {formData.image ? formData.image.name : 'Click para subir una imagen'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                    </label>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre de la mascota"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecciona un tipo</option>
                      {Object.entries(PET_TYPES).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                      Raza
                    </label>
                    <Input
                      id="breed"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      placeholder="Ej: Golden Retriever"
                    />
                  </div>

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color *
                    </label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ej: Café, Blanco, Negro"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                      Tamaño *
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecciona un tamaño</option>
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="lost">Perdido</option>
                      <option value="found">Encontrado</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción Detallada
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe características distintivas, comportamiento, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ej: Tunja"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                      Barrio *
                    </label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder="Ej: Centro"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección (Opcional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ej: Calle 10 #5-20"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha del Evento *
                    </label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Use My Contact Info Checkbox */}
                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="useMyContact"
                    checked={useMyContact}
                    onChange={(e) => setUseMyContact(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="useMyContact" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Usar mi información de contacto ({user?.email || 'No disponible'})
                  </label>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de Contacto *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="300 123 4567"
                        className="pl-9"
                        required
                        disabled={useMyContact}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email de Contacto
                    </label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      disabled={useMyContact}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(PROTECTED_ROUTES.DASHBOARD)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Reporte'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
