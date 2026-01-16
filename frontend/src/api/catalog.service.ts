import api from './index.service';

export interface VehicleDisplayAttributes {
  vehicleId: number;
  name: string;  // ✅ Ajouté
  model: string;
  brand?: string;
  price: number;
  available: boolean;
  onSale: boolean;
  description: string;
  color: string;
  year: number;
  hasAnimations: boolean;
  hasSaleBadge: boolean;
  hasOptions: boolean;
  animationType?: string;
  discountPercentage?: number;
  salePrice?: number;
  availableOptions?: string[];
}

export interface VehicleDisplayResponse {
  vehicleId: number;
  name: string;  // ✅ Ajouté
  model: string;
  displayHtml: string;
  displayType: string;
  decoratorCount: number;
  attributes: VehicleDisplayAttributes;
}

export interface CatalogResponse {
  vehicles: VehicleDisplayResponse[];
  viewType: string;
  totalVehicles: number;
  hasAnimations: boolean;
  hasSaleItems: boolean;
}

export interface DecorateRequest {
  decorators: string[];
  includeAnimations?: boolean;
  includeSaleBadge?: boolean;
  showOptions?: boolean;
  showRecommendations?: boolean;
  theme?: string;
}

export interface BatchDecorateRequest {
  vehicleIds: number[];
  decorators: string[];
}

export const catalogService = {
  // Catalogue de base avec filtres
  getBasicCatalog: (filters?: {
    available?: boolean;
    onSale?: boolean;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => 
    api.get<CatalogResponse>('/catalog/vehicles', { params: filters }),

  // Catalogue amélioré
  getEnhancedCatalog: (filters?: {
    available?: boolean;
    onSale?: boolean;
    type?: string;
  }) => 
    api.get<CatalogResponse>('/catalog/vehicles/enhanced', { params: filters }),

  // Véhicule décoré personnalisé
  decorateVehicle: (id: number, data: DecorateRequest) => 
    api.post<VehicleDisplayResponse>(`/catalog/vehicle/${id}/decorate`, data),

  // Véhicule avec toutes les décorations
  getFullyDecoratedVehicle: (id: number) => 
    api.get<VehicleDisplayResponse>(`/catalog/vehicle/${id}/decorated`),

  // Véhicules en solde (utilise le champ onSale)
  getSaleVehicles: () => 
    api.get<CatalogResponse>('/catalog/vehicles/sale'),

  // Décoration par lot
  batchDecorate: (data: BatchDecorateRequest) => 
    api.post<VehicleDisplayResponse[]>('/catalog/decorate/batch', data),

  // Recherche de véhicules
  searchVehicles: (searchTerm: string, filters?: {
    available?: boolean;
    onSale?: boolean;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => 
    api.get<CatalogResponse>('/catalog/vehicles/search', { 
      params: { q: searchTerm, ...filters } 
    }),
};