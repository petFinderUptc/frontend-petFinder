import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { FilterPanel } from '../../components/FilterPanel';
import { PUBLIC_ROUTES } from '../../constants/routes';
import { getReports } from '../../services/reportService';
import { useMediaUrl } from '../../hooks/useSignedUrl';
import { SearchResultCard } from '../../components/SearchResultCard';

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

  const fetchReports = async (targetPage = 1, activeFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      // Construir parámetros de query basados en filtros
      const queryParams = {
        page: targetPage,
        limit: PAGE_SIZE,
      };

      if (activeFilters.status !== 'all') {
        queryParams.type = activeFilters.status; // Backend espera 'type' para lost/found
      }
      if (activeFilters.type !== 'all') {
        queryParams.species = activeFilters.type; // Backend espera 'species' para dog/cat/etc
      }
      if (activeFilters.size !== 'all') {
        queryParams.size = activeFilters.size;
      }
      if (activeFilters.breed) {
        queryParams.breed = activeFilters.breed;
      }
      if (activeFilters.color) {
        queryParams.color = activeFilters.color;
      }
      if (activeFilters.searchTerm) {
        queryParams.search = activeFilters.searchTerm;
      }

      const response = await getReports(queryParams);
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
  };

  useEffect(() => {
    void fetchReports(1, filters);
  }, []);

  const title = useMemo(() => {
    if (loading) return 'Cargando reportes...';
    if (!reports.length) return 'No hay reportes disponibles';
    return `Reportes activos (${pagination.total})`;
  }, [loading, reports.length, pagination.total]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    void fetchReports(1, newFilters);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Listado de reportes</h1>
          <p className="text-muted-foreground">{title}</p>
        </div>

        <div className="mb-6">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Cargando...</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => {
                return (
                  <SearchResultCard
                    key={report.id}
                    report={report}
                    speciesLabel={speciesLabel}
                    typeLabel={typeLabel}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => void fetchReports(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => void fetchReports(pagination.page + 1)}
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
