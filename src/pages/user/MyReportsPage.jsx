import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye, Pencil, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { deleteReport, getMyReports, updateReport } from '../../services/reportService';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../constants/routes';
import { toAbsoluteMediaUrl } from '../../utils/userAdapter';
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

const statusLabels = {
  active: 'Activo',
  resolved: 'Resuelto',
  inactive: 'Inactivo',
};

const statusVariant = {
  active: 'default',
  resolved: 'secondary',
  inactive: 'outline',
};

export default function MyReportsPage() {
  const { addAlert } = useAlert();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyReports();
      setReports(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err?.message || 'No fue posible cargar tus reportes.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const markAsResolved = async (report) => {
    try {
      setBusyId(report.id);
      await updateReport(report.id, {
        status: 'resolved',
      });
      addAlert({
        type: 'success',
        message: 'Reporte marcado como resuelto.',
      });
      await loadReports();
    } catch (err) {
      addAlert({
        type: 'error',
        message: err?.message || 'No fue posible actualizar el estado.',
      });
    } finally {
      setBusyId('');
    }
  };

  const removeReport = async (report) => {
    const confirmed = window.confirm('Se eliminara este reporte. Deseas continuar?');
    if (!confirmed) {
      return;
    }

    try {
      setBusyId(report.id);
      await deleteReport(report.id);
      addAlert({
        type: 'success',
        message: 'Reporte eliminado correctamente.',
      });
      await loadReports();
    } catch (err) {
      addAlert({
        type: 'error',
        message: err?.message || 'No fue posible eliminar el reporte.',
      });
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Mis Reportes</h1>
              <p className="mt-1 text-muted-foreground">Administra, edita, resuelve o elimina tus reportes.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadReports} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Actualizar
              </Button>
              <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <PlusCircle className="mr-2 h-4 w-4" /> Publicar reporte
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">Cargando reportes...</CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
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
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear primer reporte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => {
                const imageUrl = toAbsoluteMediaUrl(report.imageUrl);
                const isBusy = busyId === report.id;

                return (
                  <Card key={report.id} className="h-full overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Reporte" className="h-48 w-full object-cover" />
                    ) : (
                      <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="line-clamp-1 text-lg font-semibold">
                          {speciesLabels[report.species] || report.species || 'Mascota'}
                        </h2>
                        <div className="flex gap-1">
                          <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
                            {typeLabels[report.type] || report.type}
                          </Badge>
                          <Badge variant={statusVariant[report.status] || 'outline'}>
                            {statusLabels[report.status] || report.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {report.description || 'Sin descripcion'}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        <p>
                          Raza: <span className="font-medium">{report.breed || 'No especificada'}</span>
                        </p>
                        <p>
                          Publicado:{' '}
                          <span className="font-medium">
                            {new Date(report.createdAt || Date.now()).toLocaleDateString('es-ES')}
                          </span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="mr-2 h-4 w-4" /> Ver
                          </Button>
                        </Link>
                        <Link to={PROTECTED_ROUTES.EDIT_REPORT.replace(':id', report.id)}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isBusy || report.status === 'resolved'}
                          onClick={() => markAsResolved(report)}
                          className="w-full"
                        >
                          {isBusy ? 'Procesando...' : 'Marcar resuelto'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isBusy}
                          onClick={() => removeReport(report)}
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                      </div>
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
