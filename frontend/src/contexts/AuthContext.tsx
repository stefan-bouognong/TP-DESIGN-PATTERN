import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, getUserRole } from '@/lib/api';

/**
 * Types pour l'authentification
 */
export type UserRole = 'ADMIN' | 'CLIENT' | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  token: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

/**
 * Contexte d'authentification
 * 
 * Gère l'état d'authentification de l'utilisateur et son rôle.
 * Le rôle est stocké dans localStorage et synchronisé avec le token JWT.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification
 * 
 * Fournit le contexte d'authentification à toute l'application.
 * Initialise l'état depuis localStorage au démarrage.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialiser l'état depuis localStorage au démarrage
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedRole = getUserRole();

    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole as UserRole);
      setToken(storedToken);
    }
  }, []);

  /**
   * Connecter un utilisateur
   */
  const login = (newToken: string, newRole: string) => {
    setToken(newToken);
    setRole(newRole as UserRole);
    setIsAuthenticated(true);
  };

  /**
   * Déconnecter l'utilisateur
   */
  const logout = () => {
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
