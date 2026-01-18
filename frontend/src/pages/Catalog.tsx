import { useState, useMemo, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleFilters, FilterState } from '@/components/vehicles/VehicleFilters';
import { catalogService, CatalogResponse, VehicleDisplayResponse } from '@/api/catalog.service'; // ← importe ton service

export default function Catalog() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [vehicles, setVehicles] = useState<VehicleDisplayResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    types: [],           // ex: ['SUV', 'Berline', ...] → à mapper vers le backend si besoin
    fuelTypes: [],       // idem
    priceRange: [0, 200_000_000], // ← valeur haute par défaut (à ajuster)
    onlyAvailable: false,
    onlyPromotion: false,
  });

  // Chargement initial + rechargement quand les filtres changent
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError(null);

    const loadCatalog = async () => {
      try {
        const params = {
          available: filters.onlyAvailable ? true : undefined,
          onSale: filters.onlyPromotion ? true : undefined,
          type: filters.types.length > 0 ? filters.types[0] : undefined, // ← simplifié (1 type), à adapter
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice:
            filters.priceRange[1] < 200_000_000 ? filters.priceRange[1] : undefined,
          search: filters.search || undefined,
        };

        const response = await catalogService.getBasicCatalog(params);
        // console.log('stefan ggggggggggggggggggggyyy',response)
        if (isCurrent) {
          setVehicles(response.data.vehicles);
          setTotalCount(response.data.totalVehicles);
          console.log(vehicles)
        }
      } catch (err) {
        if (isCurrent) {
          setError("Impossible de charger le catalogue. Veuillez réessayer.");
          console.error(err);
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadCatalog();

    return () => {
      isCurrent = false;
    };
  }, [filters]);

  // Pour l'affichage du nombre (on prend la réponse backend si possible)
  const displayedCount = loading ? '…' : totalCount;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Notre catalogue
          </h1>
          <p className="text-muted-foreground">
            {displayedCount} véhicule{displayedCount !== 1 ? 's' : ''} disponible
            {displayedCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <aside className="lg:w-80 flex-shrink-0">
            <VehicleFilters
              filters={filters}
              onFiltersChange={setFilters}
              view={view}
              onViewChange={setView}
              maxPrice={200_000_000} // ← à remplacer par une vraie valeur max si tu la récupères
            />
          </aside>

          {/* Contenu principal */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">Chargement du catalogue...</div>
            ) : error ? (
              <div className="text-center py-16 text-destructive">{error}</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground mb-2">Aucun véhicule trouvé</p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div
                className={
                  view === 'grid'
                    ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.vehicleId}
                    vehicle={{
                      ...vehicle,
                      id: vehicle.vehicleId,
                      // Ajoute name si ton VehicleCard attend vehicle.name
                      name: vehicle.name || vehicle.attributes.name || `${vehicle.attributes.brand || ''} ${vehicle.attributes.model}`,
                      // À adapter selon ce que VehicleCard attend exactement
                      status: 'available',
                      // vehicle.attributes.available ? 'available' : 'unavailable',
                      isPromotion: vehicle.attributes.onSale,
                      // etc.
                    }}
                    view={view}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}