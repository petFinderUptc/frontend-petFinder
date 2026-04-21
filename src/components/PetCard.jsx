import { Link } from 'react-router-dom';
import { memo, useState, useMemo } from 'react';
import { Calendar, MapPin, AlertCircle, Phone } from 'lucide-react';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';
import { adaptPost } from '../utils/postAdapter';

const STATUS_CONFIG = {
  lost:  { label: 'Perdido',    bg: '#fef2f2', text: '#c0392b' },
  found: { label: 'Encontrado', bg: '#f0fdf4', text: '#166534' },
};

const SPECIES_LABEL = {
  dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro',
};

export const PetCard = memo(function PetCard({ pet }) {
  const [imgError, setImgError] = useState(false);
  const adapted = useMemo(() => adaptPost(pet), [pet]);
  const petImage = useMediaUrl(adapted.imageUrl);
  const status = STATUS_CONFIG[adapted.type] ?? STATUS_CONFIG.found;

  return (
    <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', adapted.id)}>
      <article
        className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
        style={{
          background: '#ffffff',
          boxShadow: '0 4px 24px rgba(0, 76, 34, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 76, 34, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 76, 34, 0.08)';
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#f4f4f0] flex-shrink-0">
          {!imgError && petImage ? (
            <img
              src={petImage}
              alt={adapted.petName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-10 w-10" style={{ color: '#c8cdc6' }} />
              <span className="text-xs" style={{ color: '#555f70' }}>Sin foto</span>
            </div>
          )}

          {/* Status badge */}
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: status.bg, color: status.text }}
          >
            {status.label}
          </span>

          {adapted.isUrgent && (
            <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-red-500">
              <AlertCircle className="h-3 w-3" />
              URGENTE
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3
              className="font-bold text-lg leading-tight mb-0.5"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {adapted.petName}
            </h3>
            <p className="text-sm" style={{ color: '#555f70' }}>
              {SPECIES_LABEL[adapted.species] || adapted.species}
              {adapted.breed ? ` · ${adapted.breed}` : ''}
            </p>
          </div>

          <p className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: '#555f70' }}>
            {adapted.description || 'Sin descripción disponible'}
          </p>

          <div className="space-y-2 text-xs pt-4" style={{ borderTop: '1px solid rgba(27,28,26,0.07)', color: '#555f70' }}>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#004c22' }} />
              <span className="truncate">{adapted.location || 'Ubicación no especificada'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#004c22' }} />
              <span>
                {new Date(adapted.eventDate).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#004c22' }} />
              <span>{adapted.contactPhone || 'Contacto no disponible'}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default PetCard;
