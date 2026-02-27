/**
 * Application Router Configuration
 * 
 * Centralized routing using React Router v6.
 * Organizes routes into public and protected categories.
 * 
 * Features:
 * - Public routes (accessible without authentication)
 * - Protected routes (require authentication)
 * - 404 Not Found page
 * - Clean route organization
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

// Protected Pages
import DashboardPage from './pages/user/DashboardPage';
import PublishReportPage from './pages/pet/PublishReportPage';

/**
 * NotFoundPage - Simple 404 page
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
    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Page not found</p>
    <a href={PUBLIC_ROUTES.HOME} style={{
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: 500,
    }}>
      Go back home
    </a>
  </div>
);

/**
 * MyReportsPage - Placeholder
 */
const MyReportsPage = () => (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <h1>My Reports</h1>
    <p style={{ color: '#6b7280' }}>View and manage your pet reports here</p>
  </div>
);

/**
 * ProfilePage - Placeholder
 */
const ProfilePage = () => (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <h1>Profile</h1>
    <p style={{ color: '#6b7280' }}>Manage your profile settings here</p>
  </div>
);

/**
 * AppRouter Component
 * Contains all route definitions
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path={PUBLIC_ROUTES.HOME} element={<MainLayout><HomePage /></MainLayout>} />
      <Route path={PUBLIC_ROUTES.SEARCH} element={<MainLayout><SearchPage /></MainLayout>} />
      
      {/* Auth Routes without Layout (full-screen) */}
      <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={PUBLIC_ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Protected Routes with Layout */}
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

      {/* 404 Not Found */}
      <Route path={PUBLIC_ROUTES.NOT_FOUND} element={<MainLayout><NotFoundPage /></MainLayout>} />
      
      {/* Catch all - redirect to 404 */}
      <Route path="*" element={<Navigate to={PUBLIC_ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRouter;
