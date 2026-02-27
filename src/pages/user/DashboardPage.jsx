import { Link } from 'react-router-dom';
import { PlusCircle, Search, Heart, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data
  const myReports = [
    {
      id: 1,
      name: 'Max',
      type: 'Perro',
      status: 'lost',
      date: '2024-01-15',
      views: 45
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Gato',
      status: 'found',
      date: '2024-01-10',
      views: 32
    }
  ];

  const stats = {
    activeReports: 2,
    totalViews: 77,
    savedSearches: 5
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hola, {user?.username || 'Usuario'} 👋
            </h1>
            <p className="text-gray-600">
              Gestiona tus reportes y ayuda a reunir mascotas con sus familias
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reportes Activos</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeReports}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Visitas</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalViews}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Búsquedas Guardadas</p>
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
                    <p className="text-gray-600 text-sm">
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
                    <p className="text-gray-600 text-sm">
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
              {myReports.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tienes reportes activos
                  </h3>
                  <p className="text-gray-600 mb-6">
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
                  {myReports.map(report => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{report.name}</h4>
                            <Badge variant={report.status === 'lost' ? 'destructive' : 'success'}>
                              {report.status === 'lost' ? 'Perdido' : 'Encontrado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{report.type} • Publicado el {report.date}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
