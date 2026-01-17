export type VehicleType = 'automobile' | 'scooter';
export type FuelType = 'electric' | 'essence' | 'hybrid';
export type VehicleStatus = 'available' | 'reserved' | 'sold';
export type Transmission = 'manual' | 'automatic';

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  type: VehicleType;
  fuelType: FuelType;
  price: number;
  year: number;
  mileage?: number;
  power?: number;
  transmission?: Transmission;
  color: string;
  images: string[];
  description: string;
  features: string[];
  options: string[];
  status: VehicleStatus;
  daysInStock: number;
  isPromotion: boolean;
  quantity: number;
  originalPrice?: number;
  promotionPercentage?: number;
  // Champs API
  factoryType?: 'ELECTRIC' | 'GASOLINE';
  vehicleType?: 'CAR' | 'SCOOTER';
  available?: boolean;
  onSale?: boolean;
  createdAt?: string;
  energyType?: string;
  // Champs techniques spécifiques
  doors?: number;
  hasSunroof?: boolean;
  hasTopCase?: boolean;
  maxSpeed?: number;
  batteryCapacity?: number;
  range?: number;
  fuelTankCapacity?: number;
  imageUrl?: string;
  videoUrl?: string;
}

export interface VehicleResponse {
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
  energyType: string;
  doors?: number;
  hasSunroof?: boolean;
  hasTopCase?: boolean;
  maxSpeed?: number;
  batteryCapacity?: number;
  range?: number;
  fuelTankCapacity?: number;
}
export interface VehicleOption {
  id: string           // identifiant unique de l’option
  name: string         // nom de l’option, ex: "Toit ouvrant"
  price: number        // prix supplémentaire de l’option
  description?: string // description facultative de l’option
}

export interface CartItem {
  vehicle: Vehicle              // le véhicule complet
  quantity: number              // nombre d’exemplaires
  selectedOptions?: VehicleOption[] // options choisies pour ce véhicule
}