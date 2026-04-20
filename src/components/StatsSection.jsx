import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { PUBLIC_ROUTES } from '../constants/routes';

const PALETTE = {
  lost:     { fill: '#f97316', bg: '#fff7ed', text: '#ea580c', ring: '#fed7aa' },
  found:    { fill: '#004c22', bg: '#e6efe9', text: '#004c22', ring: '#bbf7d0' },
  resolved: { fill: '#8b5cf6', bg: '#f5f3ff', text: '#7c3aed', ring: '#ddd6fe' },
};

const EMPTY_COLOR = '#e8e6e0';

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
      <span
        className="text-4xl font-bold tracking-tight leading-none"
        style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {n}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: '#555f70' }}>
        reportes
      </span>
    </div>
  );
}

// ─── Tarjeta de stat individual ───────────────────────────────────────────────
function StatCard({ label, count, palette, delay = 0 }) {
  const n = useCountUp(count, 1100 + delay);
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-2xl px-3 py-4 sm:px-6 sm:py-5 transition-shadow hover:shadow-md"
      style={{ background: palette.bg, outline: `1px solid ${palette.ring}` }}
    >
      <span
        className="text-2xl sm:text-3xl font-bold tabular-nums"
        style={{ color: palette.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {n}
      </span>
      <span className="text-xs sm:text-sm font-medium text-center" style={{ color: '#555f70' }}>{label}</span>
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
    <section className="py-14" style={{ background: '#ffffff', borderBottom: '1px solid rgba(27,28,26,0.07)' }}>
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#004c22' }}>
            Estadísticas
          </p>
          <h2
            className="text-2xl md:text-3xl font-extrabold"
            style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Actividad en la comunidad
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#555f70' }}>
            Mascotas rastreadas en Tunja y alrededores
          </p>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="flex flex-col items-center gap-8">
            <div className="h-56 w-56 rounded-full animate-pulse" style={{ background: '#f4f4f0' }} />
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#f4f4f0' }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* Donut chart */}
            <div className="relative h-44 w-44 sm:h-56 sm:w-56 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs" style={{ color: '#555f70' }}>
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
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group"
              style={{ color: '#004c22' }}
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
