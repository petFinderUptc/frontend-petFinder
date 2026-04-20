import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LogIn, Heart, Bell, ShieldCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProfileDropdown } from './ProfileDropdown';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export function Header() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const progress   = Math.min(scrollY / 100, 1);
  const bgOpacity  = (0.08 + progress * 0.88).toFixed(2);
  const shadowOp   = (0.0  + progress * 0.12).toFixed(2);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: `rgba(250, 249, 245, ${bgOpacity})`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: 'none',
        boxShadow: `0 8px 32px rgba(0, 76, 34, ${shadowOp})`,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="mx-auto px-8 max-w-screen-2xl">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <img src="/LOGOPNG.png" alt="PetFinder" className="h-12 w-auto" />
          </Link>

          {/* Desktop — pill agrupado */}
          <div
            className="hidden md:flex items-center overflow-hidden rounded-2xl flex-shrink-0"
            style={{ border: '1.5px solid rgba(0, 76, 34, 0.18)', boxShadow: '0 2px 12px rgba(0,76,34,0.08)' }}
          >
            {/* Inicio */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150"
              style={{ color: isActive('/') ? '#004c22' : '#555f70', background: isActive('/') ? '#f0f7f2' : 'transparent' }}
              onMouseEnter={(e) => { if (!isActive('/')) e.currentTarget.style.background = '#f9fdf9'; }}
              onMouseLeave={(e) => { if (!isActive('/')) e.currentTarget.style.background = 'transparent'; }}
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />

            {/* Buscar */}
            <Link
              to={PUBLIC_ROUTES.SEARCH}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150"
              style={{ color: isActive(PUBLIC_ROUTES.SEARCH) ? '#004c22' : '#555f70', background: isActive(PUBLIC_ROUTES.SEARCH) ? '#f0f7f2' : 'transparent' }}
              onMouseEnter={(e) => { if (!isActive(PUBLIC_ROUTES.SEARCH)) e.currentTarget.style.background = '#f9fdf9'; }}
              onMouseLeave={(e) => { if (!isActive(PUBLIC_ROUTES.SEARCH)) e.currentTarget.style.background = 'transparent'; }}
            >
              <Search className="h-4 w-4" />
              Buscar
            </Link>

            {isAuthenticated && (
              <>
                <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />
                <Link
                  to={PROTECTED_ROUTES.NOTIFICATIONS}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150"
                  style={{ color: isActive(PROTECTED_ROUTES.NOTIFICATIONS) ? '#004c22' : '#555f70', background: isActive(PROTECTED_ROUTES.NOTIFICATIONS) ? '#f0f7f2' : 'transparent' }}
                  onMouseEnter={(e) => { if (!isActive(PROTECTED_ROUTES.NOTIFICATIONS)) e.currentTarget.style.background = '#f9fdf9'; }}
                  onMouseLeave={(e) => { if (!isActive(PROTECTED_ROUTES.NOTIFICATIONS)) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Bell className="h-4 w-4" />
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />
                <Link
                  to={PROTECTED_ROUTES.ADMIN}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150"
                  style={{ color: isActive(PROTECTED_ROUTES.ADMIN) ? '#b45309' : '#d97706' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fffbeb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              </>
            )}

            <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />

            {isAuthenticated ? (
              <>
                <Link
                  to={PROTECTED_ROUTES.PUBLISH_REPORT}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Publicar
                </Link>
                <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />
                <div className="px-2">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <>
                <Link
                  to={PUBLIC_ROUTES.LOGIN}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150"
                  style={{ color: '#004c22' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f7f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
                <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(0,76,34,0.12)' }} />
                <Link
                  to={PUBLIC_ROUTES.LOGIN}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Publicar
                </Link>
              </>
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
