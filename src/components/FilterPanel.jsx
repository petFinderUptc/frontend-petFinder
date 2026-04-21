import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const EMPTY_FILTERS = {
  reportType: 'all',
  species: 'all',
  size: 'all',
  color: '',
  breed: '',
  searchTerm: '',
};

export function FilterPanel({ filters, onFilterChange, onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const triggerSearch = () => {
    if (typeof onSearch === 'function') {
      onSearch({ ...filters });
    }
  };

  const onSearchInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerSearch();
    }
  };

  const clearFilters = () => {
    onFilterChange(EMPTY_FILTERS);
    if (typeof onSearch === 'function') {
      onSearch(EMPTY_FILTERS);
    }
  };

  const activeFiltersCount = [
    filters.reportType !== 'all',
    filters.species !== 'all',
    filters.size !== 'all',
    !!filters.color,
    !!filters.breed,
    !!filters.searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por especie, raza o descripción..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            onKeyDown={onSearchInputKeyDown}
            className="pl-10"
          />
        </div>

        <Button size="sm" onClick={triggerSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>

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
          {/* Fila 1: Tipo, Especie, Tamaño */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select
                value={filters.reportType}
                onChange={(e) => updateFilter('reportType', e.target.value)}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todos</option>
                <option value="lost">Perdidos</option>
                <option value="found">Encontrados</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Especie</label>
              <select
                value={filters.species}
                onChange={(e) => updateFilter('species', e.target.value)}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">Todas</option>
                <option value="dog">Perros</option>
                <option value="cat">Gatos</option>
                <option value="bird">Aves</option>
                <option value="rabbit">Conejos</option>
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
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Color, Raza */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <Input
                placeholder="ej: negro, blanco y café"
                value={filters.color}
                onChange={(e) => updateFilter('color', e.target.value)}
                onKeyDown={onSearchInputKeyDown}
                maxLength={50}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Raza</label>
              <Input
                placeholder="ej: labrador, mestizo"
                value={filters.breed}
                onChange={(e) => updateFilter('breed', e.target.value)}
                onKeyDown={onSearchInputKeyDown}
                maxLength={60}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={triggerSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Aplicar filtros
            </Button>

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
        </div>
      )}
    </div>
  );
}
