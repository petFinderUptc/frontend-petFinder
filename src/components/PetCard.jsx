import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Calendar, MapPin, AlertCircle, Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { PUBLIC_ROUTES } from '../constants/routes';
import { toAbsoluteMediaUrl } from '../utils/userAdapter';
import { adaptPost } from '../utils/postAdapter';

export function PetCard({ pet }) {
  const [imgError, setImgError] = useState(false);
  const adapted = adaptPost(pet);
  
  const statusColors = {
    lost: 'bg-red-100 text-red-800 border-red-200',
    found: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusLabels = {
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

  const petImage = toAbsoluteMediaUrl(adapted.imageUrl);
  
  return (
    <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', adapted.id)}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <div className="relative h-48 overflow-hidden">
          {!imgError && petImage ? (
            <img
              src={petImage}
              alt={adapted.petName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Sin foto</span>
            </div>
          )}
          {adapted.isUrgent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-md">
              <AlertCircle className="h-3 w-3" />
              URGENTE
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${statusColors[adapted.type]} shadow-md`}>
            {statusLabels[adapted.type]}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1">
              {adapted.petName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {speciesLabel[adapted.species] || adapted.species} • {adapted.breed || 'Raza desconocida'}
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {adapted.description || 'Sin descripción disponible'}
          </p>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{adapted.location || 'Ubicación no especificada'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span>{new Date(adapted.eventDate).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-blue-500" />
              <span>{adapted.contactPhone || 'Contacto no disponible'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PetCard;
