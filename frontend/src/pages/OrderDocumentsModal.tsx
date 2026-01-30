import { FC, useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/Modal';

import { documentDownloadService } from '@/api/documentDownload.service';

interface OrderDocumentsModalProps {
  orderId: number;
  onClose: () => void;
}

const STATIC_DOCUMENTS = [
  { label: 'Bon de commande', type: 'BON_COMMANDE' },
  { label: 'Demande d’immatriculation', type: 'DEMANDE_IMMATRICULATION' },
  { label: 'Certificat de cession', type: 'CERTIFICAT_CESSION' },
];

export const OrderDocumentsModal: FC<OrderDocumentsModalProps> = ({
  orderId,
  onClose,
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  /* ─────────────── DOWNLOAD ─────────────── */

  const downloadFile = async (
    type: string,
    format: 'html' | 'pdf',
    label: string
  ) => {
    try {
      setDownloading(`${type}-${format}`);

      const response =
        format === 'html'
          ? await documentDownloadService.downloadDocument(orderId, type)
          : await documentDownloadService.downloadPdf(orderId, type);

      const mime =
        format === 'html' ? 'text/html' : 'application/pdf';

      const blob = new Blob([response.data], { type: mime });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${label.replace(/\s+/g, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement', err);
    } finally {
      setDownloading(null);
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
        <div className="space-y-3">
          {STATIC_DOCUMENTS.map(doc => (
            <div
              key={doc.type}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{doc.label}</span>
              </div>

              <div className="flex gap-2">
                {/* HTML */}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={downloading === `${doc.type}-html`}
                  onClick={() =>
                    downloadFile(doc.type, 'html', doc.label)
                  }
                >
                  {downloading === `${doc.type}-html` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      HTML
                    </>
                  )}
                </Button>

                {/* PDF */}
                <Button
                  size="sm"
                  disabled={downloading === `${doc.type}-pdf`}
                  onClick={() =>
                    downloadFile(doc.type, 'pdf', doc.label)
                  }
                >
                  {downloading === `${doc.type}-pdf` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </ModalFooter>
    </>
  );
};
