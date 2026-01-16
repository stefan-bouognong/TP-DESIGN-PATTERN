import api from './index.service';

export interface BundleRequest {
  orderId: number;
  bundleType?: string;
}

export interface BundleResponse {
  orderId: number;
  clientId: number;
  bundleName: string;
  documentCount: number;
  completed: boolean;
  downloadPath: string | null;
  documentTypes: string[];
}

export const documentBundlesService = {
  // Créer une liasse complète
  createCompleteBundle: (data: BundleRequest) => 
    api.post<BundleResponse>('/document-bundles/complete', data),

  // Créer une liasse minimale
  createMinimalBundle: (data: BundleRequest) => 
    api.post<BundleResponse>('/document-bundles/minimal', data),

  // Créer une liasse d'immatriculation
  createRegistrationBundle: (orderId: number) => 
    api.post<BundleResponse>('/document-bundles/registration', { orderId }),

  // Obtenir les infos d'une liasse existante
  getBundleInfo: (orderId: number) => 
    api.get<BundleResponse>(`/document-bundles/order/${orderId}`),

  // Générer le téléchargement
  generateDownload: (orderId: number) => 
    api.post<string>(`/document-bundles/${orderId}/download`),
};