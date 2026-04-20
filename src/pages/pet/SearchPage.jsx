import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, MapPinned, Rows3, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FilterPanel } from '../../components/FilterPanel';
import { getReports, searchReports } from '../../services/reportService';
import { SearchResultCard } from '../../components/SearchResultCard';
import { PetMap } from '../../components/PetMap';

// ─── Skeleton de SearchResultCard ─────────────────────────────────────────────
function SearchResultCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="w-full h-48 animate-pulse" style={{ background: '#f4f4f0' }} />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-16 rounded-lg animate-pulse" style={{ background: '#f4f4f0' }} />
          <div className="h-5 w-20 rounded-lg animate-pulse" style={{ background: '#f4f4f0' }} />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded animate-pulse" style={{ background: '#f4f4f0' }} />
          <div className="h-3 w-4/5 rounded animate-pulse" style={{ background: '#f4f4f0' }} />
        </div>
        <div className="h-3 w-1/3 rounded animate-pulse" style={{ background: '#f4f4f0' }} />
      </CardContent>
    </Card>
  );
}

const PAGE_SIZE = 9;

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

export default function SearchPage() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    reportType: 'all',
    species: 'all',
    size: 'all',
    color: '',
    breed: '',
    searchTerm: '',
  });
  const [viewMode, setViewMode] = useState('cards');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);

  // Coordenadas del usuario para el filtro geográfico
  const userCoords = useRef(null);

  // Obtener ubicación del usuario al montar (silencioso si deniega)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords.current = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lon: parseFloat(pos.coords.longitude.toFixed(6)),
        };
      },
      () => {
        // El usuario denegó o no hay GPS — funciona sin geo
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const fetchReports = useCallback(async (targetPage = 1, activeFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const queryParams = { page: targetPage, limit: PAGE_SIZE };

      if (activeFilters.reportType !== 'all') queryParams.type = activeFilters.reportType;
      if (activeFilters.species !== 'all') queryParams.species = activeFilters.species;
      if (activeFilters.size !== 'all') queryParams.size = activeFilters.size;
      if (activeFilters.color?.trim()) queryParams.color = activeFilters.color.trim();
      if (activeFilters.breed?.trim()) queryParams.breed = activeFilters.breed.trim();

      const searchTerm = activeFilters.searchTerm?.trim() || '';
      let response;

      if (searchTerm.length >= 2) {
        // Añadir coords del usuario si están disponibles
        if (userCoords.current) {
          queryParams.lat = userCoords.current.lat;
          queryParams.lon = userCoords.current.lon;
          queryParams.radiusKm = 15;
        }
        response = await searchReports(searchTerm, queryParams);
        setIsSemanticSearch(response?.isSemanticSearch === true);
      } else {
        response = await getReports(queryParams);
        setIsSemanticSearch(false);
      }

      setReports(Array.isArray(response?.data) ? response.data : []);
      setPagination(
        response?.pagination || {
          page: targetPage,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      );
    } catch (err) {
      setError(err?.message || 'No fue posible cargar los reportes.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchReports(1, filters);
  }, [fetchReports]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchReports(pagination.page, filters);
      }
    }, 45000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchReports, filters, pagination.page]);

  const title = useMemo(() => {
    if (loading) return 'Cargando reportes...';
    if (!reports.length) return 'No hay reportes disponibles';
    return `Reportes activos (${pagination.total})`;
  }, [loading, reports.length, pagination.total]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleSearch = (nextFilters = filters) => {
    setFilters(nextFilters);
    void fetchReports(1, nextFilters);
  };

  return (
    <div className="min-h-screen py-8" style={{ background: '#faf9f5' }}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-2"
            style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Reportes activos
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ color: '#555f70' }}>{title}</p>
            {isSemanticSearch && (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: '#e6efe9', color: '#004c22' }}
              >
                <Sparkles className="h-3 w-3" />
                Búsqueda IA activa
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        <div className="mb-6 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="gap-2"
          >
            <Rows3 className="h-4 w-4" />
            Lista
          </Button>
          <Button
            type="button"
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="gap-2"
          >
            <MapPinned className="h-4 w-4" />
            Mapa
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SearchResultCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => void fetchReports(pagination.page)}>Reintentar</Button>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No hay reportes para mostrar en esta pagina.
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'map' ? (
              <PetMap reports={reports} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <SearchResultCard
                    key={report.id}
                    report={report}
                    speciesLabel={speciesLabel}
                    typeLabel={typeLabel}
                    showSimilarity={isSemanticSearch}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => void fetchReports(pagination.page - 1, filters)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => void fetchReports(pagination.page + 1, filters)}
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
