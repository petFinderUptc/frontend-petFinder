import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, PlusCircle, Heart, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import PetCard from '../components/PetCard';
import { StatsSection } from '../components/StatsSection';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';
import { getReports, getReportStats } from '../services/reportService';

// ─── Variantes de animación reutilizables ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [recentPets, setRecentPets]     = useState([]);
  const [petsLoading, setPetsLoading]   = useState(true);
  const [petsError, setPetsError]       = useState(null);
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [reportsResult, statsResult] = await Promise.allSettled([
        getReports({ page: 1, limit: 3 }),
        getReportStats(),
      ]);
      if (reportsResult.status === 'fulfilled') {
        const r = reportsResult.value;
        const reports = Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : [];
        setRecentPets(reports.slice(0, 3));
      } else {
        setPetsError('No fue posible cargar los reportes recientes.');
      }
      setPetsLoading(false);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      setStatsLoading(false);
    };
    void fetchData();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#faf9f5' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36">
        {/* Blobs ambientales */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, #004c22 0%, transparent 70%)' }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #166534 0%, transparent 70%)' }} />

        <div className="container relative mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Reunimos familias{' '}
              <span style={{ color: '#004c22' }}>con sus mascotas</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: '#555f70', maxWidth: '560px', margin: '0 auto 2.5rem' }}
            >
              Busca, publica y encuentra el peludito en cuestión.
              Sabemos lo angustiante que puede ser, ayúdanos y te ayudaremos.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={PUBLIC_ROUTES.SEARCH}>
                <button
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  style={{
                    background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)',
                    boxShadow: '0 4px 20px rgba(0, 76, 34, 0.4)',
                  }}
                >
                  <Search className="h-5 w-5" />
                  Buscar Mascotas
                </button>
              </Link>
              <Link to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}>
                <button
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: '#ffffff',
                    color: '#004c22',
                    border: '2px solid rgba(0, 76, 34, 0.2)',
                    boxShadow: '0 2px 12px rgba(0, 76, 34, 0.08)',
                  }}
                >
                  <PlusCircle className="h-5 w-5" />
                  Publicar Reporte
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <StatsSection stats={stats} loading={statsLoading} />

      {/* ── How it Works ─────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#004c22' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60 text-white">
              Proceso
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-base opacity-70 text-white">
              Tres pasos simples para reunir mascotas con sus familias
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              {
                step: '01',
                icon: <PlusCircle className="h-7 w-7" style={{ color: '#004c22' }} />,
                iconBg: '#ffffff',
                cardBg: '#faf9f5',
                stepColor: '#004c22',
                titleColor: '#1b1c1a',
                descColor: '#555f70',
                title: 'Publica un Reporte',
                desc: 'Sube una foto y nuestra IA extrae automáticamente la raza, color y características del animal.',
              },
              {
                step: '02',
                icon: <Search className="h-7 w-7" style={{ color: '#e6efe9' }} />,
                iconBg: 'rgba(255,255,255,0.12)',
                cardBg: '#0d2e1a',
                stepColor: 'rgba(255,255,255,0.2)',
                titleColor: '#ffffff',
                descColor: 'rgba(255,255,255,0.6)',
                title: 'Detección de Coincidencias',
                desc: 'El sistema compara tu reporte con todos los activos usando similitud semántica y geolocalización.',
              },
              {
                step: '03',
                icon: <Heart className="h-7 w-7" style={{ color: '#004c22' }} />,
                iconBg: '#ffffff',
                cardBg: '#e6efe9',
                stepColor: '#166534',
                titleColor: '#1b1c1a',
                descColor: '#3d5247',
                title: '¡Reencuéntrate!',
                desc: 'Recibe una alerta con los mejores matches y contacta directamente con quien encontró a tu mascota.',
              },
            ].map(({ step, icon, iconBg, cardBg, stepColor, titleColor, descColor, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative p-8 rounded-2xl"
                style={{ background: cardBg }}
              >
                <span
                  className="absolute top-6 right-6 text-4xl font-extrabold select-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: stepColor }}
                >
                  {step}
                </span>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: iconBg }}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: titleColor }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: descColor }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Recent Reports ────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf9f5' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="flex items-end justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#004c22' }}>
                Comunidad
              </p>
              <h2
                className="text-3xl md:text-4xl font-extrabold"
                style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Reportes Recientes
              </h2>
            </div>
            <Link
              to={PUBLIC_ROUTES.SEARCH}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold group"
              style={{ color: '#004c22' }}
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {petsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl animate-pulse" style={{ background: '#f4f4f0' }} />
              ))}
            </div>
          ) : petsError ? (
            <div className="text-center py-12" style={{ color: '#555f70' }}>{petsError}</div>
          ) : recentPets.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#c8cdc6' }} />
              <p className="text-base mb-6" style={{ color: '#555f70' }}>No hay reportes disponibles aún.</p>
              {isAuthenticated && (
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}><Button>Publicar el primer reporte</Button></Link>
              )}
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
              >
                {recentPets.map((pet) => (
                  <motion.div key={pet.id} variants={fadeUp}>
                    <PetCard pet={pet} />
                  </motion.div>
                ))}
              </motion.div>
              <div className="text-center sm:hidden">
                <Link to={PUBLIC_ROUTES.SEARCH}>
                  <Button variant="outline" className="gap-2">
                    Ver Todos los Reportes <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <motion.section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #004c22 0%, #0a3d1f 50%, #052e14 100%)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ¿Has perdido o encontrado<br className="hidden md:block" /> una mascota?
          </h2>
          <p className="text-lg mb-10 opacity-75 text-white">
            No esperes más — cada minuto cuenta para un reencuentro.
          </p>
          <Link to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold"
              style={{ background: '#ffffff', color: '#004c22', boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
              <PlusCircle className="h-5 w-5" />
              Publicar Reporte Ahora
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
