import api from './index.service';

export interface BackendVehicle {
  id: number;
  name: string;
  model: string;
  brand: string;
  price: number;
  color: string;
  year: number;
  available: boolean;
  onSale: boolean;
  description: string;
  createdAt: string;
  imageUrl?: string;
  type: string;
}

export interface PaginatedResponse {
  success: boolean;
  timestamp: string;
  page: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: BackendVehicle[];
  };
  message: string;
}

export interface FilteredIteratorResponse {
  success: boolean;
  timestamp: string;
  vehicles: BackendVehicle[];
  message: string;
  filters: any;
  count: number;
}

export interface IteratorStatsResponse {
  success: boolean;
  timestamp: string;
  stats: {
    activeIterators: number;
    totalVehicles: number;
    iteratorTypes: Record<string, number>;
  };
}

export interface IteratorFilterRequest {
  vehicleTypes?: string[];
  available?: boolean;
  onSale?: boolean;
}

export const iteratorService = {
  filteredIteration: (filters: IteratorFilterRequest, limit?: number) => {
    const safeFilters = {
      vehicleTypes: filters.vehicleTypes || [],
      inStock: filters.available !== undefined ? filters.available : null,
      onSale: filters.onSale !== undefined ? filters.onSale : false,
    };
    
    return api.post<FilteredIteratorResponse>('/iterator/filtered', safeFilters, { 
      params: { limit } 
    });
  },

  paginatedIteration: (page: number, size: number, filters?: IteratorFilterRequest) => {
    const safeFilters = {
      vehicleTypes: filters?.vehicleTypes || [],
      inStock: filters?.available !== undefined ? filters.available : null,
      onSale: filters?.onSale !== undefined ? filters.onSale : false,
      pageSize: size,
      pageNumber: page,
    };
    
    return api.post<PaginatedResponse>(
      `/iterator/paginated?page=${page}&size=${size}`,
      safeFilters
    );
  },

  getIteratorStats: () => 
    api.get<IteratorStatsResponse>('/iterator/stats'),
};