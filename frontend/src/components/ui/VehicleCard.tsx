import { Car, Zap, Fuel, Calendar, Palette, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Vehicle, CatalogVehicle } from '@/lib/api';

interface VehicleCardProps {
  vehicle: Vehicle | CatalogVehicle;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  decorated?: boolean;
  showSale?: boolean;
  salePercentage?: number;
}

export const VehicleCard = ({
  vehicle,
  onAddToCart,
  onViewDetails,
  decorated = false,
  showSale = false,
  salePercentage = 0,
}: VehicleCardProps) => {
  // Handle both Vehicle and CatalogVehicle types
  const isVehicle = 'energyType' in vehicle;
  const model = isVehicle ? vehicle.model : vehicle.model;
  const price = isVehicle ? vehicle.price : vehicle.attributes.price;
  const energyType = isVehicle ? vehicle.energyType : 'ELECTRIC';
  const vehicleType = isVehicle ? vehicle.type : 'CAR';
  const year = isVehicle ? vehicle.year : new Date().getFullYear();
  const color = isVehicle ? vehicle.color : 'Black';

  const isElectric = energyType === 'ELECTRIC';
  const salePrice = showSale ? price * (1 - salePercentage / 100) : price;

  return (
    <div
      className={cn(
        'vehicle-card group',
        decorated && 'ring-2 ring-accent/50',
        showSale && 'animate-pulse-glow'
      )}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car
            className={cn(
              'w-24 h-24 transition-transform duration-500 group-hover:scale-110',
              isElectric ? 'text-emerald-500/30' : 'text-amber-500/30'
            )}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isElectric ? (
            <span className="badge-electric">
              <Zap className="w-3 h-3 mr-1" />
              Electric
            </span>
          ) : (
            <span className="badge-gasoline">
              <Fuel className="w-3 h-3 mr-1" />
              Gasoline
            </span>
          )}
          {vehicleType === 'SCOOTER' && (
            <Badge variant="secondary" className="text-xs">
              Scooter
            </Badge>
          )}
        </div>

        {showSale && (
          <div className="absolute top-3 right-3">
            <span className="badge-sale animate-pulse">
              -{salePercentage}% OFF
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {model}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {year}
            </span>
            <span className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              {color}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {showSale ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">
                  ${salePrice.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-foreground">
                ${price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                Details
              </Button>
            )}
            {onAddToCart && (
              <Button
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                onClick={onAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
