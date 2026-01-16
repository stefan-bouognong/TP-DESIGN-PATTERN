import api from './index.service';

export interface DocumentGenerateRequest {
  documentType: string;
  orderId: number;
  customData?: Record<string, string>;
}

export interface DocumentResponse {
  id: number;
  type: string;
  title: string;
  content: string;
  format: string;
  orderId: number;
  clientId: number;
  generatedAt: string;
  fileName: string;
}

export interface TemplateResponse {
  type: string;
  title: string;
  content: string;
  placeholders: Record<string, string>;
}

export const documentsService = {
  // Générer un document spécifique
  generateDocument: (data: DocumentGenerateRequest) => 
    api.post<DocumentResponse>('/documents/generate', data),

  // Générer la liasse complète
  generateBundle: (orderId: number) => 
    api.post<DocumentResponse[]>(`/documents/order/${orderId}/bundle`),

  // Obtenir les documents d'une commande
  getOrderDocuments: (orderId: number) => 
    api.get<DocumentResponse[]>(`/documents/order/${orderId}`),

  // Obtenir un template vierge
  getTemplate: (type: string) => 
    api.get<TemplateResponse>(`/documents/template/${type}`),
};