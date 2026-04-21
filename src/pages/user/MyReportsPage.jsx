import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { deleteReport, getMyReports, updateReport } from '../../services/reportService';
import { PROTECTED_ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/button';
import { ReportCardItem } from '../../components/ReportCardItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

function ConfirmModal({ open, icon, title, description, confirmLabel, confirmClass, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background border shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-muted">{icon}</div>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
          <Button size="sm" className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

const typeLabels = { lost: 'Perdido', found: 'Encontrado' };
const speciesLabels = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };
const statusLabels = { active: 'Activo', resolved: 'Resuelto', inactive: 'Inactivo' };
const statusVariant = { active: 'default', resolved: 'secondary', inactive: 'outline' };

export default function MyReportsPage() {
  const { addAlert } = useAlert();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingResolve, setPendingResolve] = useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getMyReports();
      const visible = Array.isArray(response)
        ? response.filter((r) => r.status !== 'inactive')
        : [];
      setReports(visible);
    } catch (err) {
      setError(err?.message || 'No fue posible cargar tus reportes.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadReports(); }, []);

  const confirmMarkResolved = async () => {
    const report = pendingResolve;
    setPendingResolve(null);
    try {
      setBusyId(report.id);
      await updateReport(report.id, { status: 'resolved' });
      addAlert({ type: 'success', message: 'Reporte marcado como resuelto.' });
      await loadReports();
    } catch (err) {
      addAlert({ type: 'error', message: err?.message || 'No fue posible actualizar el estado.' });
    } finally {
      setBusyId('');
    }
  };

  const confirmDelete = async () => {
    const report = pendingDelete;
    setPendingDelete(null);
    try {
      setBusyId(report.id);
      await deleteReport(report.id);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      addAlert({ type: 'success', message: 'Reporte eliminado correctamente.' });
    } catch (err) {
      addAlert({ type: 'error', message: err?.message || 'No fue posible eliminar el reporte.' });
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <ConfirmModal
        open={!!pendingResolve}
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        title="Marcar como resuelto"
        description="Esta acción indicará que la mascota fue encontrada o reunida. Ya no podrás editar ni eliminar el reporte. ¿Confirmas?"
        confirmLabel="Sí, marcar resuelto"
        confirmClass="bg-green-600 hover:bg-green-700 text-white"
        onConfirm={confirmMarkResolved}
        onCancel={() => setPendingResolve(null)}
      />
      <ConfirmModal
        open={!!pendingDelete}
        icon={<Trash2 className="h-5 w-5 text-red-600" />}
        title="Eliminar reporte"
        description="Esta acción no se puede deshacer. El reporte dejará de aparecer en búsquedas públicas. ¿Deseas eliminarlo permanentemente?"
        confirmLabel="Sí, eliminar"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold">Mis Reportes</h1>
                <p className="mt-1 text-muted-foreground">Administra, edita, resuelve o elimina tus reportes.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadReports} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Actualizar
                </Button>
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                  <Button className="text-white" style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Publicar reporte
                  </Button>
                </Link>
              </div>
            </div>

            {loading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">Cargando reportes...</CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No tienes reportes publicados</CardTitle>
                  <CardDescription>Publica tu primer reporte para empezar a recibir ayuda de la comunidad.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear primer reporte
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                  <ReportCardItem
                    key={report.id}
                    report={report}
                    isBusy={busyId === report.id}
                    isResolved={report.status === 'resolved'}
                    onMarkResolved={(r) => setPendingResolve(r)}
                    onDelete={(r) => setPendingDelete(r)}
                    speciesLabels={speciesLabels}
                    typeLabels={typeLabels}
                    statusLabels={statusLabels}
                    statusVariant={statusVariant}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
