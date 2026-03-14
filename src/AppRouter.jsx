/**
 * Configuración del Enrutador de la Aplicación
 * 
 * Organiza las rutas en categorías públicas y protegidas.
 * 
 * Características:
 * - Rutas públicas (accesibles sin autenticación)
 * - Rutas protegidas (requieren autenticación)
 * - Página 404 No Encontrada
 * - Organización limpia de rutas
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from './constants/routes';

// Layouts
import MainLayout from './layouts/MainLayout';

// Auth Components
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SearchPage from './pages/pet/SearchPage';
import PetDetailPage from './pages/pet/PetDetailPage';

// Protected Pages
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import NotificationsPage from './pages/user/NotificationsPage';
import SettingsPage from './pages/user/SettingsPage';
import PublishReportPage from './pages/pet/PublishReportPage';

/**
 * NotFoundPage - Página 404 simple
 */
const NotFoundPage = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    gap: '1rem',
  }}>
    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Página no encontrada</p>
    <a href={PUBLIC_ROUTES.HOME} style={{
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: 500,
    }}>
      Volver al inicio
    </a>
  </div>
);

/**
 * MyReportsPage - Placeholder
 */
const MyReportsPage = () => (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <h1>Mis Reportes</h1>
    <p style={{ color: '#6b7280' }}>Ver y gestionar tus reportes de mascotas aquí</p>
  </div>
);

/**
 * Componente AppRouter
 * Contiene todas las definiciones de rutas
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas con Layout */}
      <Route path={PUBLIC_ROUTES.HOME} element={<MainLayout><HomePage /></MainLayout>} />
      <Route path={PUBLIC_ROUTES.SEARCH} element={<MainLayout><SearchPage /></MainLayout>} />
      <Route path={PUBLIC_ROUTES.PET_DETAIL} element={<MainLayout><PetDetailPage /></MainLayout>} />
      
      {/* Rutas de Autenticación sin Layout (pantalla completa) */}
      <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Rutas Protegidas con Layout */}
      <Route
        path={PROTECTED_ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED_ROUTES.MY_REPORTS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED_ROUTES.PUBLISH_REPORT}
        element={
          <ProtectedRoute>
            <MainLayout>
              <PublishReportPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED_ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED_ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED_ROUTES.NOTIFICATIONS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 No Encontrada */}
      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<MainLayout><NotFoundPage /></MainLayout>} />
      
      {/* Captura todas las rutas - redirige a 404 */}
      <Route path="*" element={<Navigate to={PUBLIC_ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRouter;
