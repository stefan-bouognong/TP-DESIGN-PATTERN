import { AdminLayout } from '@/components/layout/AdminLayout';

export default function AdminDocuments() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold mb-2">Gestion des documents</h1>
        <p className="text-muted-foreground">
          Générez et gérez les documents de vente (bons de commande, certificats, etc.).
        </p>
        
        <div className="mt-8 p-8 rounded-xl border border-dashed border-border flex items-center justify-center">
          <p className="text-muted-foreground">Section en cours de développement</p>
        </div>
      </div>
    </AdminLayout>
  );
}
