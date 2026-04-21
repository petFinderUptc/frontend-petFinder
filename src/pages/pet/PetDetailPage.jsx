import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Calendar, MapPin, Phone, Sparkles } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getReportById, getReportSummary } from '../../services/reportService';
import { getPetById } from '../../services/petService';
import { reverseGeocode } from '../../services/locationService';
import { adaptPost } from '../../utils/postAdapter';
import { useMediaUrl } from '../../hooks/useSignedUrl';

const typeLabel = {
  lost: 'Perdido',
  found: 'Encontrado',
};

const speciesLabel = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  other: 'Otro',
};

const statusLabel = {
  active: 'Activo',
  resolved: 'Resuelto',
  inactive: 'Inactivo',
};

const statusVariant = {
  active: 'default',
  resolved: 'secondary',
  inactive: 'outline',
};
export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [aiSummary, setAiSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError('');
        let response;

        if (id?.startsWith('post_')) {
          response = await getPetById(id);
        } else {
          try {
            response = await getReportById(id);
          } catch (err) {
            const statusCode = err?.status || err?.response?.status;
            if (statusCode === 404) {
              response = await getPetById(id);
            } else {
              throw err;
            }
          }
        }

        const normalizedReport = adaptPost(response);
        setReport(normalizedReport || null);

        const lat = Number(normalizedReport?.latitude);
        const lon = Number(normalizedReport?.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          try {
            const reverse = await reverseGeocode(lat, lon);
            setLocationLabel(reverse?.displayName || 'Ubicacion aproximada');
          } catch {
            setLocationLabel('Ubicacion aproximada');
          }
        }

        // Cargar resumen IA en paralelo (no bloquea el render)
        if (!id?.startsWith('post_') && normalizedReport?.id) {
          setSummaryLoading(true);
          getReportSummary(normalizedReport.id)
            .then(({ summary }) => setAiSummary(summary || null))
            .catch(() => {})
            .finally(() => setSummaryLoading(false));
        }
      } catch (err) {
        const statusCode = err?.status || err?.response?.status;
        if (statusCode === 404) {
          setError('El reporte no existe o ya no esta disponible.');
        } else {
          setError(err?.message || 'No fue posible cargar el reporte.');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDetail();
  }, [id]);

  const imageUrl = useMediaUrl(report?.imageUrl);
  const latitude = report?.latitude;
  const longitude = report?.longitude;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf9f5' }}>
        <p className="text-muted-foreground">Cargando reporte...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#faf9f5' }}>
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-foreground mb-4">{error || 'Reporte no encontrado.'}</p>
            <Button onClick={() => navigate(-1)}>Volver</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen py-8"
      style={{ background: '#faf9f5' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{speciesLabel[report.species] || report.species}</Badge>
              <Badge>{typeLabel[report.type] || report.type}</Badge>
              <Badge variant={statusVariant[report.status] || 'outline'}>
                {statusLabel[report.status] || report.status}
              </Badge>
            </div>
            <CardTitle className="text-2xl">Detalle del reporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {imageUrl ? (
              <img src={imageUrl} alt={`Reporte ${report.id}`} className="w-full h-96 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-96 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                Sin imagen disponible
              </div>
            )}

            {/* Resumen IA */}
            {(summaryLoading || aiSummary) && (
              <div className="rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30 px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-4 w-4 text-violet-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    Resumen generado por IA
                  </span>
                </div>
                {summaryLoading ? (
                  <div className="space-y-1.5 mt-1">
                    <div className="h-3 rounded bg-violet-200 dark:bg-violet-800 animate-pulse w-full" />
                    <div className="h-3 rounded bg-violet-200 dark:bg-violet-800 animate-pulse w-4/5" />
                    <div className="h-3 rounded bg-violet-200 dark:bg-violet-800 animate-pulse w-3/5" />
                  </div>
                ) : (
                  <p className="text-sm text-violet-900 dark:text-violet-200 leading-relaxed">{aiSummary}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Especie</p>
                <p className="font-medium">{speciesLabel[report.species] || report.species}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{typeLabel[report.type] || report.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Raza</p>
                <p className="font-medium">{report.breed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{report.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tamano</p>
                <p className="font-medium">{report.size}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-medium">{statusLabel[report.status] || report.status}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripcion</p>
              <p className="leading-relaxed">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#004c22]" />
                <div>
                  <p className="text-xs text-muted-foreground">Contacto</p>
                  <p className="font-medium">{report.contactPhone || report.contact || 'No disponible'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#004c22]" />
                <div>
                  <p className="text-xs text-muted-foreground">Ubicacion</p>
                  <p className="font-medium">{locationLabel || `${latitude ?? 'N/A'}, ${longitude ?? 'N/A'}`}</p>
                  <p className="text-xs text-muted-foreground">{latitude ?? 'N/A'}, {longitude ?? 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#004c22]" />
                <div>
                  <p className="text-xs text-muted-foreground">Publicado</p>
                  <p className="font-medium">
                    {new Date(report.createdAt || report.eventDate || Date.now()).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-xs text-muted-foreground">
              ID: {report.id}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
