import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { PUBLIC_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

export function SearchResultCard({ report, speciesLabel, typeLabel }) {
  const imageUrl = useMediaUrl(report.imageUrl);

  return (
    <Link key={report.id} to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
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
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">{speciesLabel[report.species] || report.species}</Badge>
            <Badge>{typeLabel[report.type] || report.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          <p className="text-xs text-muted-foreground">
            Estado: <span className="font-medium">{report.status}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
