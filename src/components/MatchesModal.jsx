import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

const speciesLabel = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };
const typeLabel    = { lost: 'Perdido', found: 'Hallado' };

function MatchCard({ report }) {
  const imageUrl = useMediaUrl(report.imageUrl);
  const pct = Math.round(report.similarityScore * 100);

  const barColor = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-400';
  const badgeColor = pct >= 75
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : pct >= 50
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';

  return (
    <a
      href={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 rounded-xl border bg-card p-3 hover:shadow-md transition-shadow"
    >
      {/* Imagen */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {imageUrl
          ? <img src={imageUrl} alt="mascota" className="h-full w-full object-cover" />
          : <div className="h-full w-full bg-muted" />
        }
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">{speciesLabel[report.species] || report.species}</Badge>
            <Badge className="text-xs">{typeLabel[report.type] || report.type}</Badge>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeColor}`}>
            <Sparkles className="h-3 w-3" />
            {pct}%
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{report.description}</p>

        <div className="flex items-center justify-between mt-1">
          {report.distanceKm !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {report.distanceKm} km
            </span>
          )}
          <div className="ml-auto">
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

/**
 * Modal que muestra posibles coincidencias tras publicar un reporte.
 * @param {{ matches: Array, onClose: () => void, reportType: 'lost' | 'found' }} props
 */
export function MatchesModal({ matches, onClose, reportType }) {
  const navigate = useNavigate();

  if (!matches?.length) return null;

  const oppositeLabel = reportType === 'lost' ? 'halladas' : 'perdidas';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-background shadow-2xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <h2 className="text-base font-bold text-foreground">
                {matches.length === 1
                  ? '¡Encontramos una posible coincidencia!'
                  : `¡Encontramos ${matches.length} posibles coincidencias!`}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              La IA detectó mascotas {oppositeLabel} que podrían ser la misma. Revísalas antes de salir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de matches */}
        <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
          {matches.map((report) => (
            <MatchCard key={report.id} report={report} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5 pt-2 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Ignorar
          </Button>
          <Button
            className="flex-1 gap-1.5"
            onClick={() => { onClose(); navigate(PUBLIC_ROUTES.SEARCH); }}
          >
            Ver todos los reportes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
