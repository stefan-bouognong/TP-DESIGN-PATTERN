import api from './index.service';

export interface VehicleRequest {
  factoryType: 'ELECTRIC' | 'GASOLINE';
  vehicleType: 'CAR' | 'SCOOTER';
  name: string;
  model: string;
  brand?: string;
  price: number;
  color: string;
  year: number;
  available?: boolean;
  onSale?: boolean;
  description?: string;
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
  doors?: number;
  hasSunroof?: boolean;
  hasTopCase?: boolean;
  maxSpeed?: number;
  batteryCapacity?: number;
  range?: number;
  fuelTankCapacity?: number;
  fuelType?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface VehicleResponseTransformed {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'automobile' | 'scooter';
  fuelType: 'electric' | 'gasoline';
  price: number;
  imageUrl: string;
  images: string[];
  description: string;
  year: number;
  status: 'available' | 'sold';
  isPromotion: boolean;
  daysInStock: number;
  promotionPercentage?: number;
  originalPrice?: number;
  color?: string;
  energyType?: string;
  doors?: number;
  hasSunroof?: boolean;
  hasTopCase?: boolean;
  maxSpeed?: number;
  batteryCapacity?: number;
  range?: number;
  fuelTankCapacity?: number;
  createdAt?: string;
  videoUrl?: string;
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
    api.get<VehicleResponse>(`/vehicles/${id}`).then(response => ({
      ...response,
      data: transformVehicleResponse(response.data)
    })),

  // Lister tous les véhicules avec transformation
  getAllVehicles: async (params?: {
    available?: boolean;
    onSale?: boolean;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => {
    const response = await api.get<VehicleResponse[]>('/vehicles', { params });
    
    // Transforme les données de l'API vers le format frontend
    const transformedData = response.data.map(transformVehicleResponse);
    
    return { ...response, data: transformedData };
  },

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

  // Méthode pour appliquer une promotion à un véhicule
  applyPromotion: (id: number, discount: number) =>
    api.patch<VehicleResponse>(`/vehicles/${id}/promotion`, { discount }),

  // Méthode pour retirer une promotion
  removePromotion: (id: number) =>
    api.patch<VehicleResponse>(`/vehicles/${id}/promotion/remove`),
};

// Fonction de transformation des données de l'API vers le format frontend
function transformVehicleResponse(vehicle: VehicleResponse): VehicleResponseTransformed {
  // Détermine le type de véhicule
  let type: 'automobile' | 'scooter' = 'automobile';
  let fuelType: 'electric' | 'gasoline' = 'gasoline';
  
  if (vehicle.type.includes('SCOOTER')) {
    type = 'scooter';
  }
  
  if (vehicle.energyType === 'ELECTRIC' || vehicle.fuelType === 'Electric') {
    fuelType = 'electric';
  }
  
  // Calcule les jours en stock à partir de createdAt
  const createdAt = new Date(vehicle.createdAt);
  const now = new Date();
  const daysInStock = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcule le pourcentage de promotion si le véhicule est en promotion
  let promotionPercentage: number | undefined;
  let originalPrice: number | undefined;
  
  if (vehicle.onSale) {
    // Ici, vous devrez peut-être ajuster la logique selon comment vous stockez les promotions
    // Pour l'instant, on suppose une promotion de 20% si onSale est true
    promotionPercentage = 20;
    originalPrice = vehicle.price / 0.8; // Si prix = 80% du prix original
  }
  
  return {
    id: vehicle.id.toString(),
    name: vehicle.name,
    brand: vehicle.brand || '',
    model: vehicle.model,
    type: type,
    fuelType: fuelType,
    price: vehicle.price,
    imageUrl: vehicle.imageUrl || '',
    images: vehicle.imageUrl ? [vehicle.imageUrl] : [],
    description: vehicle.description || '',
    year: vehicle.year,
    status: vehicle.available ? 'available' : 'sold',
    isPromotion: vehicle.onSale,
    daysInStock: daysInStock,
    promotionPercentage: promotionPercentage,
    originalPrice: originalPrice,
    color: vehicle.color,
    energyType: vehicle.energyType,
    doors: vehicle.doors,
    hasSunroof: vehicle.hasSunroof,
    hasTopCase: vehicle.hasTopCase,
    maxSpeed: vehicle.maxSpeed,
    batteryCapacity: vehicle.batteryCapacity,
    range: vehicle.range,
    fuelTankCapacity: vehicle.fuelTankCapacity,
    createdAt: vehicle.createdAt,
    videoUrl: vehicle.videoUrl
  };
}

// Fonction alternative si votre API retourne directement les données de la BD
function transformDbVehicle(vehicle: any): VehicleResponseTransformed {
  // Cette fonction est utilisée si l'API retourne les données brutes de la BD
  const type = vehicle.vehicle_type?.includes('CAR') ? 'automobile' : 'scooter';
  const fuelType = vehicle.fuel_type === 'Electric' || vehicle.energyType === 'ELECTRIC' ? 'electric' : 'gasoline';
  
  const createdAt = vehicle.created_at ? new Date(vehicle.created_at) : new Date();
  const now = new Date();
  const daysInStock = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  let promotionPercentage: number | undefined;
  let originalPrice: number | undefined;
  
  if (vehicle.on_sale) {
    promotionPercentage = 20; // Valeur par défaut
    originalPrice = vehicle.price / 0.8;
  }
  
  return {
    id: vehicle.id.toString(),
    name: vehicle.name,
    brand: vehicle.brand || '',
    model: vehicle.model,
    type: type,
    fuelType: fuelType,
    price: vehicle.price,
    imageUrl: vehicle.image_url || '',
    images: vehicle.image_url ? [vehicle.image_url] : [],
    description: vehicle.description || '',
    year: vehicle.year,
    status: vehicle.available ? 'available' : 'sold',
    isPromotion: vehicle.on_sale,
    daysInStock: daysInStock,
    promotionPercentage: promotionPercentage,
    originalPrice: originalPrice,
    color: vehicle.color,
    doors: vehicle.doors,
    hasSunroof: vehicle.hasSunroof,
    hasTopCase: vehicle.hasTopCase,
    maxSpeed: vehicle.max_speed,
    batteryCapacity: vehicle.battery_capacity,
    range: vehicle.vehicle_range,
    fuelTankCapacity: vehicle.fuel_tank_capacity,
    createdAt: vehicle.created_at,
    videoUrl: vehicle.video_url
  };
}

// Export des fonctions de transformation si besoin ailleurs
export { transformVehicleResponse, transformDbVehicle };