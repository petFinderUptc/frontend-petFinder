import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, LogIn, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export function Header() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
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
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            
            <Link
              to={PUBLIC_ROUTES.SEARCH}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive(PUBLIC_ROUTES.SEARCH) 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
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
        </nav>
      </div>
    </header>
  );
}
