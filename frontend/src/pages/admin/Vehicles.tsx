// AdminVehicles.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { vehiclesService } from '@/api/vehicles.service'; // ← ton service
import { Vehicle } from '@/types/vehicle';
import { VehicleForm } from '@/components/admin/VehicleForm';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesService.getAllVehicles();
      // Sécurité supplémentaire : on s'assure que c'est un tableau
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Véhicules chargés:', data);
      setVehicles(data);
    } catch (err) {
      console.error('Erreur chargement véhicules:', err);
      toast.error('Impossible de charger les véhicules');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (data: any) => {
    try {
      await vehiclesService.createVehicle(data);
      toast.success('Véhicule créé');
      setDialogOpen(false);
      loadVehicles();
    } catch (err) {
      toast.error('Échec de la création');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;

    try {
      await vehiclesService.deleteVehicle(id);
      toast.success('Véhicule supprimé');
      loadVehicles();
    } catch (err) {
      toast.error('Échec de la suppression');
      console.error(err);
    }
  };

  // Filtrage protégé
  const filtered = (vehicles ?? []).filter((v) =>
    `${v.name} ${v.brand ?? ''} ${v.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Véhicules</h1>
            <p className="text-muted-foreground">{vehicles.length} véhicule(s)</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau véhicule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau véhicule</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour ajouter un véhicule au catalogue.
                </DialogDescription>
              </DialogHeader>
              <VehicleForm
                onSubmit={handleAddVehicle}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, marque, modèle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement des véhicules...</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {v.brand || '—'} {v.model}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {v.vehicleType === 'CAR' ? 'Voiture' : 'Scooter'}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {v.energyType === 'ELECTRIC' ? 'Électrique' : 'Essence'}
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(v.price)}</TableCell>
                    <TableCell>{v.year}</TableCell>
                    <TableCell>
                      <Badge variant={v.available ? 'default' : 'secondary'}>
                        {v.available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                      {v.onSale && (
                        <Badge className="ml-2 bg-amber-600">En vente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(v.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Aucun véhicule trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}