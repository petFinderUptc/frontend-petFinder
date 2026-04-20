import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Search, TrendingUp, Heart, AlertTriangle, HelpCircle, ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getReports, getReportStats } from '../services/reportService';
import { PUBLIC_ROUTES } from '../constants/routes';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const PALETTE = {
  lost:     { fill: '#f97316', bg: 'bg-orange-50  dark:bg-orange-950/30', text: 'text-orange-500', border: 'border-orange-200 dark:border-orange-800' },
  found:    { fill: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-500', border: 'border-emerald-200 dark:border-emerald-800' },
  resolved: { fill: '#8b5cf6', bg: 'bg-violet-50  dark:bg-violet-950/30', text: 'text-violet-500', border: 'border-violet-200 dark:border-violet-800' },
  total:    { fill: '#004c22', bg: 'bg-[#e6efe9]',                        text: 'text-[#004c22]',  border: 'border-[#c8e6d4]'                         },
};

const SPECIES_META = {
  dog:    { label: 'Perros',   emoji: '🐶', color: '#f97316' },
  cat:    { label: 'Gatos',    emoji: '🐱', color: '#3b82f6' },
  bird:   { label: 'Aves',     emoji: '🐦', color: '#10b981' },
  rabbit: { label: 'Conejos',  emoji: '🐰', color: '#8b5cf6' },
  other:  { label: 'Otros',    emoji: '🐾', color: '#6b7280' },
};
const SPECIES_ORDER = ['dog', 'cat', 'bird', 'rabbit', 'other'];
const EMPTY_COLOR = '#e2e8f0';

// ─── Contador animado ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 1100) {
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

// ─── Tarjeta de resumen ───────────────────────────────────────────────────────
function SummaryCard({ label, value, description, icon: Icon, palette, delay = 0 }) {
  const n = useCountUp(value, 1100 + delay);
  return (
    <Card className={`border ${palette.border} ${palette.bg}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <Icon className={`h-4 w-4 ${palette.text}`} />
        </div>
        <p className={`text-4xl font-bold tabular-nums mb-1 ${palette.text}`}>{n}</p>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </CardContent>
    </Card>
  );
}

// ─── Barra de especie ─────────────────────────────────────────────────────────
function SpeciesBar({ label, emoji, count, total, color, loading }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!loading) {
      const raf = requestAnimationFrame(() => setWidth(pct));
      return () => cancelAnimationFrame(raf);
    }
  }, [pct, loading]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-7 text-center shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {loading ? '—' : `${count} (${pct}%)`}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: loading ? '0%' : `${width}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Tooltip personalizado del donut ─────────────────────────────────────────
function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm shadow-md">
      <span className="font-semibold">{name}:</span> {value}
    </div>
  );
}

// ─── Skeleton genérico ────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />;
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [speciesCounts, setSpeciesCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, ...speciesRes] = await Promise.allSettled([
          getReportStats(),
          ...SPECIES_ORDER.map((s) => getReports({ species: s, limit: 1 })),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value);

        const counts = {};
        SPECIES_ORDER.forEach((s, i) => {
          const r = speciesRes[i];
          counts[s] = r.status === 'fulfilled' ? (r.value?.pagination?.total ?? 0) : 0;
        });
        setSpeciesCounts(counts);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const lost     = stats?.lost     ?? 0;
  const found    = stats?.found    ?? 0;
  const resolved = stats?.resolved ?? 0;
  const total    = (stats?.totalActive ?? 0) + resolved;
  const active   = stats?.totalActive ?? 0;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const hasData = lost + found + resolved > 0;
  const chartData = hasData
    ? [
        { name: 'Perdidos',     value: lost,     fill: PALETTE.lost.fill     },
        { name: 'Hallados',     value: found,    fill: PALETTE.found.fill    },
        { name: 'Reunificados', value: resolved, fill: PALETTE.resolved.fill },
      ].filter((d) => d.value > 0)
    : [{ name: '', value: 1, fill: EMPTY_COLOR }];

  const speciesTotal = SPECIES_ORDER.reduce((s, k) => s + (speciesCounts[k] ?? 0), 0);

  return (
    <div className="min-h-screen" style={{ background: '#faf9f5' }}>

      {/* Header */}
      <div className="py-10 border-b" style={{ background: '#ffffff', borderColor: 'rgba(27,28,26,0.07)' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#555f70' }}>
            <Link to={PUBLIC_ROUTES.HOME} className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span>Estadísticas</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl" style={{ background: '#e6efe9' }}>
              <TrendingUp className="h-6 w-6" style={{ color: '#004c22' }} />
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Estadísticas de la comunidad
            </h1>
          </div>
          <p style={{ color: '#555f70' }}>Actividad de mascotas reportadas en Tunja y alrededores</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-10 space-y-10">

        {/* ── 4 tarjetas de resumen ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <SummaryCard label="Total reportes" value={total}    description="Histórico acumulado"             icon={TrendingUp}    palette={PALETTE.total}    delay={0}   />
              <SummaryCard label="Perdidos"        value={lost}     description="Mascotas buscando hogar"         icon={AlertTriangle} palette={PALETTE.lost}     delay={80}  />
              <SummaryCard label="Hallados"        value={found}    description="Encontrados por la comunidad"    icon={Search}        palette={PALETTE.found}    delay={160} />
              <SummaryCard label="Reunificados"    value={resolved} description="Casos cerrados con éxito"        icon={Heart}         palette={PALETTE.resolved} delay={240} />
            </>
          )}
        </div>

        {/* ── Donut + tasa de resolución ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribución de reportes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-52 w-52 rounded-full" />
                  <div className="flex gap-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-4 w-20" />)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-52 w-52">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={68}
                          outerRadius={100}
                          cornerRadius={8}
                          paddingAngle={hasData ? 4 : 0}
                          dataKey="value"
                          stroke="none"
                          isAnimationActive
                          animationBegin={150}
                          animationDuration={1200}
                          animationEasing="ease-out"
                        >
                          {chartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<DonutTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold leading-none">{active}</span>
                      <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">activos</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                    {[
                      { label: 'Perdidos',     fill: PALETTE.lost.fill     },
                      { label: 'Hallados',     fill: PALETTE.found.fill    },
                      { label: 'Reunificados', fill: PALETTE.resolved.fill },
                    ].map(({ label, fill }) => (
                      <span key={label} className="flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: fill }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasa de resolución */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tasa de reunificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-10" />)}
                </div>
              ) : (
                <>
                  {/* Anillo de porcentaje */}
                  <div className="flex items-center gap-5">
                    <div className="relative h-24 w-24 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted" />
                        <circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke={PALETTE.resolved.fill}
                          strokeWidth="3"
                          strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold leading-none">{resolutionRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        {resolved} de {total} casos resueltos
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Porcentaje de mascotas que fueron reunificadas con sus dueños sobre el total histórico de reportes.
                      </p>
                    </div>
                  </div>

                  {/* Métricas secundarias */}
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Reportes activos ahora', value: active,   color: 'text-[#004c22]'  },
                      { label: 'Casos resueltos',        value: resolved, color: 'text-violet-500'  },
                      { label: 'Total histórico',        value: total,    color: 'text-foreground'  },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between items-center py-1.5 border-b last:border-0">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Desglose por especie ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reportes por especie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SPECIES_ORDER.map((key) => {
              const meta = SPECIES_META[key];
              return (
                <SpeciesBar
                  key={key}
                  label={meta.label}
                  emoji={meta.emoji}
                  color={meta.color}
                  count={speciesCounts[key] ?? 0}
                  total={speciesTotal}
                  loading={loading}
                />
              );
            })}
          </CardContent>
        </Card>

        {/* ── Glosario ── */}
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">¿Qué significa cada categoría?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                {
                  palette: PALETTE.lost,
                  title: '🔴 Perdidos',
                  desc: 'Alguien perdió a su mascota y publicó un reporte para encontrarla. El caso sigue abierto.',
                },
                {
                  palette: PALETTE.found,
                  title: '🟢 Hallados',
                  desc: 'Alguien encontró una mascota sin dueño y publicó un reporte para avisar a la comunidad.',
                },
                {
                  palette: PALETTE.resolved,
                  title: '🟣 Reunificados',
                  desc: 'La mascota fue devuelta a su familia. El reporte fue marcado como resuelto.',
                },
              ].map(({ palette, title, desc }) => (
                <div key={title} className={`rounded-xl p-4 ${palette.bg} border ${palette.border}`}>
                  <p className="font-semibold mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── CTA ── */}
        <div className="text-center py-4">
          <Link to={PUBLIC_ROUTES.SEARCH}>
            <Button className="text-white gap-2" style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}>
              <Search className="h-4 w-4" />
              Explorar reportes activos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
