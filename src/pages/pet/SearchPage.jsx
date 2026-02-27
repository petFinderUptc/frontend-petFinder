import { useState } from 'react';
import PetCard from '../../components/PetCard';
import { PetMap } from '../../components/PetMap';
import { FilterPanel } from '../../components/FilterPanel';
import { mockPets } from '../../data/mockPets';
import { Card, CardContent } from '../../components/ui/card';
import { AlertCircle, Map, List } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    size: 'all',
    location: '',
    searchTerm: '',
    breed: '',
    color: '',
    urgentOnly: false,
    dateFrom: '',
    dateTo: '',
  });
  
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredPets = mockPets.filter((pet) => {
    if (filters.status !== 'all' && pet.status !== filters.status) return false;
    if (filters.type !== 'all' && pet.type !== filters.type) return false;
    if (filters.size !== 'all' && pet.size !== filters.size) return false;
    
    if (filters.location && !pet.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        pet.name?.toLowerCase().includes(searchLower) ||
        pet.breed?.toLowerCase().includes(searchLower) ||
        pet.description.toLowerCase().includes(searchLower) ||
        pet.color.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    if (filters.breed) {
      const breedLower = filters.breed.toLowerCase();
      const matchesBreed = 
        pet.breed?.toLowerCase().includes(breedLower);
      
      if (!matchesBreed) return false;
    }
    
    if (filters.color) {
      const colorLower = filters.color.toLowerCase();
      const matchesColor = 
        pet.color.toLowerCase().includes(colorLower);
      
      if (!matchesColor) return false;
    }
    
    if (filters.urgentOnly && !pet.isUrgent) return false;
    
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      const petDate = new Date(pet.date);
      if (petDate < dateFrom) return false;
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      const petDate = new Date(pet.date);
      if (petDate > dateTo) return false;
    }
    
    return true;
  });
  
  const lostPets = filteredPets.filter(p => p.status === 'lost');
  const foundPets = filteredPets.filter(p => p.status === 'found');
  
  const getPetsForTab = () => {
    switch (activeTab) {
      case 'lost': return lostPets;
      case 'found': return foundPets;
      default: return filteredPets;
    }
  };
  
  const displayPets = getPetsForTab();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Buscar Mascotas</h1>
          <p className="text-gray-600">
            Explora todos los reportes activos en Tunja y alrededores con búsqueda inteligente
          </p>
        </div>
        
        <div className="mb-6">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Todos los Reportes</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              Mapa
            </Button>
          </div>
        </div>
        
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="mb-8">
            {filteredPets.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <PetMap pets={filteredPets} />
                  </div>
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-600">
                      Mostrando <span className="font-semibold">{filteredPets.length}</span> mascota{filteredPets.length !== 1 ? 's' : ''} en el mapa. 
                      Haz clic en los marcadores para ver más información.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-16 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* List View with Tabs */}
        {viewMode === 'list' && (
          <div className="w-full">
            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Todos ({filteredPets.length})
              </button>
              <button
                onClick={() => setActiveTab('lost')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'lost'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Perdidos ({lostPets.length})
              </button>
              <button
                onClick={() => setActiveTab('found')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'found'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Encontrados ({foundPets.length})
              </button>
            </div>
            
            {/* Tab Content */}
            {displayPets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600">
                  {activeTab === 'lost' && 'No se encontraron mascotas perdidas con estos criterios'}
                  {activeTab === 'found' && 'No se encontraron mascotas encontradas con estos criterios'}
                  {activeTab === 'all' && 'Intenta ajustar tus filtros de búsqueda'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
