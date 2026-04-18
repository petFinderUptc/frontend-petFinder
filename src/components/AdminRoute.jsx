import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROUTES } from '../constants/routes';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={PUBLIC_ROUTES.LOGIN} replace />;
  if (!isAdmin) return <Navigate to={PUBLIC_ROUTES.HOME} replace />;

  return children;
}
