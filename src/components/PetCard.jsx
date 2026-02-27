import { Link } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export function PetCard({ pet }) {
  const statusColors = {
    lost: 'bg-red-100 text-red-800 border-red-200',
    found: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusLabels = {
    lost: 'Perdido',
    found: 'Encontrado',
  };
  
  return (
    <Link to={`/mascota/${pet.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={pet.photo}
            alt={pet.name || 'Mascota'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {pet.isUrgent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-md">
              <AlertCircle className="h-3 w-3" />
              URGENTE
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${statusColors[pet.status]} shadow-md`}>
            {statusLabels[pet.status]}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1">
              {pet.name || `${pet.type === 'dog' ? 'Perro' : 'Gato'} sin nombre`}
            </h3>
            <p className="text-sm text-gray-600">
              {pet.breed} • {pet.color}
            </p>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {pet.description}
          </p>
          
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{pet.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              <span>{new Date(pet.date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3.5 w-3.5 text-blue-500" />
              <span>{pet.contactName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PetCard;
