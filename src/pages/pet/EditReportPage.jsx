import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Loader2, MapPin, Navigation, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { LocationPicker } from '../../components/LocationPicker';
import { useAlert } from '../../context/AlertContext';
import { PROTECTED_ROUTES } from '../../constants/routes';
import { reverseGeocode, searchAddress } from '../../services/locationService';
import { getReportById, updateReport, uploadReportImage } from '../../services/reportService';
import { toAbsoluteMediaUrl } from '../../utils/userAdapter';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const emptyForm = {
  species: 'dog',
  type: 'lost',
  status: 'active',
  description: '',
  color: '',
  breed: '',
  size: 'medium',
  contact: '',
  locationQuery: '',
};

export default function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const locationTimerRef = useRef(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const report = await getReportById(id);

        setFormData({
          species: report.species || 'dog',
          type: report.type || 'lost',
          status: report.status || 'active',
          description: report.description || '',
          color: report.color || '',
          breed: report.breed || '',
          size: report.size || 'medium',
          contact: report.contact || '',
          locationQuery: `${report.lat ?? ''}, ${report.lon ?? ''}`,
        });

        const reportLat = Number(report.lat);
        const reportLon = Number(report.lon);
        if (Number.isFinite(reportLat) && Number.isFinite(reportLon)) {
          setLatitude(reportLat);
          setLongitude(reportLon);

          try {
            const reverse = await reverseGeocode(reportLat, reportLon);
            if (reverse?.displayName) {
              setFormData((prev) => ({
                ...prev,
                locationQuery: reverse.displayName,
              }));
            }
          } catch {
            // no-op
          }
        }

        setCurrentImageUrl(toAbsoluteMediaUrl(report.imageUrl));
      } catch (loadError) {
        setError(loadError?.message || 'No fue posible cargar el reporte.');
      } finally {
        setLoading(false);
      }
    };

    void loadReport();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (locationTimerRef.current) {
        window.clearTimeout(locationTimerRef.current);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const query = formData.locationQuery.trim();

    if (locationTimerRef.current) {
      window.clearTimeout(locationTimerRef.current);
    }

    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    locationTimerRef.current = window.setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await searchAddress(query, 6);
        setLocationSuggestions(results);
      } catch {
        setLocationSuggestions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);
  }, [formData.locationQuery]);

  const canSubmit = useMemo(() => {
    return (
      !!formData.species &&
      !!formData.type &&
      !!formData.status &&
      !!formData.description.trim() &&
      !!formData.color.trim() &&
      !!formData.breed.trim() &&
      !!formData.size &&
      !!formData.contact.trim() &&
      ((typeof latitude === 'number' && typeof longitude === 'number') ||
        formData.locationQuery.trim().length >= 3)
    );
  }, [formData, latitude, longitude]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Tipo de imagen no permitido. Usa JPG, PNG o WEBP.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('La imagen no debe superar 5MB.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      locationQuery: suggestion.displayName || '',
    }));
    setLatitude(Number(suggestion.lat));
    setLongitude(Number(suggestion.lon));
    setLocationSuggestions([]);
  };

  const updateLocationFromMap = async ({ lat, lon }) => {
    setLatitude(lat);
    setLongitude(lon);

    try {
      const reverse = await reverseGeocode(lat, lon);
      if (reverse?.displayName) {
        setFormData((prev) => ({
          ...prev,
          locationQuery: reverse.displayName,
        }));
      }
    } catch {
      // no-op
    }
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalizacion.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLat = Number(position.coords.latitude.toFixed(6));
        const nextLon = Number(position.coords.longitude.toFixed(6));
        setLatitude(nextLat);
        setLongitude(nextLon);

        try {
          const reverse = await reverseGeocode(nextLat, nextLon);
          if (reverse?.displayName) {
            setFormData((prev) => ({
              ...prev,
              locationQuery: reverse.displayName,
            }));
          }
        } catch {
          // no-op
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setError('No se pudo obtener tu ubicacion actual.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Completa los datos obligatorios antes de guardar.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let nextImageUrl;

      if (imageFile) {
        const uploadResult = await uploadReportImage(imageFile, (progressEvent) => {
          const total = progressEvent.total || 1;
          setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
        });

        nextImageUrl = uploadResult?.imageUrl;
      }

      const payload = {
        species: formData.species,
        status: formData.status,
        description: formData.description.trim(),
        color: formData.color.trim(),
        breed: formData.breed.trim(),
        size: formData.size,
        contact: formData.contact.trim(),
        locationQuery: formData.locationQuery.trim(),
      };

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        payload.lat = latitude;
        payload.lon = longitude;
      }

      if (nextImageUrl) {
        payload.imageUrl = nextImageUrl;
      }

      await updateReport(id, payload);

      addAlert({
        type: 'success',
        message: 'Reporte actualizado correctamente.',
      });

      navigate(PROTECTED_ROUTES.MY_REPORTS);
    } catch (submitError) {
      setError(submitError?.message || 'No fue posible actualizar el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="py-12 text-center text-muted-foreground">Cargando reporte...</CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Editar reporte</CardTitle>
              <CardDescription>Actualiza la informacion y guarda los cambios.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium">Imagen</label>
                  <div className="rounded-lg border-2 border-dashed p-4">
                    <input
                      id="edit-report-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="edit-report-image" className="block cursor-pointer text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Selecciona una nueva imagen (opcional)'}
                      </p>
                    </label>
                  </div>
                  {(previewUrl || currentImageUrl) && (
                    <img
                      src={previewUrl || currentImageUrl}
                      alt="Vista previa"
                      className="mt-3 h-64 w-full rounded-lg border object-cover"
                    />
                  )}
                  {isSubmitting && uploadProgress > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">Subiendo imagen: {uploadProgress}%</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Especie *</label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3"
                      required
                    >
                      <option value="dog">Perro</option>
                      <option value="cat">Gato</option>
                      <option value="bird">Ave</option>
                      <option value="rabbit">Conejo</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Tipo</label>
                    <Input value={formData.type === 'lost' ? 'Perdido' : 'Encontrado'} disabled />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Estado *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3"
                      required
                    >
                      <option value="active">Activo</option>
                      <option value="resolved">Resuelto</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Color *</label>
                    <Input name="color" value={formData.color} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Raza *</label>
                    <Input name="breed" value={formData.breed} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Tamano *</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3"
                      required
                    >
                      <option value="small">Pequeno</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Descripcion *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    minLength={10}
                    required
                    rows={4}
                    className="min-h-[96px] w-full rounded-md border bg-background px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Contacto *</label>
                  <Input name="contact" value={formData.contact} onChange={handleChange} required />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Ubicacion *</label>
                  <div className="relative">
                    <Input
                      name="locationQuery"
                      value={formData.locationQuery}
                      onChange={handleChange}
                      placeholder="Direccion o referencia"
                      required
                    />
                    {isSearchingLocation && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {!isSearchingLocation && locationSuggestions.length > 0 && (
                      <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-card shadow-lg">
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={`${suggestion.displayName}-${index}`}
                            type="button"
                            onClick={() => selectSuggestion(suggestion)}
                            className="flex w-full items-start gap-2 border-b px-3 py-2 text-left text-sm transition hover:bg-muted"
                          >
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
                            <span>{suggestion.displayName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={useCurrentLocation}
                    disabled={isLocating}
                    className="gap-2"
                  >
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                    Usar mi ubicacion actual
                  </Button>

                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={updateLocationFromMap}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                      </span>
                    ) : (
                      'Guardar cambios'
                    )}
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
