import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function FilterPanel({ filters, onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({
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
  };
  
  const activeFiltersCount = [
    filters.status !== 'all',
    filters.type !== 'all',
    filters.size !== 'all',
    filters.location !== '',
    filters.searchTerm !== '',
    filters.breed !== '',
    filters.color !== '',
    filters.urgentOnly,
    filters.dateFrom !== '',
    filters.dateTo !== '',
  ].filter(Boolean).length;
  
  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, raza, descripción..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todos</option>
                <option value="lost">Perdidos</option>
                <option value="found">Encontrados</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todos</option>
                <option value="dog">Perros</option>
                <option value="cat">Gatos</option>
                <option value="other">Otros</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tamaño</label>
              <select
                value={filters.size}
                onChange={(e) => updateFilter('size', e.target.value)}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todos</option>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Ubicación</label>
              <Input
                placeholder="Ciudad, barrio..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Raza</label>
              <Input
                placeholder="Raza..."
                value={filters.breed}
                onChange={(e) => updateFilter('breed', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <Input
                placeholder="Color..."
                value={filters.color}
                onChange={(e) => updateFilter('color', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha desde</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha hasta</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <input
              type="checkbox"
              id="urgent-filter"
              checked={filters.urgentOnly}
              onChange={(e) => updateFilter('urgentOnly', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label
              htmlFor="urgent-filter"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Mostrar solo reportes urgentes
            </label>
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-gray-600"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
