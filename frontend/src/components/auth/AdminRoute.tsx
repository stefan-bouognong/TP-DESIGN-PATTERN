import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

/**
 * Composant pour protéger les routes réservées aux administrateurs
 * 
 * Redirige vers la page d'accueil si l'utilisateur n'est pas admin.
 * Affiche un message d'erreur si un client tente d'accéder.
 */
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast({
        title: 'Accès refusé',
        description: 'Cette page est réservée aux administrateurs.',
        variant: 'destructive',
      });
    }
  }, [isAuthenticated, isAdmin, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
