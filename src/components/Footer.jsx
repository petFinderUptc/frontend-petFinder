import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export function Footer() {
  return (
    <motion.footer
      className="mt-auto py-10"
      style={{
        background: '#ffffff',
        borderTop: '1px solid rgba(27,28,26,0.07)',
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Marca + descripción */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <Link to={PUBLIC_ROUTES.HOME}>
              <span
                className="text-2xl font-extrabold"
                style={{ color: '#004c22', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                PetFinder
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#555f70' }}>
              Plataforma de reencuentro de mascotas en Tunja y alrededores.
            </p>
          </motion.div>

          {/* Links rápidos */}
          <motion.div variants={fadeUp}>
            <h3
              className="font-bold mb-4 text-sm uppercase tracking-widest"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Enlaces
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: PUBLIC_ROUTES.HOME, label: 'Inicio' },
                { to: PUBLIC_ROUTES.SEARCH, label: 'Buscar mascotas' },
                { to: PROTECTED_ROUTES.PUBLISH_REPORT, label: 'Publicar reporte' },
                { to: PUBLIC_ROUTES.STATS, label: 'Estadísticas' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="transition-colors hover:underline"
                    style={{ color: '#555f70' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#004c22')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#555f70')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={fadeUp}>
            <h3
              className="font-bold mb-4 text-sm uppercase tracking-widest"
              style={{ color: '#1b1c1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Contacto
            </h3>
            <div className="text-sm space-y-1.5" style={{ color: '#555f70' }}>
              <p>
                <a
                  href="mailto:notificacions.petfinder@gmail.com"
                  className="transition-colors hover:underline"
                  style={{ color: '#555f70' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#004c22')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#555f70')}
                >
                  notificacions.petfinder@gmail.com
                </a>
              </p>
              <p>Tunja, Boyacá, Colombia - UPTC</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="pt-6 text-center text-sm"
          style={{ borderTop: '1px solid rgba(27,28,26,0.07)', color: '#555f70' }}
        >
          © 2026 PetFinder. Todos los derechos reservados.
        </motion.div>
      </div>
    </motion.footer>
  );
}
