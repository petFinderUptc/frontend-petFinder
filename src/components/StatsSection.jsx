import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_ROUTES } from '../constants/routes';

// ─── Colores orgánicos ────────────────────────────────────────────────────────
const PALETTE = {
  lost:     { fill: '#f97316', bg: 'bg-orange-50  dark:bg-orange-950/30', text: 'text-orange-500', ring: 'ring-orange-200 dark:ring-orange-800' },
  found:    { fill: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-500', ring: 'ring-emerald-200 dark:ring-emerald-800' },
  resolved: { fill: '#8b5cf6', bg: 'bg-violet-50  dark:bg-violet-950/30', text: 'text-violet-500', ring: 'ring-violet-200 dark:ring-violet-800' },
};

const EMPTY_COLOR = '#e2e8f0';

// ─── Hook: contador animado con easing ────────────────────────────────────────
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
      // easeOutCubic — desaceleración natural
      const ease = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(ease * target));
      if (pct < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}

// ─── Label central del donut ──────────────────────────────────────────────────
function DonutCenter({ total }) {
  const n = useCountUp(total);
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-bold tracking-tight text-foreground leading-none">{n}</span>
      <span className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">reportes</span>
    </div>
  );
}

// ─── Tarjeta de stat individual ───────────────────────────────────────────────
function StatCard({ label, count, palette, delay = 0 }) {
  const n = useCountUp(count, 1100 + delay);
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-4 sm:px-6 sm:py-5 ring-1 ${palette.bg} ${palette.ring} transition-shadow hover:shadow-md`}
    >
      <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${palette.text}`}>{n}</span>
      <span className="text-xs sm:text-sm font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function StatsSection({ stats, loading }) {
  const lost     = stats?.lost     ?? 0;
  const found    = stats?.found    ?? 0;
  const resolved = stats?.resolved ?? 0;
  const total    = stats?.totalActive ?? 0;

  const hasData = lost + found + resolved > 0;

  const chartData = hasData
    ? [
        { key: 'lost',     value: lost,     fill: PALETTE.lost.fill     },
        { key: 'found',    value: found,    fill: PALETTE.found.fill    },
        { key: 'resolved', value: resolved, fill: PALETTE.resolved.fill },
      ].filter((d) => d.value > 0)
    : [{ key: 'empty', value: 1, fill: EMPTY_COLOR }];

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-background border-b">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Actividad en la comunidad
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Mascotas rastreadas en Tunja y alrededores
          </p>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="flex flex-col items-center gap-8">
            <div className="h-56 w-56 rounded-full bg-muted animate-pulse" />
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* Donut chart */}
            <div className="relative h-44 w-44 sm:h-56 sm:w-56 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={108}
                    cornerRadius={10}
                    paddingAngle={hasData ? 5 : 0}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive
                    animationBegin={150}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Número central */}
              <DonutCenter total={total} />
            </div>

            {/* Tarjetas de stats */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              <StatCard
                label="Perdidos"
                count={lost}
                palette={PALETTE.lost}
                delay={0}
              />
              <StatCard
                label="Hallados"
                count={found}
                palette={PALETTE.found}
                delay={80}
              />
              <StatCard
                label="Reunificados"
                count={resolved}
                palette={PALETTE.resolved}
                delay={160}
              />
            </div>

            {/* Leyenda del donut (puntos de color) */}
            {hasData && (
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
                {[
                  { label: 'Perdidos',     fill: PALETTE.lost.fill     },
                  { label: 'Hallados',     fill: PALETTE.found.fill    },
                  { label: 'Reunificados', fill: PALETTE.resolved.fill },
                ].map(({ label, fill }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: fill }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Link a estadísticas detalladas */}
            <Link
              to={PUBLIC_ROUTES.STATS}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              Ver estadísticas detalladas
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
