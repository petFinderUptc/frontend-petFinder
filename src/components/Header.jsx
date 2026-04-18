import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LogIn, Heart, Bell, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
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
    `relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? 'text-[#004c22] bg-[#e6efe9]'
        : 'text-[#555f70] hover:text-[#1b1c1a] hover:bg-[#f4f4f0]'
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(250, 249, 245, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(27, 28, 26, 0.07)',
        boxShadow: '0 4px 24px rgba(0, 76, 34, 0.06)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <img
              src="/LOGOPNG.png"
              alt="PetFinder"
              className="h-12 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <Link to={PUBLIC_ROUTES.SEARCH} className={navLinkClass(PUBLIC_ROUTES.SEARCH)}>
              <Search className="h-4 w-4" />
              Buscar
            </Link>

            {isAuthenticated && (
              <Link to={PROTECTED_ROUTES.NOTIFICATIONS} className={`${navLinkClass(PROTECTED_ROUTES.NOTIFICATIONS)} ml-1`}>
                <Bell className="h-4 w-4" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to={PROTECTED_ROUTES.ADMIN}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ml-1 ${
                  isActive(PROTECTED_ROUTES.ADMIN)
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-px active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)',
                boxShadow: '0 2px 12px rgba(0, 76, 34, 0.35)',
              }}
            >
              <PlusCircle className="h-4 w-4" />
              Publicar
            </Link>

            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to={PUBLIC_ROUTES.LOGIN}>
                <Button variant="outline" size="sm" className="gap-2 border-[#004c22]/20 text-[#004c22] hover:bg-[#e6efe9]">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: publish + bell + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #004c22 0%, #166534 100%)' }}
            >
              <PlusCircle className="h-4 w-4" />
              Publicar
            </Link>
            {isAuthenticated && (
              <Link
                to={PROTECTED_ROUTES.NOTIFICATIONS}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#f4f4f0] text-[#555f70]"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : null}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f4f4f0] text-[#555f70]"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <nav
            className="md:hidden py-3 pb-4 space-y-1 border-t"
            style={{ borderColor: 'rgba(27, 28, 26, 0.07)' }}
          >
            {[
              { to: '/', icon: <Home className="h-4 w-4" />, label: 'Inicio' },
              { to: PUBLIC_ROUTES.SEARCH, icon: <Search className="h-4 w-4" />, label: 'Buscar' },
              ...(isAuthenticated ? [{ to: PROTECTED_ROUTES.MY_REPORTS, icon: <Heart className="h-4 w-4" />, label: 'Mis Reportes' }] : []),
              ...(isAdmin ? [{ to: PROTECTED_ROUTES.ADMIN, icon: <ShieldCheck className="h-4 w-4" />, label: 'Admin' }] : []),
              ...(!isAuthenticated ? [{ to: PUBLIC_ROUTES.LOGIN, icon: <LogIn className="h-4 w-4" />, label: 'Iniciar sesión' }] : []),
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(to)
                    ? 'text-[#004c22] bg-[#e6efe9]'
                    : 'text-[#555f70] hover:text-[#1b1c1a] hover:bg-[#f4f4f0]'
                }`}
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
