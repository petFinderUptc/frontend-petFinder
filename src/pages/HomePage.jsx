import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, PlusCircle, Heart, AlertCircle, ArrowRight, MapPin, Users, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import PetCard from '../components/PetCard';
import { StatsSection } from '../components/StatsSection';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';
import { getReports, getReportStats } from '../services/reportService';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [recentPets, setRecentPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [reportsResult, statsResult] = await Promise.allSettled([
        getReports({ page: 1, limit: 3 }),
        getReportStats(),
      ]);

      if (reportsResult.status === 'fulfilled') {
        const response = reportsResult.value;
        const reports = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
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
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Ambient background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #004c22 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-[380px] w-[380px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #166534 0%, transparent 70%)' }}
        />

        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow pill */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: '#e6efe9', color: '#004c22' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Impulsado por Inteligencia Artificial
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Reunimos familias{' '}
              <span style={{ color: '#004c22' }}>con sus mascotas</span>
            </h1>

            <p
              className="text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: '#555f70', maxWidth: '560px', margin: '0 auto 2.5rem' }}
            >
              Busca, publica y encuentra mascotas perdidas en Tunja y alrededores.
              Nuestra IA analiza fotos y detecta coincidencias automáticamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={PUBLIC_ROUTES.SEARCH}>
                <button
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
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
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
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
            </div>

            {/* Social proof strip */}
            <div className="flex items-center justify-center gap-6 mt-12 text-sm" style={{ color: '#555f70' }}>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" style={{ color: '#004c22' }} />
                Tunja y alrededores
              </span>
              <span className="h-4 w-px" style={{ background: 'rgba(27,28,26,0.15)' }} />
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" style={{ color: '#004c22' }} />
                Comunidad activa
              </span>
              <span className="h-4 w-px" style={{ background: 'rgba(27,28,26,0.15)' }} />
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" style={{ color: '#004c22' }} />
                IA integrada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <StatsSection stats={stats} loading={statsLoading} />

      {/* ── How it Works ─────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#f4f4f0' }}>
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#004c22' }}>
              Proceso
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-base" style={{ color: '#555f70' }}>
              Tres pasos simples para reunir mascotas con sus familias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                icon: <PlusCircle className="h-7 w-7" style={{ color: '#004c22' }} />,
                title: 'Publica un Reporte',
                desc: 'Sube una foto y nuestra IA extrae automáticamente la raza, color y características del animal.',
              },
              {
                step: '02',
                icon: <Search className="h-7 w-7" style={{ color: '#004c22' }} />,
                title: 'Detección de Coincidencias',
                desc: 'El sistema compara tu reporte con todos los activos usando similitud semántica y geolocalización.',
              },
              {
                step: '03',
                icon: <Heart className="h-7 w-7" style={{ color: '#004c22' }} />,
                title: '¡Reencuéntrate!',
                desc: 'Recibe una alerta con los mejores matches y contacta directamente con quien encontró a tu mascota.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div
                key={step}
                className="relative p-8 rounded-2xl"
                style={{
                  background: '#ffffff',
                  boxShadow: '0 8px 40px rgba(0, 76, 34, 0.07)',
                }}
              >
                <span
                  className="absolute top-6 right-6 text-4xl font-extrabold select-none"
                  style={{ color: 'rgba(0, 76, 34, 0.07)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {step}
                </span>
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ background: '#e6efe9' }}
                >
                  {icon}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#555f70' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Reports ────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf9f5' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
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
          </div>

          {petsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl animate-pulse" style={{ background: '#f4f4f0' }} />
              ))}
            </div>
          ) : petsError ? (
            <div className="text-center py-12" style={{ color: '#555f70' }}>
              {petsError}
            </div>
          ) : recentPets.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#c8cdc6' }} />
              <p className="text-base mb-6" style={{ color: '#555f70' }}>
                No hay reportes disponibles aún.
              </p>
              {isAuthenticated && (
                <Link to={PROTECTED_ROUTES.PUBLISH_REPORT}>
                  <Button>Publicar el primer reporte</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {recentPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
              <div className="text-center sm:hidden">
                <Link to={PUBLIC_ROUTES.SEARCH}>
                  <Button variant="outline" className="gap-2">
                    Ver Todos los Reportes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, #004c22 0%, #0a3d1f 50%, #052e14 100%)',
        }}
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
            <button
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
              style={{
                background: '#ffffff',
                color: '#004c22',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              }}
            >
              <PlusCircle className="h-5 w-5" />
              Publicar Reporte Ahora
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
