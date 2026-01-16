import api from './index.service';

export interface PdfConvertRequest {
  documentId: number;
  saveToDatabase: boolean;
  customFileName?: string;
}

export interface PdfConvertResponse {
  documentId: number;
  originalTitle: string;
  pdfFileName: string;
  fileSize: number;
  downloadUrl: string;
  savedToDatabase: boolean;
}

export interface BatchConvertRequest {
  documentIds: number[];
  createZip: boolean;
}

export interface BatchConvertResponse {
  totalDocuments: number;
  successfulConversions: number;
  failedConversions: number;
  convertedDocuments: PdfConvertResponse[];
  zipDownloadUrl: string | null;
}

export interface PdfStatusResponse {
  status: string;
}

export const pdfService = {
  // Convertir un document HTML en PDF
  convertToPdf: (data: PdfConvertRequest) => 
    api.post<PdfConvertResponse>('/pdf/convert', data),

  // Télécharger le PDF généré
  downloadPdf: (documentId: number) => 
    api.get(`/pdf/download/${documentId}`, { responseType: 'blob' }),

  // Prévisualiser le PDF
  previewPdf: (documentId: number) => 
    api.get(`/pdf/preview/${documentId}`, { responseType: 'blob' }),

  // Convertir plusieurs documents en batch
  batchConvert: (data: BatchConvertRequest) => 
    api.post<BatchConvertResponse>('/pdf/convert/batch', data),

  // Convertir tous les documents d'une commande
  convertOrderDocuments: (orderId: number) => 
    api.post(`/pdf/convert/order/${orderId}`),

  // Vérifier le statut d'un document
  getPdfStatus: (documentId: number) => 
    api.get<PdfStatusResponse>(`/pdf/status/${documentId}`),
};