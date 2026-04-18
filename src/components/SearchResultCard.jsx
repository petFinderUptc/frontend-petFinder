import { Link } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

// ─── Configuración visual por nivel de similitud ──────────────────────────────
function getSimilarityConfig(score) {
  if (score >= 0.75) return {
    label: 'Alta coincidencia',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  if (score >= 0.50) return {
    label: 'Buena coincidencia',
    bar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  if (score >= 0.30) return {
    label: 'Coincidencia parcial',
    bar: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return {
    label: 'Poca coincidencia',
    bar: 'bg-gray-300',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
  };
}

export const SearchResultCard = memo(function SearchResultCard({ report, speciesLabel, typeLabel, showSimilarity = false }) {
  const imageUrl = useMediaUrl(report.imageUrl);

  const hasSimilarity = showSimilarity && report.similarityScore !== undefined && report.similarityScore > 0;

  const similarityPct = useMemo(
    () => (hasSimilarity ? Math.round(report.similarityScore * 100) : null),
    [hasSimilarity, report.similarityScore],
  );

  const simConfig = useMemo(
    () => (hasSimilarity ? getSimilarityConfig(report.similarityScore) : null),
    [hasSimilarity, report.similarityScore],
  );

  return (
    <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Reporte ${report.id}`}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}

          {/* Badge de similitud IA flotante sobre la imagen */}
          {hasSimilarity && (
            <div
              className={`absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border shadow-sm ${simConfig.badge}`}
            >
              <Sparkles className="h-3 w-3" />
              {similarityPct}%
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{speciesLabel[report.species] || report.species}</Badge>
            <Badge>{typeLabel[report.type] || report.type}</Badge>
          </div>

          {/* Barra de similitud con label */}
          {hasSimilarity && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {simConfig.label}
                </span>
                <span className="text-xs font-semibold tabular-nums">{similarityPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${simConfig.bar}`}
                  style={{ width: `${similarityPct}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          <p className="text-xs text-muted-foreground">
            Estado: <span className="font-medium">{report.status}</span>
          </p>
          {hasSimilarity && report.distanceKm !== undefined && (
            <p className="text-xs text-muted-foreground">
              A <span className="font-medium">{report.distanceKm} km</span> de tu búsqueda
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
