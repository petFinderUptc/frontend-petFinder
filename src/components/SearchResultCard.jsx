import { Link } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

/**
 * Devuelve el color del badge de similitud según el score.
 * score es un valor entre 0 y 1.
 */
function getSimilarityVariant(score) {
  if (score >= 0.75) return { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (score >= 0.50) return { bg: 'bg-blue-100 text-blue-700 border-blue-200' };
  if (score >= 0.30) return { bg: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { bg: 'bg-gray-100 text-gray-600 border-gray-200' };
}

export const SearchResultCard = memo(function SearchResultCard({ report, speciesLabel, typeLabel, showSimilarity = false }) {
  const imageUrl = useMediaUrl(report.imageUrl);

  const hasSimilarity = showSimilarity && report.similarityScore !== undefined;
  const similarityPct = useMemo(
    () => (hasSimilarity ? Math.round(report.similarityScore * 100) : null),
    [hasSimilarity, report.similarityScore],
  );
  const similarityStyle = useMemo(
    () => (hasSimilarity ? getSimilarityVariant(report.similarityScore) : null),
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

          {/* Badge de similitud IA sobre la imagen */}
          {hasSimilarity && similarityPct > 0 && (
            <div
              className={`absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${similarityStyle.bg}`}
            >
              <Sparkles className="h-3 w-3" />
              {similarityPct}% similitud
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{speciesLabel[report.species] || report.species}</Badge>
            <Badge>{typeLabel[report.type] || report.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          <p className="text-xs text-muted-foreground">
            Estado: <span className="font-medium">{report.status}</span>
          </p>
          {hasSimilarity && report.distanceKm !== undefined && (
            <p className="text-xs text-muted-foreground">
              Distancia: <span className="font-medium">{report.distanceKm} km</span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});
