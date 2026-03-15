import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Phone, Mail, AlertCircle, ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { PetMap } from '../../components/PetMap';
import * as petService from '../../services/petService';

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    loadPetDetail();
  }, [id]);

  const loadPetDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setImgError(false);
      const data = await petService.getPetById(id);
      setPet(data);
    } catch (err) {
      console.error('Error loading pet detail:', err);
      setError('No se pudo cargar la información de la mascota');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pet.name || 'Mascota'} - ${pet.status === 'lost' ? 'Perdido' : 'Encontrado'}`,
        text: `Ayuda a encontrar a ${pet.name || 'esta mascota'}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error || 'Mascota no encontrada'}</p>
            <Button onClick={() => navigate('/search')}>
              Volver a búsqueda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    lost: 'bg-red-100 text-red-800 border-red-200',
    found: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusLabels = {
    lost: 'Perdido',
    found: 'Encontrado',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header con botón de volver */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {!imgError && pet.photo ? (
                    <img
                      src={pet.photo}
                      alt={pet.name || 'Mascota'}
                      className="w-full h-96 object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-96 bg-muted flex flex-col items-center justify-center gap-3">
                      <AlertCircle className="h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">Sin foto disponible</p>
                    </div>
                  )}
                  {pet.isUrgent && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                      <AlertCircle className="h-5 w-5" />
                      CASO URGENTE
                    </div>
                  )}
                  <Badge className={`absolute top-4 right-4 ${statusColors[pet.status]} shadow-lg text-sm px-3 py-1`}>
                    {statusLabels[pet.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Información de la mascota */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {pet.name || `${pet.type === 'dog' ? 'Perro' : 'Gato'} sin nombre`}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{pet.breed}</Badge>
                      <Badge variant="outline">{pet.color}</Badge>
                      <Badge variant="outline">{pet.gender === 'male' ? 'Macho' : 'Hembra'}</Badge>
                      {pet.age && <Badge variant="outline">{pet.age}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-foreground leading-relaxed">{pet.description}</p>
                  </div>

                  {pet.characteristics && (
                    <div>
                      <h3 className="font-semibold mb-2">Características adicionales</h3>
                      <p className="text-foreground">{pet.characteristics}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Ubicación</p>
                        <p className="font-medium">
                          {typeof pet.location === 'object' && pet.location !== null
                            ? [
                                pet.location.neighborhood,
                                pet.location.city,
                              ].filter(Boolean).join(', ') || 'N/A'
                            : pet.location || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha</p>
                        <p className="font-medium">
                          {new Date(pet.date).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
            {(pet.coordinates || pet.location?.coordinates) && (
              <Card>
                <CardHeader>
                  <CardTitle>Ubicación en el mapa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <PetMap 
                      pets={[pet]} 
                      center={pet.coordinates || pet.location?.coordinates} 
                      zoom={15}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Información de contacto */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                    <p className="font-medium">{pet.contactName}</p>
                  </div>
                </div>

                {pet.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                      <a 
                        href={`tel:${pet.contactPhone}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {pet.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {pet.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <a 
                        href={`mailto:${pet.contactEmail}`}
                        className="font-medium text-blue-600 hover:underline break-all"
                      >
                        {pet.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button className="w-full" asChild>
                    <a href={`tel:${pet.contactPhone}`}>
                      Llamar ahora
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Publicado hace{' '}
                  {Math.floor((new Date() - new Date(pet.date)) / (1000 * 60 * 60 * 24))}{' '}
                  días
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
