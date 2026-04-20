import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, HelpCircle, Loader2, MapPin, Navigation, Sparkles, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { LocationPicker } from '../../components/LocationPicker';
import { MatchesModal } from '../../components/MatchesModal';
import { useAlert } from '../../context/AlertContext';
import { PUBLIC_ROUTES } from '../../constants/routes';
import { reverseGeocode, searchAddress } from '../../services/locationService';
import { analyzePhoto, createReport, getReportMatches, uploadReportImage } from '../../services/reportService';
import {
  validateContact,
  validateColor,
  validateBreed,
  validateDescription,
} from '../../utils/validation';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const initialForm = {
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

const CONTACT_TOOLTIP =
  'Ingresa un número de teléfono colombiano (ej: 310 123 4567) o un correo electrónico. Este dato será visible para quien encuentre tu reporte.';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
      <Sparkles className="h-2.5 w-2.5" />
      IA
    </span>
  );
}

function ContactTooltip() {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
        aria-label="Ayuda sobre el campo contacto"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {visible && (
        <span className="absolute bottom-full left-1/2 z-[60] mb-2 w-64 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
          {CONTACT_TOOLTIP}
        </span>
      )}
    </span>
  );
}

export default function PublishReportPage() {
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFields, setAiFields] = useState(null); // campos que la IA llenó
  const [matches, setMatches] = useState(null);   // coincidencias post-publicación
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const locationTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (locationTimerRef.current) window.clearTimeout(locationTimerRef.current);
    };
  }, [previewUrl]);

  useEffect(() => {
    const query = formData.locationQuery.trim();
    if (locationTimerRef.current) window.clearTimeout(locationTimerRef.current);
    if (query.length < 3) { setLocationSuggestions([]); return; }

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

  // Validators por campo
  const validators = {
    color: (v) => validateColor(v),
    breed: (v) => validateBreed(v),
    description: (v) => validateDescription(v),
    contact: (v) => validateContact(v),
  };

  const validateField = (name, value) => {
    if (!validators[name]) return '';
    const result = validators[name](value);
    return result.isValid ? '' : result.error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const errors = {};
    if (!imageFile) errors.image = 'La imagen es obligatoria.';
    Object.keys(validators).forEach((name) => {
      const error = validateField(name, formData[name]);
      if (error) errors[name] = error;
    });
    if (!formData.locationQuery.trim() && typeof latitude !== 'number') {
      errors.locationQuery = 'La ubicación es obligatoria.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
      !!imageFile &&
      (typeof latitude === 'number' || formData.locationQuery.trim().length >= 3)
    );
  }, [formData, imageFile, latitude, longitude]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Tipo de imagen no permitido. Usa JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('La imagen no debe superar 5 MB.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError('');
    setFieldErrors((prev) => ({ ...prev, image: '' }));

    // Análisis IA — rellenar campos automáticamente
    setIsAnalyzing(true);
    setAiFields(null);
    try {
      const result = await analyzePhoto(file);
      if (result) {
        setAiFields(result);
        setFormData((prev) => ({
          ...prev,
          species:     result.species     || prev.species,
          breed:       result.breed       || prev.breed,
          color:       result.color       || prev.color,
          size:        result.size        || prev.size,
          description: result.description || prev.description,
        }));
        // Limpiar errores de campos que la IA rellenó
        setFieldErrors((prev) => ({
          ...prev,
          breed: '',
          color: '',
          description: '',
        }));
      }
    } catch {
      // Silencioso — la IA es un helper, no bloqueante
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, locationQuery: suggestion.displayName || '' }));
    setLatitude(Number(suggestion.lat));
    setLongitude(Number(suggestion.lon));
    setLocationSuggestions([]);
    setFieldErrors((prev) => ({ ...prev, locationQuery: '' }));
  };

  const updateLocationFromMap = async ({ lat, lon }) => {
    setLatitude(lat);
    setLongitude(lon);
    setFieldErrors((prev) => ({ ...prev, locationQuery: '' }));
    try {
      const reverse = await reverseGeocode(lat, lon);
      if (reverse?.displayName) {
        setFormData((prev) => ({ ...prev, locationQuery: reverse.displayName }));
      }
    } catch { /* no-op */ }
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setSubmitError('Tu navegador no soporta geolocalización.');
      return;
    }
    setIsLocating(true);
    setSubmitError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLat = Number(position.coords.latitude.toFixed(6));
        const nextLon = Number(position.coords.longitude.toFixed(6));
        setLatitude(nextLat);
        setLongitude(nextLon);
        setFieldErrors((prev) => ({ ...prev, locationQuery: '' }));
        try {
          const reverse = await reverseGeocode(nextLat, nextLon);
          if (reverse?.displayName) {
            setFormData((prev) => ({ ...prev, locationQuery: reverse.displayName }));
          }
        } catch { /* no-op */ }
        finally { setIsLocating(false); }
      },
      () => { setSubmitError('No se pudo obtener tu ubicación actual.'); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const uploadImageWithRetry = async (file, retries = 1) => {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const uploadResult = await uploadReportImage(file, (progressEvent) => {
          const total = progressEvent.total || 1;
          setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
        });
        if (!uploadResult?.imageUrl) throw new Error('No se obtuvo la URL final de la imagen.');
        return uploadResult.imageUrl;
      } catch (uploadError) { lastError = uploadError; }
    }
    throw lastError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validateAll()) {
      setSubmitError('Corrige los errores antes de publicar.');
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadImageWithRetry(imageFile, 1);
      const payload = {
        species: formData.species,
        type: formData.type,
        status: formData.status,
        description: formData.description.trim(),
        color: formData.color.trim(),
        breed: formData.breed.trim(),
        size: formData.size,
        contact: formData.contact.trim(),
        imageUrl,
        locationQuery: formData.locationQuery.trim(),
      };
      if (typeof latitude === 'number' && typeof longitude === 'number') {
        payload.lat = latitude;
        payload.lon = longitude;
      }
      const created = await createReport(payload);
      addAlert({ type: 'success', message: 'Reporte publicado correctamente.' });

      // Buscar coincidencias IA (no bloquea la navegación si falla)
      if (created?.id) {
        try {
          const { data } = await getReportMatches(created.id);
          if (data?.length) {
            setMatches({ items: data, type: payload.type });
            return; // mantener en la página hasta que cierre el modal
          }
        } catch { /* no-op */ }
      }
      navigate(PUBLIC_ROUTES.SEARCH);
    } catch (err) {
      setSubmitError(err?.message || err?.data?.message || 'No fue posible crear el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (name) =>
    fieldErrors[name] ? 'border-red-500 focus-visible:ring-red-400' : '';

  // true si la IA rellenó ese campo y el usuario no lo ha modificado aún
  const isAiField = (name) =>
    aiFields?.[name] && formData[name] === aiFields[name];

  return (
    <>
    {matches && (
      <MatchesModal
        matches={matches.items}
        reportType={matches.type}
        onClose={() => { setMatches(null); navigate(PUBLIC_ROUTES.SEARCH); }}
      />
    )}
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Crear reporte</CardTitle>
              <CardDescription>
                Publica un reporte con foto y ubicación precisa. Los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                {/* Imagen */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Imagen *</label>
                  <div className={`rounded-lg border-2 border-dashed p-4 ${fieldErrors.image ? 'border-red-400' : ''}`}>
                    <input
                      id="report-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="report-image" className="block cursor-pointer text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Haz clic para seleccionar (JPG, PNG, WEBP · máx. 5 MB)'}
                      </p>
                    </label>
                  </div>
                  {previewUrl && (
                    <img src={previewUrl} alt="Vista previa" className="mt-3 h-64 w-full rounded-lg border object-cover" />
                  )}
                  <FieldError message={imageError || fieldErrors.image} />

                  {/* Banner de análisis IA */}
                  {isAnalyzing && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30 px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-500 flex-shrink-0" />
                      <span className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                        Analizando imagen con IA…
                      </span>
                    </div>
                  )}
                  {!isAnalyzing && aiFields && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 px-3 py-2">
                      <Sparkles className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        Campos completados por IA. Revisa y corrige si es necesario.
                      </span>
                    </div>
                  )}
                  {isSubmitting && uploadProgress > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Subiendo imagen: {uploadProgress}%</p>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-[#004c22] transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Especie / Tipo / Estado */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Especie *</label>
                    <select name="species" value={formData.species} onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3">
                      <option value="dog">Perro</option>
                      <option value="cat">Gato</option>
                      <option value="bird">Ave</option>
                      <option value="rabbit">Conejo</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Tipo *</label>
                    <select name="type" value={formData.type} onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3">
                      <option value="lost">Perdido</option>
                      <option value="found">Encontrado</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Estado *</label>
                    <select name="status" value={formData.status} onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3">
                      <option value="active">Activo</option>
                      <option value="resolved">Resuelto</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Color / Raza / Tamaño */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                      Color *
                      {isAiField('color') && <AiBadge />}
                    </label>
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="ej: negro, blanco y café"
                      maxLength={50}
                      className={inputClass('color')}
                    />
                    <FieldError message={fieldErrors.color} />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                      Raza *
                      {isAiField('breed') && <AiBadge />}
                    </label>
                    <Input
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="ej: mestizo, labrador"
                      maxLength={60}
                      className={inputClass('breed')}
                    />
                    <FieldError message={fieldErrors.breed} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Tamaño *</label>
                    <select name="size" value={formData.size} onChange={handleChange}
                      className="h-9 w-full rounded-md border bg-background px-3">
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                    Descripción *
                    {isAiField('description') && <AiBadge />}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe rasgos distintivos: collar, cicatrices, comportamiento, zona donde se perdió..."
                    maxLength={500}
                    rows={4}
                    className={`min-h-[96px] w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErrors.description ? 'border-red-500' : ''}`}
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <FieldError message={fieldErrors.description} />
                    <span className={`text-xs ${formData.description.length > 450 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>

                {/* Contacto */}
                <div>
                  <label className="mb-1 flex items-center text-sm font-medium">
                    Contacto *
                    <ContactTooltip />
                  </label>
                  <Input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="310 123 4567 o tu@correo.com"
                    maxLength={100}
                    className={inputClass('contact')}
                  />
                  <FieldError message={fieldErrors.contact} />
                </div>

                {/* Ubicación */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Ubicación *</label>
                  <div className="relative">
                    <Input
                      name="locationQuery"
                      value={formData.locationQuery}
                      onChange={handleChange}
                      onBlur={(e) => {
                        if (!e.target.value.trim() && typeof latitude !== 'number') {
                          setFieldErrors((prev) => ({ ...prev, locationQuery: 'La ubicación es obligatoria.' }));
                        }
                      }}
                      placeholder="Dirección o referencia del lugar"
                      className={inputClass('locationQuery')}
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
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#004c22]" />
                            <span>{suggestion.displayName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <FieldError message={fieldErrors.locationQuery} />

                  <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation}
                    disabled={isLocating} className="gap-2">
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                    Usar mi ubicación actual
                  </Button>

                  <LocationPicker latitude={latitude} longitude={longitude} onLocationChange={updateLocationFromMap} />

                  {typeof latitude === 'number' && typeof longitude === 'number' && (
                    <p className="text-xs text-muted-foreground">
                      Coordenadas: {latitude}, {longitude}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Publicando...
                      </span>
                    ) : 'Publicar reporte'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
