import React, { createContext, useContext, useState, useCallback } from 'react';
import { clientsService, registerAndLoginClient, ClientRequest, ClientResponse } from '../api/clients.service';
import { authService, AuthResponse } from '../api/auth.service';

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface IndividualProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  nationality: string;
  companyId?: null;
  vatNumber?: null;
  parentCompanyId?: null;
}

export interface CompanyProfile {
  companyId: string;
  name: string;
  phone: string;
  address: string;
  vatNumber: string;
  parentCompanyId?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  customerType: CustomerType;
  profile: IndividualProfile | CompanyProfile;
  createdAt: Date;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: ClientRequest) => Promise<boolean>;
  logout: () => void;
  parentCompanies: { id: string; name: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock parent companies
const mockParentCompanies = [
  { id: 'pc-1', name: 'Groupe Automobile France' },
  { id: 'pc-2', name: 'Fleet Solutions SA' },
  { id: 'pc-3', name: 'Transport Express SARL' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────── LOGIN ───────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Appel API login
      const response = await authService.login({ email, password });
      const { token } = response.data;

      // Stockage du token
      localStorage.setItem('token', token);

      // Récupérer les infos du client via l'API
      const clientResponse = await clientsService.getCompanyStructure(0).catch(() => null); // Optionnel si tu as endpoint profil
      const profile = clientResponse ? clientResponse.data : {}; // Adapter selon ton API

      setUser({
        id: 0, // Mettre ID réel si disponible
        email,
        customerType: 'INDIVIDUAL', // Adapter selon ton API
        profile: profile as IndividualProfile | CompanyProfile,
        createdAt: new Date(),
        token,
      });

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────── REGISTER ───────────────
  const register = useCallback(async (data: ClientRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Appel API pour créer le client + login automatique
      const { client, token } = await registerAndLoginClient(data);

      // Stockage token
      localStorage.setItem('token', token);

      // Créer l'objet user
      const profile =
        client.clientType === 'INDIVIDUAL'
          ? {
              firstName: client.firstName || '',
              lastName: client.lastName || '',
              phone: client.phone,
              address: client.address,
              nationality: client.nationality || '',
            }
          : {
              companyId: client.companyId || '',
              name: client.name,
              phone: client.phone,
              address: client.address,
              vatNumber: client.vatNumber || '',
              parentCompanyId: client.parentCompanyId || undefined,
            };

      setUser({
        id: client.id,
        email: client.email,
        customerType: client.clientType as CustomerType,
        profile,
        createdAt: new Date(),
        token,
      });

      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────── LOGOUT ───────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        parentCompanies: mockParentCompanies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
