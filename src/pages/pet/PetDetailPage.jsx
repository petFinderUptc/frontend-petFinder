import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Calendar, MapPin, Phone } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getReportById } from '../../services/reportService';
import { toAbsoluteMediaUrl } from '../../utils/userAdapter';

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

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getReportById(id);
        setReport(response || null);
      } catch (err) {
        if (err?.status === 404) {
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

  const imageUrl = useMemo(() => toAbsoluteMediaUrl(report?.imageUrl), [report?.imageUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando reporte...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{speciesLabel[report.species] || report.species}</Badge>
              <Badge>{typeLabel[report.type] || report.type}</Badge>
              <Badge variant="secondary">{report.status}</Badge>
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
                <p className="font-medium">{report.status}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripcion</p>
              <p className="leading-relaxed">{report.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Contacto</p>
                  <p className="font-medium">{report.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Coordenadas</p>
                  <p className="font-medium">{report.lat}, {report.lon}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Publicado</p>
                  <p className="font-medium">
                    {new Date(report.createdAt).toLocaleDateString('es-CO', {
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
    </div>
  );
}
