import { useAuthContext, UserRole } from '@/contexts/AuthContext';

/**
 * Hook personnalisé pour utiliser l'authentification
 * 
 * Fournit un accès facile au contexte d'authentification avec des helpers pratiques.
 * 
 * @example
 * const { isAuthenticated, role, isAdmin, isClient, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useAuthContext();

  /**
   * Vérifie si l'utilisateur est un administrateur
   */
  const isAdmin = context.role === 'ADMIN';

  /**
   * Vérifie si l'utilisateur est un client
   */
  const isClient = context.role === 'CLIENT';

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (requiredRole: UserRole) => {
    return context.role === requiredRole;
  };

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  const hasAnyRole = (roles: UserRole[]) => {
    return roles.includes(context.role);
  };

  return {
    ...context,
    isAdmin,
    isClient,
    hasRole,
    hasAnyRole,
  };
};
