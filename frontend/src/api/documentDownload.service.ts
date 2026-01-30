import api from "./index.service";


export const documentDownloadService = {
    // Download a document
    downloadDocument: (orderId: number, type: string) => {
        return api.get(`/orders/${orderId}/documents/${type}`);
    },
    downloadPdf: (documentId: number) => {
        return api.get(`/orders/${orderId}/documents/${type}/pdf`);
    }
}