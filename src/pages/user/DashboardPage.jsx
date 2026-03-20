import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PlusCircle, Search, Heart, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getMyReports } from '../../services/petService';
import { adaptPost } from '../../utils/postAdapter';

export default function DashboardPage() {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyReports = async () => {
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
    };

    fetchMyReports();
  }, []);

  const stats = {
    activeReports: myReports.filter(r => r.status === 'active').length,
    totalViews: myReports.reduce((sum, r) => sum + (r.views || 0), 0),
    savedSearches: 0, // TODO: Implementar saved searches
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-black py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Hola, {user?.username || 'Usuario'} 👋
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
                    <p className="text-sm text-muted-foreground mb-1">Reportes Activos</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeReports}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Visitas</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalViews}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Búsquedas Guardadas</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.savedSearches}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Heart className="h-8 w-8 text-purple-600" />
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
                Gestiona y actualiza el estado de tus reportes activos
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
                </div>
              ) : myReports.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No tienes reportes activos
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
                <div className="space-y-4">
                  {myReports.map(rawReport => {
                    const report = adaptPost(rawReport);
                    const statusLabel = report.type === 'lost' ? 'Perdido' : 'Encontrado';
                    
                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg"></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{report.petName}</h4>
                              <Badge variant={report.type === 'lost' ? 'destructive' : 'success'}>
                                {statusLabel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.species} • Publicado el {new Date(report.eventDate).toLocaleDateString('es-ES')}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Eye className="h-3 w-3" />
                              {report.views} visitas
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
