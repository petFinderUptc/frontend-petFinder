import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Search, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROTECTED_ROUTES, PUBLIC_ROUTES, generateRoute } from '../../constants/routes';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getMyReports, deleteReport } from '../../services/reportService';
import { adaptPost } from '../../utils/postAdapter';
import { useMediaUrl } from '../../hooks/useSignedUrl';

const SPECIES_LABEL = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  other: 'Otro',
};

// ─── Miniatura con signed URL renovada automáticamente ────────────────────────
function ReportThumbnail({ url, alt }) {
  const src = useMediaUrl(url);
  const [err, setErr] = useState(false);

  if (!src || err) {
    return (
      <div className="w-16 h-16 shrink-0 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
        Sin foto
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-16 shrink-0 rounded-lg object-cover"
      onError={() => setErr(true)}
    />
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setMyReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      setError('Error al cargar tus reportes');
      setMyReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const handleEdit = (e, reportId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(generateRoute(PROTECTED_ROUTES.EDIT_REPORT, { id: reportId }));
  };

  const handleDelete = async (e, reportId, petName) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el reporte de "${petName}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeletingId(reportId);
    try {
      await deleteReport(reportId);
      setMyReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error('Error al eliminar reporte:', err);
      alert('No se pudo eliminar el reporte. Inténtalo de nuevo.');
    } finally {
      setDeletingId(null);
    }
  };

  const adaptedReports = myReports.map(adaptPost);

  const stats = {
    total: adaptedReports.length,
    active: adaptedReports.filter((r) => r.status === 'active').length,
    resolved: adaptedReports.filter((r) => r.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-black py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Hola, {user?.firstName || user?.username || 'Usuario'} 👋
            </h1>
            <p className="text-gray-700 dark:text-slate-300">
              Gestiona tus reportes y ayuda a reunir mascotas con sus familias
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Reportes</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reportes Activos</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.active}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Search className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Resueltos</p>
                    <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT} className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                    <PlusCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Publicar Nuevo Reporte</h3>
                    <p className="text-muted-foreground text-sm">
                      ¿Perdiste o encontraste una mascota? Crea un reporte ahora
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <Link to={PUBLIC_ROUTES.SEARCH} className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Buscar Mascotas</h3>
                    <p className="text-muted-foreground text-sm">
                      Explora reportes de mascotas perdidas o encontradas
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* My Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Reportes</CardTitle>
              <CardDescription>
                Haz clic en un reporte para verlo en detalle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Cargando reportes...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600">{error}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchMyReports}>
                    Reintentar
                  </Button>
                </div>
              ) : adaptedReports.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No tienes reportes aún
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Crea tu primer reporte para ayudar a reunir mascotas
                  </p>
                  <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Crear Reporte
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {adaptedReports.map((report) => {
                    const typeLabel = report.type === 'lost' ? 'Perdido' : 'Encontrado';
                    const speciesLabel = SPECIES_LABEL[report.species] || report.species || 'Mascota';
                    const isDeleting = deletingId === report.id;
                    const detailUrl = PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id);

                    return (
                      <div
                        key={report.id}
                        className="relative flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group"
                      >
                        {/* Overlay — cubre todo el card excepto los botones */}
                        <Link
                          to={detailUrl}
                          className="absolute inset-0 z-0 rounded-lg"
                          aria-label={`Ver detalle de ${report.petName}`}
                        />

                        {/* Contenido del card */}
                        <div className="relative z-10 flex items-center gap-4 min-w-0">
                          <ReportThumbnail url={report.imageUrl} alt={report.petName} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold truncate">{report.petName}</h4>
                              <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
                                {typeLabel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {speciesLabel} •{' '}
                              {new Date(report.eventDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                            {report.location && (
                              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                                {report.location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="relative z-10 flex gap-2 shrink-0 ml-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleEdit(e, report.id)}
                            title="Editar reporte"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={(e) => handleDelete(e, report.id, report.petName)}
                            disabled={isDeleting}
                            title="Eliminar reporte"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
