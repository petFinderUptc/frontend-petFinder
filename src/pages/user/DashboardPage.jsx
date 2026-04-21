import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
function StatCard({ label, sublabel, value, total, icon: Icon, iconColor, iconBg, accentColor }) {
  const animated = useCountUp(value);
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0" style={{ boxShadow: '0 2px 16px rgba(0,76,34,0.07)' }}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#a0abb8' }}>{label}</p>
              <p className="text-5xl font-extrabold tabular-nums leading-none" style={{ color: accentColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{animated}</p>
            </div>
            <div className="p-3 rounded-2xl" style={{ background: iconBg }}>
              <Icon className="h-6 w-6" style={{ color: iconColor }} />
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>
          <p className="text-xs" style={{ color: '#a0abb8' }}>{pct}% — {sublabel}</p>
        </CardContent>
      </Card>
    </motion.div>
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
        <p className="font-medium text-sm truncate transition-colors group-hover:text-[#004c22]">
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
    <motion.div
      className="min-h-screen"
      style={{ background: '#faf9f5' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="py-10 border-b" style={{ background: '#ffffff', borderColor: 'rgba(27,28,26,0.07)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1
              className="text-3xl font-extrabold mb-1"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Hola, {user?.firstName || user?.username || 'Usuario'} 👋
            </h1>
            <p className="text-sm" style={{ color: '#555f70' }}>
              Aquí tienes un resumen de tu actividad en PetFinder
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Métricas */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >
            {[
              { label: 'Total publicados', sublabel: 'reportes en total', value: total, icon: ClipboardList, iconColor: '#004c22', iconBg: '#e6efe9', accentColor: '#004c22' },
              { label: 'Activos ahora', sublabel: 'del total están activos', value: active, icon: Search, iconColor: '#b45309', iconBg: '#fef3c7', accentColor: '#d97706' },
              { label: 'Resueltos', sublabel: 'mascotas reunidas', value: resolved, icon: CheckCircle, iconColor: '#166534', iconBg: '#dcfce7', accentColor: '#16a34a' },
            ].map((s) => (
              <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }}>
                <StatCard label={s.label} sublabel={s.sublabel} value={s.value} total={total} icon={s.icon} iconColor={s.iconColor} iconBg={s.iconBg} accentColor={s.accentColor} />
              </motion.div>
            ))}
          </motion.div>

          {/* Acciones rápidas */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
          >
            {[
              { to: PROTECTED_ROUTES.PUBLISH_REPORT, icon: PlusCircle, color: '#004c22', title: 'Publicar Nuevo Reporte', sub: '¿Perdiste o encontraste una mascota?' },
              { to: PUBLIC_ROUTES.SEARCH, icon: Search, color: '#166534', title: 'Explorar Reportes', sub: 'Busca mascotas perdidas o encontradas' },
            ].map(({ to, icon: Icon, color, title, sub }) => (
              <motion.div key={to} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } } }}>
                <motion.div whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(0,76,34,0.1)' }} transition={{ duration: 0.2 }}>
                  <Card className="transition-shadow group cursor-pointer">
                    <CardContent className="p-5">
                      <Link to={to} className="flex items-start gap-4">
                        <div className="p-3 rounded-xl group-hover:scale-105 transition-transform" style={{ background: '#e6efe9' }}>
                          <Icon className="h-7 w-7" style={{ color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-0.5">{title}</h3>
                          <p className="text-sm text-muted-foreground">{sub}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actividad reciente */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Actividad reciente</CardTitle>
                  <CardDescription>Tus últimos reportes publicados</CardDescription>
                </div>
                <Link to={PROTECTED_ROUTES.MY_REPORTS}>
                  <Button variant="ghost" size="sm" className="gap-1" style={{ color: '#004c22' }}>
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
                    <Button size="sm" className="text-white" style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}>
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
    </motion.div>
  );
}
