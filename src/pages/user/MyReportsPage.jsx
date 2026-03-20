import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye, PlusCircle } from 'lucide-react';
import { getMyReports } from '../../services/petService';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../constants/routes';
import { toAbsoluteMediaUrl } from '../../utils/userAdapter';
import { adaptPosts } from '../../utils/postAdapter';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const typeLabels = {
  lost: 'Perdido',
  found: 'Encontrado',
};

const speciesLabels = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  other: 'Otro',
};

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyReports();
        const rawReports = Array.isArray(response) ? response : response?.data;
        setReports(adaptPosts(rawReports));
      } catch (err) {
        setError(err?.message || 'No fue posible cargar tus reportes.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Mis Reportes</h1>
              <p className="text-muted-foreground mt-1">Administra tus reportes publicados</p>
            </div>
            <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Publicar reporte
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">Cargando reportes...</CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          ) : reports.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No tienes reportes publicados</CardTitle>
                <CardDescription>Publica tu primer reporte para empezar a recibir ayuda de la comunidad.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear primer reporte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => {
                const imageUrl = toAbsoluteMediaUrl(report.imageUrl);
                return (
                  <Card key={report.id} className="overflow-hidden h-full">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={report.petName || 'Reporte'}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg line-clamp-1">{report.petName || 'Sin nombre'}</h2>
                        <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
                          {typeLabels[report.type] || report.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.description || 'Sin descripción'}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        <p>Especie: <span className="font-medium">{speciesLabels[report.species] || report.species || 'N/A'}</span></p>
                        <p>Fecha: <span className="font-medium">{new Date(report.eventDate).toLocaleDateString('es-ES')}</span></p>
                      </div>

                      <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalle
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
