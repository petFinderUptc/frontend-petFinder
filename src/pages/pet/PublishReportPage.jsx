import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { PUBLIC_ROUTES } from '../../constants/routes';
import { createReport, uploadReportImage } from '../../services/reportService';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
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
  lat: '',
  lon: '',
};

export default function PublishReportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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
      formData.lat !== '' &&
      formData.lon !== '' &&
      !!imageFile
    );
  }, [formData, imageFile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Tipo de imagen no permitido. Usa JPG, PNG, WEBP o GIF.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('La imagen no debe superar 5MB.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreview = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(nextPreview);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Completa todos los campos obligatorios antes de publicar.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadReportImage(imageFile, (progressEvent) => {
        const total = progressEvent.total || 1;
        const percent = Math.round((progressEvent.loaded * 100) / total);
        setUploadProgress(percent);
      });

      const imageUrl = uploadResult?.imageUrl;
      if (!imageUrl) {
        throw new Error('No se obtuvo la URL de la imagen cargada.');
      }

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
        lat: Number(formData.lat),
        lon: Number(formData.lon),
      };

      await createReport(payload);
      navigate(PUBLIC_ROUTES.SEARCH);
    } catch (err) {
      setError(err?.message || err?.data?.message || 'No fue posible crear el reporte.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Crear reporte</CardTitle>
              <CardDescription>
                Completa los datos obligatorios del reporte y adjunta una imagen.
              </CardDescription>
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
                  <label className="block text-sm font-medium mb-2">Imagen *</label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <input
                      id="report-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="report-image" className="cursor-pointer block text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Selecciona una imagen'}
                      </p>
                    </label>
                  </div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Vista previa del reporte"
                      className="mt-3 w-full h-64 object-cover rounded-lg border"
                    />
                  )}
                  {isSubmitting && uploadProgress > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Subiendo imagen: {uploadProgress}%
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Especie *</label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      className="w-full h-9 px-3 rounded-md border bg-background"
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
                    <label className="block text-sm font-medium mb-1">Tipo *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full h-9 px-3 rounded-md border bg-background"
                      required
                    >
                      <option value="lost">Perdido</option>
                      <option value="found">Encontrado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full h-9 px-3 rounded-md border bg-background"
                      required
                    >
                      <option value="active">Activo</option>
                      <option value="resolved">Resuelto</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Color *</label>
                    <Input name="color" value={formData.color} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Raza *</label>
                    <Input name="breed" value={formData.breed} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tamano *</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full h-9 px-3 rounded-md border bg-background"
                      required
                    >
                      <option value="small">Pequeno</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripcion *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    minLength={10}
                    required
                    rows={4}
                    className="w-full min-h-[96px] px-3 py-2 rounded-md border bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contacto *</label>
                    <Input name="contact" value={formData.contact} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitud *</label>
                    <Input
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitud *</label>
                    <Input
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      name="lon"
                      value={formData.lon}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Publicando...
                      </span>
                    ) : (
                      'Publicar reporte'
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
