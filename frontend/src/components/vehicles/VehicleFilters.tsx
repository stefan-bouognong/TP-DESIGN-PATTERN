import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface FilterState {
  search: string;
  types: string[];
  fuelTypes: string[];
  onlyAvailable: boolean;
  onlyPromotion: boolean;
}

interface VehicleFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const vehicleTypes = [
  { value: 'GASOLINECAR', label: 'Voiture essence' },
  { value: 'ELECTRICCAR', label: 'Voiture électrique' },
  { value: 'SCOOTER', label: 'Scooter' },
];

const fuelTypes = [
  { value: 'Gasoline', label: 'Essence' },
  { value: 'Electric', label: 'Électrique' },
  { value: 'Diesel', label: 'Diesel' },
];

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  view,
  onViewChange,
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleFuelTypeChange = (fuelType: string, checked: boolean) => {
    const newFuelTypes = checked
      ? [...filters.fuelTypes, fuelType]
      : filters.fuelTypes.filter(f => f !== fuelType);
    onFiltersChange({ ...filters, fuelTypes: newFuelTypes });
  };

  const handleAvailableChange = (checked: boolean) => {
    onFiltersChange({ ...filters, onlyAvailable: checked });
  };

  const handlePromotionChange = (checked: boolean) => {
    onFiltersChange({ ...filters, onlyPromotion: checked });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      types: [],
      fuelTypes: [],
      onlyAvailable: false,
      onlyPromotion: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Recherche */}
      <div>
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Marque, modèle..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Types de véhicules */}
      <div>
        <Label className="mb-3 block">Type de véhicule</Label>
        <div className="space-y-2">
          {vehicleTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={filters.types.includes(type.value)}
                onCheckedChange={(checked) =>
                  handleTypeChange(type.value, checked === true)
                }
              />
              <Label htmlFor={`type-${type.value}`}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Types de carburant */}
      <div>
        <Label className="mb-3 block">Carburant</Label>
        <div className="space-y-2">
          {fuelTypes.map((fuel) => (
            <div key={fuel.value} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${fuel.value}`}
                checked={filters.fuelTypes.includes(fuel.value)}
                onCheckedChange={(checked) =>
                  handleFuelTypeChange(fuel.value, checked === true)
                }
              />
              <Label htmlFor={`fuel-${fuel.value}`}>{fuel.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={filters.onlyAvailable}
            onCheckedChange={(checked) =>
              handleAvailableChange(checked === true)
            }
          />
          <Label htmlFor="available">Disponible maintenant</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="promotion"
            checked={filters.onlyPromotion}
            onCheckedChange={(checked) =>
              handlePromotionChange(checked === true)
            }
          />
          <Label htmlFor="promotion">En promotion</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};