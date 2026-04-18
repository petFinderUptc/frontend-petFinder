import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LogIn, Heart, Bell, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ProfileDropdown } from './ProfileDropdown';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export function Header() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img 
              src="/LOGOPNG.png" 
              alt="PetFinder Logo" 
              className="h-14 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            
            <Link
              to={PUBLIC_ROUTES.SEARCH}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive(PUBLIC_ROUTES.SEARCH) 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Link>
            
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg hover:shadow-xl ${
                isActive(PROTECTED_ROUTES.PUBLISH_REPORT) ? 'shadow-xl' : ''
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publicar</span>
            </Link>

            {isAdmin && (
              <Link
                to={PROTECTED_ROUTES.ADMIN}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  isActive(PROTECTED_ROUTES.ADMIN)
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to={PROTECTED_ROUTES.NOTIFICATIONS}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  isActive(PROTECTED_ROUTES.NOTIFICATIONS)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to={PUBLIC_ROUTES.LOGIN}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu */}
          <div className="flex md:hidden gap-2">
            <Link
              to={isAuthenticated ? PROTECTED_ROUTES.PUBLISH_REPORT : PUBLIC_ROUTES.LOGIN}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publicar</span>
            </Link>
            {isAuthenticated && (
              <Link
                to={PROTECTED_ROUTES.NOTIFICATIONS}
                className="relative flex items-center rounded-lg border px-3 py-2"
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
            ) : (
              <Link to={PUBLIC_ROUTES.LOGIN}>
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile navigation */}
        <nav className="flex md:hidden border-t pb-2 pt-2 gap-2 overflow-x-auto">
          <Link
            to="/"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
              isActive('/') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </Link>
          
          <Link
            to={PUBLIC_ROUTES.SEARCH}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
              isActive(PUBLIC_ROUTES.SEARCH) 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </Link>
          
          {isAuthenticated && (
            <Link
              to={PROTECTED_ROUTES.MY_REPORTS}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
                isActive(PROTECTED_ROUTES.MY_REPORTS)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Mis Reportes</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to={PROTECTED_ROUTES.ADMIN}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
                isActive(PROTECTED_ROUTES.ADMIN)
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-amber-600'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
