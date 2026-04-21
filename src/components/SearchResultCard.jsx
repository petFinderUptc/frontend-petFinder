import { Link } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

function getSimilarityConfig(score) {
  if (score >= 0.75) return {
    label: 'Alta coincidencia',
    barColor: '#004c22',
    bg: '#e6efe9',
    text: '#004c22',
  };
  if (score >= 0.50) return {
    label: 'Buena coincidencia',
    barColor: '#166534',
    bg: '#dcfce7',
    text: '#166534',
  };
  if (score >= 0.30) return {
    label: 'Coincidencia parcial',
    barColor: '#d97706',
    bg: '#fef3c7',
    text: '#92400e',
  };
  return {
    label: 'Poca coincidencia',
    barColor: '#9ca3af',
    bg: '#f3f4f6',
    text: '#6b7280',
  };
}

const SPECIES_LABEL = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };
const TYPE_LABEL    = { lost: 'Perdido', found: 'Encontrado' };
const STATUS_LABEL  = { active: 'Activo', resolved: 'Resuelto', inactive: 'Inactivo' };
const SIZE_LABEL    = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
const TYPE_STYLE    = {
  lost:  { bg: '#fef2f2', text: '#c0392b' },
  found: { bg: '#e6efe9', text: '#004c22' },
};

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

  const typeStyle = TYPE_STYLE[report.type] ?? TYPE_STYLE.found;

  return (
    <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
      <article
        className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        style={{
          background: '#ffffff',
          boxShadow: '0 4px 24px rgba(0, 76, 34, 0.08)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 76, 34, 0.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 76, 34, 0.08)'; }}
      >
        {/* Image */}
        <div className="relative flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Reporte ${report.id}`}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-sm" style={{ background: '#f4f4f0', color: '#555f70' }}>
              Sin imagen
            </div>
          )}

          {/* Type badge */}
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: typeStyle.bg, color: typeStyle.text }}
          >
            {typeLabel?.[report.type] ?? TYPE_LABEL[report.type] ?? report.type}
          </span>

          {/* Similarity badge */}
          {hasSimilarity && (
            <div
              className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm"
              style={{ background: simConfig.bg, color: simConfig.text }}
            >
              <Sparkles className="h-3 w-3" />
              {similarityPct}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
              style={{ background: '#f4f4f0', color: '#555f70' }}
            >
              {speciesLabel?.[report.species] ?? SPECIES_LABEL[report.species] ?? report.species}
            </span>
          </div>

          {/* Similarity bar */}
          {hasSimilarity && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1 font-semibold" style={{ color: simConfig.text }}>
                  <Sparkles className="h-3 w-3" />
                  {simConfig.label}
                </span>
                <span className="text-xs font-bold tabular-nums" style={{ color: simConfig.text }}>{similarityPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#f4f4f0' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${similarityPct}%`, background: simConfig.barColor }}
                />
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: '#555f70' }}>
            {report.description}
          </p>

          <div className="text-xs pt-2 flex flex-wrap gap-x-3 gap-y-1" style={{ borderTop: '1px solid rgba(27,28,26,0.07)', color: '#555f70' }}>
            <span>Estado: <span className="font-semibold" style={{ color: '#1b1c1a' }}>{STATUS_LABEL[report.status] ?? report.status}</span></span>
            {report.size && (
              <span>Tamaño: <span className="font-semibold" style={{ color: '#1b1c1a' }}>{SIZE_LABEL[report.size] ?? report.size}</span></span>
            )}
            {hasSimilarity && report.distanceKm !== undefined && (
              <span>A <span className="font-semibold" style={{ color: '#1b1c1a' }}>{report.distanceKm} km</span></span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});
