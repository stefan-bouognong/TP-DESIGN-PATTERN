import api from './index.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminRegisterRequest {
  email: string;
  password: string;
  // Ajoutez d'autres champs si nécessaires
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  // Ajoutez d'autres champs selon votre réponse API
}

export const authService = {
  // Créer un admin
  registerAdmin: (data: AdminRegisterRequest) => 
    api.post('/auth/register-admin', data),

  // Login pour admin ou client
  login: (data: LoginRequest) => 
    api.post<AuthResponse>('/auth/login', data),

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};
