import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockVehicles as initialVehicles } from '@/data/mockVehicles';
import { Vehicle } from '@/types/vehicle';
import { Search, Tag, Clock, Percent, Zap, Fuel, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPromotions() {
  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [promotionPercent, setPromotionPercent] = useState([10]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter vehicles that are eligible for promotion (long in stock or already in promotion)
  const eligibleVehicles = vehicles.filter(v => 
    v.status === 'available' && (v.daysInStock >= 30 || v.isPromotion)
  );

  const filteredVehicles = eligibleVehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const activePromotions = vehicles.filter(v => v.isPromotion).length;
  const longInStock = vehicles.filter(v => v.daysInStock > 60 && !v.isPromotion && v.status === 'available').length;
  const potentialSavings = vehicles
    .filter(v => v.daysInStock > 60 && !v.isPromotion)
    .reduce((acc, v) => acc + v.price * 0.1, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);

  const openPromotionDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setPromotionPercent([vehicle.promotionPercentage || 10]);
    setIsDialogOpen(true);
  };

  const applyPromotion = () => {
    if (!selectedVehicle) return;

    const updatedVehicles = vehicles.map(v => {
      if (v.id === selectedVehicle.id) {
        const discount = promotionPercent[0] / 100;
        const originalPrice = v.originalPrice || v.price;
        const newPrice = Math.round(originalPrice * (1 - discount));
        
        return {
          ...v,
          isPromotion: true,
          promotionPercentage: promotionPercent[0],
          originalPrice: originalPrice,
          price: newPrice,
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    setIsDialogOpen(false);
    toast.success(`Promotion de ${promotionPercent[0]}% appliquée sur ${selectedVehicle.name}`);
  };

  const removePromotion = (vehicleId: string) => {
    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId && v.isPromotion) {
        return {
          ...v,
          isPromotion: false,
          promotionPercentage: undefined,
          price: v.originalPrice || v.price,
          originalPrice: undefined,
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    toast.success('Promotion retirée');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Gestion des promotions</h1>
          <p className="text-muted-foreground">
            Gérez les promotions et soldez les véhicules restés longtemps en stock.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                Promotions actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{activePromotions}</span>
              <p className="text-xs text-muted-foreground mt-1">véhicules en promotion</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Stock ancien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{longInStock}</span>
              <p className="text-xs text-muted-foreground mt-1">véhicules +60 jours sans promo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Percent className="h-4 w-4 text-success" />
                Économies potentielles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{formatPrice(potentialSavings)}</span>
              <p className="text-xs text-muted-foreground mt-1">avec 10% de réduction</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un véhicule éligible..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Info banner */}
        <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">💡 Conseil :</strong> Les véhicules affichés ici sont soit déjà en promotion, 
            soit en stock depuis plus de 30 jours. Les véhicules de plus de 60 jours sont marqués en priorité.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix actuel</TableHead>
                <TableHead>Jours en stock</TableHead>
                <TableHead>Statut promo</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun véhicule éligible aux promotions
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className={vehicle.daysInStock > 60 && !vehicle.isPromotion ? 'bg-warning/5' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.name}
                          className="h-12 w-16 rounded-lg object-cover bg-muted"
                        />
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          {vehicle.type === 'automobile' ? 'Auto' : 'Scooter'}
                        </Badge>
                        <Badge variant="outline" className="w-fit gap-1">
                          {vehicle.fuelType === 'electric' ? (
                            <><Zap className="h-3 w-3" /> Élec.</>
                          ) : (
                            <><Fuel className="h-3 w-3" /> Essence</>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {vehicle.isPromotion && vehicle.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through block">
                            {formatPrice(vehicle.originalPrice)}
                          </span>
                        )}
                        <span className={`font-medium ${vehicle.isPromotion ? 'text-accent' : ''}`}>
                          {formatPrice(vehicle.price)}
                        </span>
                        {vehicle.isPromotion && (
                          <Badge className="ml-2 bg-accent text-accent-foreground">
                            -{vehicle.promotionPercentage}%
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={vehicle.daysInStock > 60 ? 'text-warning font-medium' : ''}>
                          {vehicle.daysInStock} jours
                        </span>
                        {vehicle.daysInStock > 60 && (
                          <Badge variant="outline" className="text-warning border-warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Prioritaire
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.isPromotion ? (
                        <Badge className="bg-success text-success-foreground gap-1">
                          <CheckCircle className="h-3 w-3" />
                          En promotion
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Sans promotion
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {vehicle.isPromotion ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openPromotionDialog(vehicle)}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removePromotion(vehicle.id)}
                            >
                              Retirer
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="hero" 
                            size="sm"
                            onClick={() => openPromotionDialog(vehicle)}
                          >
                            <Tag className="h-4 w-4 mr-1" />
                            Appliquer promo
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Promotion Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedVehicle?.isPromotion ? 'Modifier la promotion' : 'Appliquer une promotion'}
              </DialogTitle>
              <DialogDescription>
                Définissez le pourcentage de réduction pour {selectedVehicle?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                  <img
                    src={selectedVehicle.images[0]}
                    alt={selectedVehicle.name}
                    className="h-16 w-20 rounded-lg object-cover bg-muted"
                  />
                  <div>
                    <p className="font-medium">{selectedVehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Prix original: {formatPrice(selectedVehicle.originalPrice || selectedVehicle.price)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Pourcentage de réduction</label>
                    <span className="text-2xl font-bold text-accent">{promotionPercent[0]}%</span>
                  </div>
                  <Slider
                    value={promotionPercent}
                    onValueChange={setPromotionPercent}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nouveau prix</span>
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(
                        Math.round((selectedVehicle.originalPrice || selectedVehicle.price) * (1 - promotionPercent[0] / 100))
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Économie client: {formatPrice(
                      Math.round((selectedVehicle.originalPrice || selectedVehicle.price) * (promotionPercent[0] / 100))
                    )}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="hero" onClick={applyPromotion}>
                <Tag className="h-4 w-4 mr-2" />
                Appliquer la promotion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
