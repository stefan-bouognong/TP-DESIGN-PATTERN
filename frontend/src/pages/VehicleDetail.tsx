import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { vehiclesService, VehicleResponse } from '@/api/vehicles.service';
import {
  ShoppingCart,
  Zap,
  ArrowLeft,
  Calendar,
  Gauge,
  Battery,
  DoorOpen,
  Sun,
  Palette,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Si tu as un type VehicleOption, garde-le ; sinon on le commente pour l'instant
// interface VehicleOption { ... }

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await vehiclesService.getVehicle(Number(id));
        console.log('Détails du véhicule:', response.data);
        setVehicle(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || "Impossible de charger les détails du véhicule"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (!id || error) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-6 text-destructive">
            {error || "Véhicule non trouvé"}
          </h1>
          <Button asChild>
            <Link to="/catalog">Retour au catalogue</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (loading || !vehicle) {
    return (
      <Layout>
        <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <p className="text-muted-foreground">Chargement du véhicule...</p>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);

  const isElectric = vehicle.type?.toLowerCase().includes('electric') ?? true; // vu que c'est ELECTRICCAR

  // Specs dynamiques selon les données disponibles
  const specs = [
    { icon: Calendar, label: 'Année', value: vehicle.year?.toString() || '—' },
    { icon: Palette, label: 'Couleur', value: vehicle.color || '—' },
    { icon: DoorOpen, label: 'Portes', value: vehicle.doors ? `${vehicle.doors}` : '—' },
    {
      icon: Gauge,
      label: 'Autonomie',
      value: vehicle.range ? `${vehicle.range} km` : '—',
    },
    {
      icon: Battery,
      label: 'Batterie',
      value: vehicle.batteryCapacity ? `${vehicle.batteryCapacity} kWh` : '—',
    },
    {
      icon: Sun,
      label: 'Toit ouvrant',
      value: vehicle.hasSunroof ? 'Oui' : 'Non',
    },
    // Ajoute d'autres si tu les ajoutes plus tard (maxSpeed, transmission, etc.)
    { icon: Gauge, label: 'Vitesse max', value: vehicle.maxSpeed ? `${vehicle.maxSpeed} km/h` : '—' },
  ].filter(spec => spec.value !== '—' || spec.label.includes('Toit')); // garde le toit même si Non

  return (
    <Layout>
      <div className="container py-6 md:py-10">
        {/* Retour */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link to="/catalog" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Image + badges */}
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] md:aspect-[5/4] shadow-lg">
            <img
              src="/placeholder-electric-car-red.jpg" // ← remplace par une vraie URL quand tu auras des images
              alt={`${vehicle.brand || 'Véhicule'} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {vehicle.onSale && (
                <Badge className="bg-red-600 text-white shadow-md px-3 py-1 text-base font-medium">
                  En promotion
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={cn(
                  "backdrop-blur-md shadow-md px-3 py-1 text-sm font-medium",
                  isElectric
                    ? "bg-emerald-600/90 text-white"
                    : "bg-amber-600/90 text-white"
                )}
              >
                {isElectric ? (
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <Zap className="h-3.5 w-3.5 mr-1.5" /> // fallback essence → à affiner
                )}
                {isElectric ? 'Électrique' : 'Thermique'}
              </Badge>
              {vehicle.available && (
                <Badge className="bg-emerald-600 text-white shadow-md px-3 py-1 text-sm">
                  Disponible
                </Badge>
              )}
            </div>
          </div>

          {/* Détails */}
          <div className="flex flex-col">
            <div className="mb-2 text-muted-foreground">
              {vehicle.brand || 'Marque non spécifiée'}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              {vehicle.name || `${vehicle.brand || ''} ${vehicle.model || 'Modèle inconnu'}`.trim() || 'Véhicule Électrique'}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {vehicle.description || 'Aucune description disponible pour le moment.'}
            </p>

            {/* Caractéristiques clés */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col items-start p-4 rounded-xl bg-secondary/40 border"
                >
                  <spec.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="text-xs text-muted-foreground">{spec.label}</div>
                  <div className="font-medium">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Prix + CTA */}
            <div className="mt-auto p-6 rounded-2xl bg-secondary/50 border">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {formatPrice(vehicle.price)}
                  </div>
                </div>

                <Badge
                  className={cn(
                    "text-base px-4 py-1.5",
                    vehicle.available
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  )}
                >
                  {vehicle.available ? 'Disponible' : 'Indisponible'}
                </Badge>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-base bg-accent"
                onClick={() => addToCart(vehicle, [])} // options vides pour l'instant
                disabled={!vehicle.available}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                {vehicle.available ? 'Ajouter au panier' : 'Indisponible'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}