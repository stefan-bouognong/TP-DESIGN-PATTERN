// Types pour le pattern Iterator
export interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
    reset(): void;
    current(): T | null;
    getPosition(): number;
    getTotal(): number;
  }
  
  // Types de véhicule pour l'itération
  export interface IterableVehicle {
    id: number;
    vehicleId: number;
    name: string;
    model: string;
    brand: string;
    price: number;
    color: string;
    year: number;
    available: boolean;
    onSale: boolean;
    description?: string;
    type: string;
    fuelType?: string;
    transmission?: string;
    mileage?: number;
    imageUrl?: string;
    attributes: Record<string, any>;
  }
  
  // Types de collection itérable
  export interface VehicleCollection {
    getIterator(type?: string): Iterator<IterableVehicle>;
    getFilteredIterator(filters: VehicleFilters): Iterator<IterableVehicle>;
    getPaginatedIterator(page: number, size: number): Iterator<IterableVehicle>;
    getSearchIterator(keyword: string): Iterator<IterableVehicle>;
  }
  
  // Filtres pour les véhicules
  export interface VehicleFilters {
    vehicleTypes?: string[];
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    onSale?: boolean;
    search?: string;
    brand?: string[];
    color?: string[];
    fuelType?: string[];
    transmission?: string[];
    yearFrom?: number;
    yearTo?: number;
  }
  
  // Configuration de l'itérateur
  export interface IteratorConfig {
    type: 'SEQUENTIAL' | 'FILTERED' | 'PAGINATED' | 'SEARCH';
    filters?: VehicleFilters;
    pageSize?: number;
    initialPage?: number;
    searchKeyword?: string;
  }
  
  // Réponse standardisée
  export interface IteratorResponse<T> {
    items: T[];
    total: number;
    page?: number;
    size?: number;
    totalPages?: number;
    hasNext: boolean;
    hasPrevious: boolean;
    cursor?: string;
    iteratorId?: string;
  }
  
  // Statistiques
  export interface IteratorStatistics {
    totalIterators: number;
    activeIterators: number;
    totalVehicles: number;
    availableVehicles: number;
    onSaleVehicles: number;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    vehicleTypeDistribution: Record<string, number>;
  }