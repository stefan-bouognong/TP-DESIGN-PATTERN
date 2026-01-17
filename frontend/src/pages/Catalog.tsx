import { useState, useCallback, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleFilters, FilterState } from '@/components/vehicles/VehicleFilters';
import { vehiclesService, VehicleResponse } from '@/api/vehicles.service';

interface BackendFilters {
  available?: boolean;
  onSale?: boolean;
  type?: string;  // 'CAR' ou 'SCOOTER'
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export default function Catalog() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxPriceFromBackend, setMaxPriceFromBackend] = useState<number>(50000);

  // Filtres INITIAUX
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    types: [],           // Contient 'CAR' ou 'SCOOTER'
    fuelTypes: [],       // Filtre côté frontend
    priceRange: [0, 50000],
    onlyAvailable: false,
    onlyPromotion: false,
  });

  // Récupère le prix maximum
  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        // ✅ CHANGE : Appelle sans paramètres pour avoir tous les véhicules
        const response = await vehiclesService.getAllVehicles({});
        if (response.data.length > 0) {
          const max = Math.max(...response.data.map(v => v.price));
          setMaxPriceFromBackend(max);
          setFilters(prev => ({
            ...prev,
            priceRange: [0, max]
          }));
        }
      } catch (err) {
        console.warn("Impossible de récupérer le prix max:", err);
      }
    };
    fetchMaxPrice();
  }, []);

  // Convertit les filtres frontend → backend
  const getBackendParams = useCallback((filterState: FilterState): BackendFilters => {
    const params: BackendFilters = {};
    
    // ✅ Recherche texte
    if (filterState.search.trim()) {
      params.search = filterState.search.trim();
    }
    
    // Disponibilité
    if (filterState.onlyAvailable) {
      params.available = true;
    }
    
    // Promotion
    if (filterState.onlyPromotion) {
      params.onSale = true;
    }
    
    // Type
    if (filterState.types.length > 0) {
      params.type = filterState.types[0]; // 'CAR' ou 'SCOOTER'
    }
    
    // Prix
    if (filterState.priceRange[0] > 0) {
      params.minPrice = filterState.priceRange[0];
    }
    
    if (filterState.priceRange[1] < maxPriceFromBackend) {
      params.maxPrice = filterState.priceRange[1];
    }
    
    console.log('✅ Filtres envoyés au backend:', params);
    return params;
  }, [maxPriceFromBackend]);

  // Chargement des véhicules
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError(null);

    const loadVehicles = async () => {
      try {
        // ✅ Appelle le backend avec TOUS les filtres
        const backendParams = getBackendParams(filters);
        
        const response = await vehiclesService.getAllVehicles(backendParams);
        
        if (isCurrent) {
          let filteredVehicles = response.data;
          
          // ✅ Filtrage carburant COTÉ FRONTEND uniquement
          if (filters.fuelTypes.length > 0) {
            filteredVehicles = filteredVehicles.filter(vehicle => {
              const vehicleFuel = vehicle.energyType === 'ELECTRIC' 
                ? 'electric' 
                : (vehicle.fuelType?.toLowerCase() || 'essence');
              
              return filters.fuelTypes.includes(vehicleFuel);
            });
          }
          
          setVehicles(filteredVehicles);
          console.log(`✅ ${filteredVehicles.length} véhicules trouvés`);
        }
      } catch (err: any) {
        if (isCurrent) {
          const errorMsg = err.response?.data?.message || err.message || "Erreur de chargement";
          setError(errorMsg);
          console.error('❌ Erreur:', err);
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    // Debounce pour la recherche
    const timer = setTimeout(() => {
      loadVehicles();
    }, filters.search ? 300 : 0);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [filters, getBackendParams]);

  const displayedCount = loading ? '…' : vehicles.length;

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Notre catalogue
          </h1>
          <p className="text-muted-foreground">
            {displayedCount} véhicule{displayedCount !== 1 ? 's' : ''} disponible
            {displayedCount !== 1 ? 's' : ''}
            {filters.search && ` pour "${filters.search}"`}
            {filters.types.length > 0 && ` (Type: ${filters.types.join(', ')})`}
          </p>
          {filters.fuelTypes.length > 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ Filtre carburant appliqué localement ({filters.fuelTypes.join(', ')})
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <aside className="lg:w-80 flex-shrink-0">
            <VehicleFilters
              filters={filters}
              onFiltersChange={setFilters}
              view={view}
              onViewChange={setView}
              maxPrice={maxPriceFromBackend}
            />
          </aside>

          {/* Liste des véhicules */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement des véhicules...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 px-4">
                <div className="text-destructive text-lg mb-2">Erreur</div>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Réessayer
                </button>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground mb-2">Aucun véhicule trouvé</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button 
                  onClick={() => setFilters({
                    search: '',
                    types: [],
                    fuelTypes: [],
                    priceRange: [0, maxPriceFromBackend],
                    onlyAvailable: false,
                    onlyPromotion: false,
                  })}
                  className="mt-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Information sur les filtres appliqués */}
                <div className="mb-6 text-sm text-muted-foreground">
                  {filters.onlyAvailable && <span className="mr-3">✅ Disponibles</span>}
                  {filters.onlyPromotion && <span className="mr-3">🎯 En promotion</span>}
                  {filters.priceRange[0] > 0 && (
                    <span className="mr-3">💰 Prix min: {filters.priceRange[0]}€</span>
                  )}
                  {filters.priceRange[1] < maxPriceFromBackend && (
                    <span className="mr-3">💰 Prix max: {filters.priceRange[1]}€</span>
                  )}
                </div>
                
                <div className={
                  view === 'grid'
                    ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-4'
                }>
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={{
                        ...vehicle,
                        name: vehicle.name || `${vehicle.brand || ''} ${vehicle.model}`.trim(),
                        status: vehicle.available ? 'available' : 'unavailable',
                        isPromotion: vehicle.onSale,
                      }}
                      view={view}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}