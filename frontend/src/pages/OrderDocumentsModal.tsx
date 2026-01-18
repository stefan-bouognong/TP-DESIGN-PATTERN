import { FC, useEffect, useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/Modal';

import { documentsService } from '@/api/documents.service';
import { pdfService } from '@/api/pdf.service';
import { OrderDocument } from '@/types/document';

interface OrderDocumentsModalProps {
  orderId: number;
  onClose: () => void;
}

export const OrderDocumentsModal: FC<OrderDocumentsModalProps> = ({
  orderId,
  onClose,
}) => {
  const [documents, setDocuments] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  /* ─────────────── LOAD DOCUMENTS ─────────────── */

  useEffect(() => {
    documentsService
      .getOrderDocuments(orderId)
      .then(res => setDocuments(res.data))
      .finally(() => setLoading(false));
  }, [orderId]);

  /* ─────────────── DOWNLOAD FLOW ─────────────── */

  const handleDownload = async (doc: OrderDocument) => {
    try {
      setDownloadingId(doc.id);

      // 1️⃣ Convertir HTML → PDF
      if (doc.format !== 'PDF') {
        await pdfService.convertToPdf({
          documentId: doc.id,
          saveToDatabase: true,
        });
      }

      // 2️⃣ Télécharger le PDF
      const res = await pdfService.downloadPdf(doc.id);

      const blob = new Blob([res.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `${doc.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement PDF', error);
    } finally {
      setDownloadingId(null);
    }
  };

  /* ─────────────── RENDER ─────────────── */

  return (
    <>
      <ModalHeader>
        <h2 className="text-lg font-semibold">
          Documents de la commande #{orderId}
        </h2>
      </ModalHeader>

      <ModalBody>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun document disponible pour cette commande.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{doc.title}</span>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                    PDF
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={downloadingId === doc.id}
                  onClick={() => handleDownload(doc)}
                >
                  {downloadingId === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </ModalFooter>
    </>
  );
};
