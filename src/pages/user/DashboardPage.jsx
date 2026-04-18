import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle, Search, CheckCircle, AlertCircle, ArrowRight, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getMyReports } from '../../services/reportService';
import { adaptPost } from '../../utils/postAdapter';
import { useMediaUrl } from '../../hooks/useSignedUrl';

const SPECIES_LABEL = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };

// ─── Contador animado ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  const t0 = useRef(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    t0.current = null;
    const tick = (ts) => {
      if (!t0.current) t0.current = ts;
      const pct = Math.min((ts - t0.current) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(ease * target));
      if (pct < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}

// ─── Tarjeta de estadística con barra de progreso ─────────────────────────────
function StatCard({ label, sublabel, value, total, icon: Icon, colorClass, barColor }) {
  const animated = useCountUp(value);
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Card className={`border-2 ${colorClass}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-4xl font-bold tabular-nums ${barColor.replace('bg-', 'text-')}`}>{animated}</p>
          </div>
          <div className={`p-3 rounded-xl ${barColor} bg-opacity-15`}>
            <Icon className={`h-6 w-6 ${barColor.replace('bg-', 'text-')}`} />
          </div>
        </div>

        {total > 0 && value !== total ? (
          <>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full ${barColor} transition-all duration-1000`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{pct}% — {sublabel}</p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Miniatura con SAS renovada ───────────────────────────────────────────────
function ReportThumb({ url, alt }) {
  const src = useMediaUrl(url);
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-12 h-12 shrink-0 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
        Sin foto
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className="w-12 h-12 shrink-0 rounded-lg object-cover" onError={() => setErr(true)} />
  );
}

// ─── Fila de reporte reciente (solo lectura, clickeable) ──────────────────────
function RecentReportRow({ report }) {
  const typeLabel = report.type === 'lost' ? 'Perdido' : 'Encontrado';
  const species = SPECIES_LABEL[report.species] || report.species || 'Mascota';
  const detailUrl = PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id);

  return (
    <Link
      to={detailUrl}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
    >
      <ReportThumb url={report.imageUrl} alt={report.petName} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
          {report.petName}
        </p>
        <p className="text-xs text-muted-foreground">
          {species} · {new Date(report.eventDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
        </p>
      </div>
      <Badge
        variant={report.type === 'lost' ? 'destructive' : 'default'}
        className="shrink-0 text-xs"
      >
        {typeLabel}
      </Badge>
    </Link>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError('No fue posible cargar tus reportes.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // Excluir reportes inactivos (eliminados) de todas las vistas
  const adapted = reports.map(adaptPost).filter((r) => r.status !== 'inactive');

  const total    = adapted.length;
  const active   = adapted.filter((r) => r.status === 'active').length;
  const resolved = adapted.filter((r) => r.status === 'resolved').length;
  const recent   = adapted.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-black py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Hola, {user?.firstName || user?.username || 'Usuario'} 👋
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Aquí tienes un resumen de tu actividad en PetFinder
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              label="Total publicados"
              sublabel="reportes en total"
              value={total}
              total={total}
              icon={ClipboardList}
              colorClass="border-blue-200 bg-blue-50/40 dark:border-blue-800 dark:bg-blue-950/20"
              barColor="bg-blue-500"
            />
            <StatCard
              label="Activos ahora"
              sublabel="del total están activos"
              value={active}
              total={total}
              icon={Search}
              colorClass="border-amber-200 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20"
              barColor="bg-amber-500"
            />
            <StatCard
              label="Resueltos"
              sublabel="mascotas reunidas"
              value={resolved}
              total={total}
              icon={CheckCircle}
              colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20"
              barColor="bg-emerald-500"
            />
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT} className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 rounded-xl group-hover:scale-105 transition-transform">
                    <PlusCircle className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">Publicar Nuevo Reporte</h3>
                    <p className="text-sm text-muted-foreground">¿Perdiste o encontraste una mascota?</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <Link to={PUBLIC_ROUTES.SEARCH} className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl group-hover:scale-105 transition-transform">
                    <Search className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">Explorar Reportes</h3>
                    <p className="text-sm text-muted-foreground">Busca mascotas perdidas o encontradas</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Actividad reciente */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Actividad reciente</CardTitle>
                  <CardDescription>Tus últimos reportes publicados</CardDescription>
                </div>
                <Link to={PROTECTED_ROUTES.MY_REPORTS}>
                  <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                    Ver todos <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <div className="w-12 h-12 rounded-lg bg-muted animate-pulse shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                        <div className="h-2.5 bg-muted animate-pulse rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="py-6 text-center">
                  <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-600">{error}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={fetchReports}>
                    Reintentar
                  </Button>
                </div>
              ) : recent.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Aún no has publicado ningún reporte.</p>
                  <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <PlusCircle className="h-4 w-4 mr-2" /> Crear primer reporte
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {recent.map((r) => <RecentReportRow key={r.id} report={r} />)}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
