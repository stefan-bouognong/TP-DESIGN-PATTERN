import { authService } from './auth.service';
import api from './index.service';

export interface ClientBase {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  clientType: 'INDIVIDUAL' | 'COMPANY';
}

export interface IndividualClient extends ClientBase {
  clientType: 'INDIVIDUAL';
  firstName: string;
  lastName: string;
  nationality: string;
  companyId?: null;
  vatNumber?: null;
  parentCompanyId?: null;
}

export interface CompanyClient extends ClientBase {
  clientType: 'COMPANY';
  companyId: string;
  vatNumber: string;
  parentCompanyId?: number;
  firstName?: null;
  lastName?: null;
  nationality?: null;
}

export type ClientRequest = IndividualClient | CompanyClient;

export interface ClientResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: string;
  firstName: string | null;
  lastName: string | null;
  nationality: string | null;
  companyId: string | null;
  vatNumber: string | null;
  parentCompanyId: number | null;
  fleetDiscount: number | null;
}

export interface CompanyStructure {
  companyId: number;
  companyName: string;
  email: string;
  totalSubsidiaries: number;
  fleetDiscount: number;
  subsidiaries: CompanyStructure[];
}

export const clientsService = {
  // Créer un client (individuel ou entreprise)
  createClient: (data: ClientRequest) => 
    api.post<ClientResponse>('/clients', data),

  // Ajouter une filiale à une société
  addSubsidiary: (parentId: number, data: Omit<CompanyClient, 'parentCompanyId'>) => 
    api.post<ClientResponse>(`/clients/company/${parentId}/add`, data),

  // Obtenir la structure hiérarchique
  getCompanyStructure: (id: number) => 
    api.get<CompanyStructure>(`/clients/${id}/structure`),

  // Lister les filiales directes
  getSubsidiaries: (parentId: number) => 
    api.get<ClientResponse[]>(`/clients/company/${parentId}/subsidiaries`),
};


export const registerAndLoginClient = async (
  data: ClientRequest
): Promise<{ client: ClientResponse; token: string }> => {
  try {
    // 1️ Créer le client
    const createResponse = await clientsService.createClient(data);
    const client = createResponse.data;

    // 2️ Se connecter directement avec email + password
    const loginResponse = await authService.login({
      email: data.email,
      password: data.password,
    });

    const token = loginResponse.data.token;

    // 3️ Stocker le token dans localStorage
    localStorage.setItem('token', token);

    //  Retourner client + token
    return { client, token };
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription et connexion du client :', error);
    throw error;
  }
};