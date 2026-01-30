import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Vehicle } from '@/types/vehicle';
import { Search, Tag, Clock, Percent, Zap, Fuel, CheckCircle, XCircle, AlertCircle, ZapIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { vehiclesService } from '@/api/vehicles.service';
import { promotionsService } from '@/api/promotions.service';

interface DatabaseVehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  vehicle_type: string;
  fuel_type: string;
  price: number;
  image_url: string;
  description: string;
  year: number;
  available: boolean;
  on_sale: boolean;
  created_at: string;
  // ... autres champs
}

export default function AdminPromotions() {
  const [search, setSearch] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [promotionPercent, setPromotionPercent] = useState([10]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // État pour la commande de clearance
  const [daysThreshold, setDaysThreshold] = useState(10);
  const [clearanceDiscount, setClearanceDiscount] = useState([20]);
  const [applyingClearance, setApplyingClearance] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Chargement initial des véhicules
  useEffect(() => {
    loadVehicles();
  }, []);

  // Fonction pour transformer les données de la BD vers le format frontend
  const transformDbVehicleToFrontend = (dbVehicle: DatabaseVehicle): Vehicle => {
    // Calcule les jours en stock à partir de created_at
    const createdAt = new Date(dbVehicle.created_at);
    const now = new Date();
    const daysInStock = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Détermine le type de véhicule
    const type = dbVehicle.vehicle_type.includes('CAR') ? 'automobile' : 'scooter';
    
    // Détermine le type de carburant
    const fuelType = dbVehicle.fuel_type === 'Electric' || dbVehicle.fuel_type === 'ELECTRIC' ? 'electric' : 'gasoline';
    
    return {
      id: dbVehicle.id.toString(),
      name: dbVehicle.name,
      brand: dbVehicle.brand,
      model: dbVehicle.model,
      type: type,
      fuelType: fuelType,
      price: dbVehicle.price,
      imageUrl: dbVehicle.image_url,
      images: dbVehicle.image_url ? [dbVehicle.image_url] : [],
      description: dbVehicle.description,
      year: dbVehicle.year,
      status: dbVehicle.available ? 'available' : 'sold',
      isPromotion: dbVehicle.on_sale,
      daysInStock: daysInStock,
      promotionPercentage: dbVehicle.on_sale ? 20 : undefined, // À ajuster selon votre logique
      originalPrice: dbVehicle.on_sale ? dbVehicle.price * 1.25 : dbVehicle.price, // Exemple
    };
  };

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehiclesService.getAllVehicles();
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Transforme les données si elles viennent directement de la BD
      const transformedVehicles = data.map((vehicle: any) => {
        // Si les données sont déjà dans le format frontend, on les utilise telles quelles
        if (vehicle.status !== undefined && vehicle.daysInStock !== undefined) {
          return vehicle;
        }
        // Sinon, on transforme depuis le format BD
        return transformDbVehicleToFrontend(vehicle);
      });
      
      console.log('Véhicules transformés:', transformedVehicles);
      transformedVehicles.forEach((v, i) => {
        console.log(`Véhicule ${i}: ${v.name}, jours: ${v.daysInStock}, statut: ${v.status}, promo: ${v.isPromotion}`);
      });
      
      setVehicles(transformedVehicles);
    } catch (err) {
      console.error('Erreur chargement véhicules:', err);
      toast.error('Impossible de charger les véhicules');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Véhicules éligibles : disponibles et (en stock ≥ 5 jours OU déjà en promotion)
  const eligibleVehicles = vehicles.filter((v) => {
    const isAvailable = v.status === 'available';
    const days = v.daysInStock || 0;
    const isOldEnough = days >= daysThreshold;
    const alreadyOnPromotion = v.isPromotion === true;
    
    return isAvailable && (isOldEnough || alreadyOnPromotion);
  });

  const filteredVehicles = eligibleVehicles.filter((v) =>
    `${v.name || ''} ${v.brand || ''} ${v.model || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const activePromotions = vehicles.filter((v) => v.isPromotion === true).length;
  const longInStock = vehicles.filter(
    (v) => (v.daysInStock || 0) > 60 && !v.isPromotion && v.status === 'available'
  ).length;

  const potentialSavings = vehicles
    .filter((v) => (v.daysInStock || 0) > 60 && !v.isPromotion && v.status === 'available')
    .reduce((acc, v) => acc + (v.price || 0) * 0.1, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price || 0);

  const openPromotionDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setPromotionPercent([vehicle.promotionPercentage || 10]);
    setIsDialogOpen(true);
  };

  const applyPromotion = async () => {
    if (!selectedVehicle) return;

    try {
      // Appel API pour appliquer la promotion
      // Note: Vous devrez ajuster l'endpoint pour qu'il mette à jour on_sale dans la BD
      await promotionsService.applyPromotionToVehicle(
        selectedVehicle.id,
        promotionPercent[0] / 100
      );

      // Recharger les données
      await loadVehicles();
      
      setIsDialogOpen(false);
      toast.success(
        `Promotion de ${promotionPercent[0]}% appliquée sur ${selectedVehicle.name}`
      );
    } catch (error: any) {
      console.error('Erreur application promotion:', error);
      toast.error('Erreur lors de l\'application de la promotion', {
        description: error.response?.data?.message || 'Veuillez réessayer'
      });
    }
  };

  const removePromotion = async (vehicleId: string) => {
    try {
      // Appel API pour retirer la promotion
      await promotionsService.removePromotionFromVehicle(vehicleId);
      
      // Recharger les données
      await loadVehicles();
      
      toast.success('Promotion retirée avec succès');
    } catch (error: any) {
      console.error('Erreur retrait promotion:', error);
      toast.error('Erreur lors du retrait de la promotion', {
        description: error.response?.data?.message || 'Veuillez réessayer'
      });
    }
  };

  const handleApplyClearance = async () => {
    try {
      setApplyingClearance(true);
      const response = await promotionsService.applyClearance(daysThreshold, clearanceDiscount[0] / 100);
      
      toast.success(
        `Solde appliquée avec succès aux véhicules de plus de ${daysThreshold} jours`,
        {
          description: response.message || `Remise de ${clearanceDiscount[0]}% appliquée`
        }
      );

      // Recharger les véhicules
      await loadVehicles();
    } catch (error: any) {
      console.error('Erreur lors de la clearance:', error);
      toast.error(
        'Erreur lors de l\'application de la solde',
        {
          description: error.response?.data?.message || 'Veuillez réessayer'
        }
      );
    } finally {
      setApplyingClearance(false);
    }
  };

  const refreshVehicles = async () => {
    await loadVehicles();
    toast.info('Liste des véhicules mise à jour');
  };

  // Statistiques de débogage
  const debugStats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'available').length,
    vehiclesWithDaysInStock: vehicles.filter(v => v.daysInStock !== undefined && v.daysInStock !== null).length,
    vehiclesOver5Days: vehicles.filter(v => (v.daysInStock || 0) >= 10).length,
    vehiclesOnPromotion: activePromotions,
    eligibleCount: eligibleVehicles.length,
    oldestVehicle: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.daysInStock || 0)) : 0
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Chargement des véhicules...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-bold">Gestion des promotions</h1>
            <p className="text-muted-foreground">
              Gérez les promotions et soldez les véhicules restés longtemps en stock.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshVehicles}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Debug
            </Button>
          </div>
        </div>

        {/* Panel de débogage */}
        {showDebug && (
          <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
            <h3 className="font-medium mb-2">Informations de débogage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total véhicules:</span>
                <span className="ml-2 font-medium">{debugStats.totalVehicles}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Disponibles:</span>
                <span className="ml-2 font-medium">{debugStats.availableVehicles}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avec jours calculés:</span>
                <span className="ml-2 font-medium">{debugStats.vehiclesWithDaysInStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">≥ {daysThreshold} jours:</span>
                <span className="ml-2 font-medium">{debugStats.vehiclesOver5Days}</span>
              </div>
              <div>
                <span className="text-muted-foreground">En promotion:</span>
                <span className="ml-2 font-medium">{debugStats.vehiclesOnPromotion}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Éligibles:</span>
                <span className="ml-2 font-medium">{debugStats.eligibleCount}</span>
              </div>
              <div className="col-span-2 md:col-span-3">
                <span className="text-muted-foreground">Plus ancien véhicule:</span>
                <span className="ml-2 font-medium">{debugStats.oldestVehicle} jours</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded border">
              <p className="text-xs font-mono">
                <strong>Transformation appliquée:</strong> available → status, on_sale → isPromotion, created_at → daysInStock
              </p>
            </div>
          </div>
        )}

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
              <p className="text-xs text-muted-foreground mt-1">véhicules en promotion (on_sale = true)</p>
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

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="manual">Promotions manuelles</TabsTrigger>
            <TabsTrigger value="automatic">Clearance automatique</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
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
                <strong className="text-foreground">💡 Conseil :</strong> Les véhicules affichés ici sont soit déjà en promotion (on_sale = true),
                soit en stock depuis plus de {daysThreshold} jours (calculé depuis created_at). Les véhicules de plus de 60 jours sont marqués en priorité.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Affichage de {filteredVehicles.length} véhicule(s) sur {eligibleVehicles.length} éligible(s)
              </p>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Type/Carburant</TableHead>
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
                        {eligibleVehicles.length === 0 ? (
                          <div className="space-y-2">
                            <p>Aucun véhicule éligible aux promotions</p>
                            <p className="text-xs">
                              Vérifiez que les véhicules sont "available" et ont daysInStock ≥ {daysThreshold} ou on_sale = true
                            </p>
                            <p className="text-xs">
                              Données actuelles: {vehicles.length} véhicule(s) chargé(s), {debugStats.availableVehicles} disponible(s)
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p>Aucun véhicule ne correspond à la recherche</p>
                            <p className="text-xs">
                              {eligibleVehicles.length} véhicule(s) éligible(s) mais filtré(s) par la recherche
                            </p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow
                        key={vehicle.id}
                        className={(vehicle.daysInStock || 0) > 60 && !vehicle.isPromotion ? 'bg-warning/5' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={vehicle.imageUrl || '/placeholder-vehicle.jpg'}
                              alt={vehicle.name}
                              className="h-12 w-16 rounded-lg object-cover bg-muted"
                            />
                            <div>
                              <p className="font-medium">{vehicle.name}</p>
                              <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                              <p className="text-xs text-muted-foreground">ID: {vehicle.id}</p>
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
                              {formatPrice(vehicle.price || 0)}
                            </span>
                            {vehicle.isPromotion && (
                              <Badge className="ml-2 bg-accent text-accent-foreground">
                                -{vehicle.promotionPercentage || 20}%
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={(vehicle.daysInStock || 0) > 60 ? 'text-warning font-medium' : ''}>
                              {vehicle.daysInStock || 0} jours
                            </span>
                            {(vehicle.daysInStock || 0) > 60 && !vehicle.isPromotion && (
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
          </TabsContent>

          <TabsContent value="automatic">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ZapIcon className="h-5 w-5 text-accent" />
                    Commande de Clearance
                  </CardTitle>
                  <CardDescription>
                    Appliquez automatiquement des promotions aux véhicules restés longtemps en stock
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Cette action appliquera une réduction à tous les véhicules disponibles en stock depuis plus de X jours.
                      Utilisez "days: 0" pour cibler tous les véhicules disponibles.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="days" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Seuil d'ancienneté (jours)
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="days"
                          type="number"
                          min="0"
                          max="365"
                          value={daysThreshold}
                          onChange={(e) => setDaysThreshold(Number(e.target.value))}
                          className="max-w-[150px]"
                        />
                        <span className="text-sm text-muted-foreground">
                          {daysThreshold === 0 
                            ? "Cible TOUS les véhicules disponibles (days: 0)" 
                            : `Cible les véhicules de plus de ${daysThreshold} jours en stock`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="discount" className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Taux de réduction
                        </Label>
                        <span className="text-2xl font-bold text-accent">{clearanceDiscount[0]}%</span>
                      </div>
                      
                      <Slider
                        value={clearanceDiscount}
                        onValueChange={setClearanceDiscount}
                        max={50}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>5%</span>
                        <span>25%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <h4 className="font-medium mb-2">Résumé de l'action</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• S'applique aux véhicules disponibles {daysThreshold === 0 ? "tous" : `de plus de ${daysThreshold} jours`}</li>
                        <li>• Réduction de {clearanceDiscount[0]}% sur le prix original</li>
                        <li>• Marque les véhicules comme "en promotion" (on_sale: true)</li>
                        <li>• Modification immédiate du prix de vente</li>
                        <li className="text-warning">• Action irréversible via cette interface</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Exemple d'utilisation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pour tester rapidement :<br/>
                        • Mettez <code className="bg-muted px-1 rounded">days: 0</code> et <code className="bg-muted px-1 rounded">discount: 0.2</code><br/>
                        • Cela appliquera 20% de réduction à tous les véhicules disponibles
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleApplyClearance}
                    disabled={applyingClearance}
                    variant="hero"
                    className="w-full"
                  >
                    {applyingClearance ? (
                      <>Application en cours...</>
                    ) : (
                      <>
                        <ZapIcon className="h-4 w-4 mr-2" />
                        Appliquer la solde de {clearanceDiscount[0]}%
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={refreshVehicles}
                    variant="outline"
                    className="w-full"
                  >
                    Rafraîchir la liste des véhicules
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Promotion Dialog (pour modifications individuelles) */}
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
                    src={selectedVehicle.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={selectedVehicle.name}
                    className="h-16 w-20 rounded-lg object-cover bg-muted"
                  />
                  <div>
                    <p className="font-medium">{selectedVehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Prix original: {formatPrice(selectedVehicle.originalPrice || selectedVehicle.price || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      En stock depuis: {selectedVehicle.daysInStock || 0} jours (créé le: {
                        selectedVehicle.daysInStock 
                          ? new Date(Date.now() - (selectedVehicle.daysInStock * 24 * 60 * 60 * 1000)).toLocaleDateString()
                          : 'N/A'
                      })
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
                        Math.round(
                          (selectedVehicle.originalPrice || selectedVehicle.price || 0) *
                            (1 - promotionPercent[0] / 100)
                        )
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Économie client:{' '}
                    {formatPrice(
                      Math.round(
                        (selectedVehicle.originalPrice || selectedVehicle.price || 0) *
                          (promotionPercent[0] / 100)
                      )
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
                {selectedVehicle?.isPromotion ? 'Mettre à jour' : 'Appliquer la promotion'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}