import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Fuel, Eye } from 'lucide-react';

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/contexts/CartContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  view?: 'grid' | 'list';
}

export function VehicleCard({ vehicle, view = 'grid' }: VehicleCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);


  const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(price);
};
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(vehicle);
  };

  const isElectric = vehicle.fuelType === 'electric';
  const isScooter = vehicle.type === 'scooter';

  if (view === 'list') {
    return (
      <Link
        to={`/vehicle/${vehicle.id}`}
        className="group flex gap-6 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-card-hover hover:border-accent/30"
      >
        {/* Image */}
        <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
          <img
            // src={vehicle.images[0]}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {vehicle.isPromotion && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
              -{vehicle.promotionPercentage}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {isScooter ? 'Scooter' : 'Auto'}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", isElectric && "border-success text-success")}>
                {isElectric ? <><Zap className="h-3 w-3 mr-1" />Électrique</> : <><Fuel className="h-3 w-3 mr-1" />Essence</>}
              </Badge>
            </div>
            <h3 className="font-display text-lg font-semibold">{vehicle.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              {vehicle.originalPrice && (
                <span className="text-sm text-muted-foreground line-through mr-2">
                  {formatPrice(vehicle.originalPrice)}
                </span>
              )}
              <span className="font-display text-xl font-bold text-accent">
                {formatPrice(vehicle.price)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <span><Eye className="h-4 w-4" /></span>
              </Button>
              <Button variant="hero" size="sm" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/vehicle/${vehicle.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-accent/30 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          // src={vehicle.images[0]}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.isPromotion && (
            <Badge className="bg-accent text-accent-foreground shadow-lg">
              -{vehicle.promotionPercentage}%
            </Badge>
          )}
          {vehicle.status === 'reserved' && (
            <Badge variant="secondary">Réservé</Badge>
          )}
          {vehicle.daysInStock > 60 && !vehicle.isPromotion && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              À saisir
            </Badge>
          )}
        </div>

        {/* Type badges */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground">
            {isScooter ? 'Scooter' : 'Auto'}
          </Badge>
          <Badge 
            variant="secondary" 
            className={cn(
              "backdrop-blur-sm",
              isElectric 
                ? "bg-success/90 text-success-foreground" 
                : "bg-background/90 text-foreground"
            )}
          >
            {isElectric ? <Zap className="h-3 w-3 mr-1" /> : <Fuel className="h-3 w-3 mr-1" />}
            {isElectric ? 'Électrique' : 'Essence'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{vehicle.brand}</p>
          <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
            {vehicle.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{vehicle.year}</span>
            <span>•</span>
            <span>{vehicle.power} ch</span>
            <span>•</span>
            <span>{vehicle.transmission === 'automatic' ? 'Auto' : 'Manuelle'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            {vehicle.originalPrice && (
              <span className="text-sm text-muted-foreground line-through block">
                {formatPrice(vehicle.originalPrice)}
              </span>
            )}
            <span className="font-display text-xl font-bold text-accent">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          <Button 
            variant="hero" 
            size="sm" 
            onClick={handleAddToCart}
            disabled={vehicle.status !== 'available'}
          >
            <ShoppingCart className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </Link>
  );
}
