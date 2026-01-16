import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Composant pour protéger les routes nécessitant une authentification
 * 
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
