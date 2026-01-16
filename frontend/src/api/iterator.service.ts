import api from './index.service';

export interface FilteredIteratorRequest {
  vehicleTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  onSale?: boolean;
  search?: string;
  brand?: string[];
  color?: string[];
  yearFrom?: number;
  yearTo?: number;
}

export interface PaginatedIteratorRequest {
  onSale?: boolean;
  available?: boolean;
  vehicleType?: string;
  sortBy?: 'price' | 'year' | 'name' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface SearchIteratorRequest {
  searchKeyword: string;
  vehicleTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  onSale?: boolean;
  brand?: string[];
  color?: string[];
}

export interface VehicleIterationItem {
  id: number;
  name: string;
  model: string;
  brand?: string;
  price: number;
  color: string;
  year: number;
  available: boolean;
  onSale: boolean;
  description: string;
  type: string;
  createdAt: string;
}

export interface IteratorResponse {
  items: VehicleIterationItem[];
  total: number;
  page?: number;
  size?: number;
  totalPages?: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface IteratorStats {
  totalIterators: number;
  activeIterators: number;
  totalVehicles: number;
  availableVehicles: number;
  onSaleVehicles: number;
  averagePrice: number;
}

export interface ActiveIterator {
  id: string;
  type: string;
  createdAt: string;
  filterCount: number;
  lastAccessed: string;
}

export const iteratorService = {
  // Créer un itérateur séquentiel
  createSequentialIterator: (filters?: FilteredIteratorRequest) => 
    api.post('/iterator/create', { type: 'SEQUENTIAL', filters }),

  // Parcours séquentiel
  getSequentialIteration: (limit?: number, cursor?: string) => 
    api.get<IteratorResponse>('/iterator/sequential', { 
      params: { limit, cursor } 
    }),

  // Parcours avec filtres
  getFilteredIteration: (filters: FilteredIteratorRequest, limit?: number) => 
    api.post<IteratorResponse>('/iterator/filtered', filters, {
      params: { limit }
    }),

  // Pagination
  getPaginatedIteration: (
    page: number, 
    size: number, 
    filters?: PaginatedIteratorRequest
  ) => 
    api.post<IteratorResponse>('/iterator/paginated', filters, { 
      params: { page, size } 
    }),

  // Recherche avancée
  searchIteration: (search: SearchIteratorRequest, page?: number, size?: number) => 
    api.post<IteratorResponse>('/iterator/search', search, {
      params: { page, size }
    }),

  // Tester le pattern Iterator
  testIterator: () => 
    api.post('/iterator/test'),

  // Statistiques d'itération
  getStats: () => 
    api.get<IteratorStats>('/iterator/stats'),

  // Itérateurs actifs
  getActiveIterators: () => 
    api.get<ActiveIterator[]>('/iterator/active'),

  // Fermer un itérateur
  closeIterator: (iteratorId: string) => 
    api.delete(`/iterator/${iteratorId}`),
};