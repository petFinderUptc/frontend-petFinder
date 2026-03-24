import { Link } from 'react-router-dom';
import { Loader2, Trash2, Pencil, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';
import { useMediaUrl } from '../hooks/useSignedUrl';

export function ReportCardItem({
  report,
  isBusy,
  isResolved,
  onMarkResolved,
  onDelete,
  speciesLabels,
  typeLabels,
  statusLabels,
  statusVariant,
}) {
  const imageUrl = useMediaUrl(report.imageUrl);

  return (
    <Card className="h-full overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt="Reporte" className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
          Sin imagen
        </div>
      )}
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="line-clamp-1 text-lg font-semibold">
            {speciesLabels[report.species] || report.species || 'Mascota'}
          </h2>
          <div className="flex gap-1">
            <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
              {typeLabels[report.type] || report.type}
            </Badge>
            <Badge variant={statusVariant[report.status] || 'outline'}>
              {statusLabels[report.status] || report.status}
            </Badge>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {report.description || 'Sin descripcion'}
        </p>

        <div className="text-xs text-muted-foreground">
          <p>
            Raza: <span className="font-medium">{report.breed || 'No especificada'}</span>
          </p>
          <p>
            Publicado:{' '}
            <span className="font-medium">
              {new Date(report.createdAt || Date.now()).toLocaleDateString('es-ES')}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link to={PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id)}>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" /> Ver
            </Button>
          </Link>
          <Link to={PROTECTED_ROUTES.EDIT_REPORT.replace(':id', report.id)}>
            <Button variant="outline" size="sm" className="w-full">
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          </Link>
          <Button
            size="sm"
            variant="secondary"
            disabled={isBusy || isResolved}
            onClick={() => onMarkResolved(report)}
            className="w-full"
          >
            {isBusy ? 'Procesando...' : 'Marcar resuelto'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={isBusy}
            onClick={() => onDelete(report)}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
