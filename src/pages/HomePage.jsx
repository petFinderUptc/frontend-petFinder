import { Link } from 'react-router-dom';
import { Search, PlusCircle, Heart, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import PetCard from '../components/PetCard';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';
import { mockPets } from '../data/mockPets';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const recentPets = mockPets.slice(0, 3);
  const lostPetsCount = mockPets.filter(p => p.status === 'lost').length;
  const foundPetsCount = mockPets.filter(p => p.status === 'found').length;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-800">
              🐾 Plataforma de Reencuentro de Mascotas
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Ayudamos a reunir familias con sus mascotas
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Busca, publica y encuentra mascotas perdidas en Tunja y alrededores. 
              Una comunidad unida para ayudar a nuestros mejores amigos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={PUBLIC_ROUTES.SEARCH}>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2 w-full sm:w-auto shadow-lg">
                  <Search className="h-5 w-5" />
                  Buscar Mascotas
                </Button>
              </Link>
              <Link to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}>
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                  <PlusCircle className="h-5 w-5" />
                  Publicar Reporte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-3 bg-red-100 rounded-full mb-3">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">{lostPetsCount}</div>
                <div className="text-sm text-gray-600">Mascotas Perdidas</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">{foundPetsCount}</div>
                <div className="text-sm text-gray-600">Mascotas Encontradas</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{mockPets.length}</div>
                <div className="text-sm text-gray-600">Reportes Activos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Recent Reports */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3">Reportes Recientes</h2>
            <p className="text-gray-600">Las mascotas reportadas más recientemente en nuestra plataforma</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to={PUBLIC_ROUTES.SEARCH}>
              <Button size="lg" variant="outline" className="gap-2">
                Ver Todos los Reportes
                <Search className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3">¿Cómo Funciona?</h2>
            <p className="text-gray-600">Tres simples pasos para ayudar a reunir mascotas con sus familias</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
                <PlusCircle className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Publica un Reporte</h3>
              <p className="text-gray-600">
                Crea un reporte con foto, descripción y ubicación de la mascota perdida o encontrada.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-6 bg-cyan-100 rounded-full mb-4">
                <Search className="h-12 w-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Busca y Comparte</h3>
              <p className="text-gray-600">
                Explora los reportes activos y comparte aquellos que puedan ayudar a otros.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-6 bg-green-100 rounded-full mb-4">
                <Heart className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. ¡Reencuéntrate!</h3>
              <p className="text-gray-600">
                Contacta directamente con quien reportó y ayuda a reunir a la mascota con su familia.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-400 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Has perdido o encontrado una mascota?</h2>
          <p className="text-xl mb-8 opacity-90">No esperes más. Cada minuto cuenta.</p>
          <Link to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}>
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
              <PlusCircle className="h-5 w-5" />
              Publicar Reporte Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
