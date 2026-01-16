import api from './index.service';

export interface VehicleRequest {
  factoryType: 'ELECTRIC' | 'GASOLINE';
  vehicleType: 'CAR' | 'SCOOTER';
  name: string;  // ✅ Ajouté
  model: string;
  brand?: string; // Optionnel
  price: number;
  color: string;
  year: number;
  available?: boolean; // Optionnel
  onSale?: boolean; // Optionnel
  description?: string; // Optionnel
}

export interface VehicleResponse {
  id: number;
  type: string;
  name: string;  
  model: string;
  brand?: string;
  price: number;
  color: string;
  year: number;
  available: boolean;
  onSale: boolean;
  description: string;
  createdAt: string;
  energyType: string;
  // Champs spécifiques selon le type de véhicule
  doors?: number;
  hasSunroof?: boolean;
  hasTopCase?: boolean;
  maxSpeed?: number;
  batteryCapacity?: number;
  range?: number;
  fuelTankCapacity?: number;
  fuelType?: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export const vehiclesService = {
  // Créer un véhicule
  createVehicle: (data: VehicleRequest) => 
    api.post<VehicleResponse>('/vehicles', data),

  // Obtenir un véhicule par ID
  getVehicle: (id: number) => 
    api.get<VehicleResponse>(`/vehicles/${id}`),

  // Lister tous les véhicules
  getAllVehicles: (params?: {
    available?: boolean;
    onSale?: boolean;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => 
    api.get<VehicleResponse[]>('/vehicles', { params }),

  // Mettre à jour un véhicule
  updateVehicle: (id: number, data: Partial<VehicleRequest>) => 
    api.put<VehicleResponse>(`/vehicles/${id}`, data),

  // Supprimer un véhicule
  deleteVehicle: (id: number) => 
    api.delete(`/vehicles/${id}`),

  // Mettre en vente/un véhicule
  toggleSaleStatus: (id: number, onSale: boolean) => 
    api.patch<VehicleResponse>(`/vehicles/${id}/sale`, { onSale }),

  // Mettre à jour la disponibilité
  updateAvailability: (id: number, available: boolean) => 
    api.patch<VehicleResponse>(`/vehicles/${id}/availability`, { available }),
};