import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LogIn, Heart, Bell, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProfileDropdown } from './ProfileDropdown';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export function Header() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
      isActive(path)
        ? 'text-[#004c22]'
        : 'text-[#555f70] hover:text-[#1b1c1a]'
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(250, 249, 245, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(27, 28, 26, 0.07)',
        boxShadow: '0 1px 16px rgba(0, 76, 34, 0.05)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <img src="/LOGOPNG.png" alt="PetFinder" className="h-10 w-auto" />
          </Link>

          {/* Desktop nav — centrado */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link to="/" className={navLinkClass('/')}>
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <Link to={PUBLIC_ROUTES.SEARCH} className={navLinkClass(PUBLIC_ROUTES.SEARCH)}>
              <Search className="h-4 w-4" />
              Buscar
            </Link>
            {isAuthenticated && (
              <Link to={PROTECTED_ROUTES.NOTIFICATIONS} className={`${navLinkClass(PROTECTED_ROUTES.NOTIFICATIONS)} relative`}>
                <Bell className="h-4 w-4" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to={PROTECTED_ROUTES.ADMIN}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                  isActive(PROTECTED_ROUTES.ADMIN) ? 'text-amber-600' : 'text-amber-500 hover:text-amber-700'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)',
                boxShadow: '0 2px 10px rgba(0, 76, 34, 0.3)',
              }}
            >
              <PlusCircle className="h-4 w-4" />
              Publicar
            </Link>

            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link
                to={PUBLIC_ROUTES.LOGIN}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150"
                style={{ color: '#555f70' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1b1c1a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555f70')}
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
            >
              <PlusCircle className="h-4 w-4" />
              Publicar
            </Link>
            {isAuthenticated && (
              <Link
                to={PROTECTED_ROUTES.NOTIFICATIONS}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ background: '#f4f4f0', color: '#555f70' }}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && <ProfileDropdown />}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: '#f4f4f0', color: '#555f70' }}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <nav
            className="md:hidden pb-4 pt-2 space-y-0.5"
            style={{ borderTop: '1px solid rgba(27,28,26,0.07)' }}
          >
            {[
              { to: '/', icon: <Home className="h-4 w-4" />, label: 'Inicio' },
              { to: PUBLIC_ROUTES.SEARCH, icon: <Search className="h-4 w-4" />, label: 'Buscar' },
              ...(isAuthenticated
                ? [{ to: PROTECTED_ROUTES.MY_REPORTS, icon: <Heart className="h-4 w-4" />, label: 'Mis Reportes' }]
                : [{ to: PUBLIC_ROUTES.LOGIN, icon: <LogIn className="h-4 w-4" />, label: 'Iniciar sesión' }]),
              ...(isAdmin
                ? [{ to: PROTECTED_ROUTES.ADMIN, icon: <ShieldCheck className="h-4 w-4" />, label: 'Admin' }]
                : []),
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  color: isActive(to) ? '#004c22' : '#555f70',
                  background: isActive(to) ? '#e6efe9' : 'transparent',
                }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
