import React, { useEffect } from 'react';
import { VehicleCard } from './VehicleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useVehicleIterator } from '@/hooks/useVehicleIterator';
import { Button } from '@/components/ui/button';

interface VehicleIteratorProps {
  type: 'FILTERED' | 'PAGINATED';
  filters?: any;
  viewMode: 'grid' | 'list';
  pageSize?: number;
}

export const VehicleIterator: React.FC<VehicleIteratorProps> = ({
  type = 'FILTERED',
  filters = {},
  viewMode = 'grid',
  pageSize = 12,
}) => {
  const {
    loading,
    error,
    vehicles,
    total,
    hasNext,
    loadVehicles,
    loadNextPage,
    reset,
  } = useVehicleIterator();

  useEffect(() => {
    const config = {
      type,
      filters,
      size: pageSize,
    };
    
    loadVehicles(config);
  }, [type, filters, pageSize]);

  if (loading && vehicles.length === 0) {
    return (
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {[...Array(pageSize)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Aucun véhicule trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {total} véhicule{total !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline">
          {type === 'FILTERED' ? 'Filtré' : 'Paginé'}
        </Badge>
      </div>

      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={{
              ...vehicle,
              id: vehicle.id,
              name: vehicle.name,
              model: vehicle.model,
              brand: vehicle.brand,
              price: vehicle.price,
              year: vehicle.year,
              color: vehicle.color,
              imageUrl: vehicle.imageUrl,
              status: vehicle.available ? 'available' : 'unavailable',
              isPromotion: vehicle.onSale,
              description: vehicle.description,
            }}
            view={viewMode}
          />
        ))}
      </div>

      {hasNext && (
        <div className="text-center pt-4">
          <Button
            onClick={() => loadNextPage({
              type: 'PAGINATED',
              filters,
              size: pageSize,
            })}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Chargement...' : (
              <>
                Charger plus
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};