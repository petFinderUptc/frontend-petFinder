/**
 * Profile Dropdown Component
 * 
 * Displays user avatar with notification badge and dropdown menu.
 * Includes: Profile, My Reports, Settings, Notifications, Logout
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, Settings, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../constants/routes';

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate(PUBLIC_ROUTES.LOGIN);
  };

  const getAvatarImage = () => {
    if (user?.avatar || user?.profileImage) {
      return user.avatar || user.profileImage;
    }
    return null;
  };

  const getInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors relative"
        aria-label="Menu de perfil"
      >
        {/* Avatar with notification badge */}
        <div className="relative">
          {getAvatarImage() ? (
            <img
              src={getAvatarImage()}
              alt={user?.username || 'Usuario'}
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold border-2 border-gray-300">
              {getInitials()}
            </div>
          )}
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
        
        <ChevronDown 
          className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{user?.username || 'Usuario'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to={PROTECTED_ROUTES.PROFILE}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>

            <Link
              to={PROTECTED_ROUTES.MY_REPORTS}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-4 w-4" />
              <span>Mis Reportes</span>
            </Link>

            <Link
              to={PROTECTED_ROUTES.SETTINGS}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors relative"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="h-4 w-4" />
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
