import { useState } from 'react';
import { Search, Filter, Grid3X3, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface FilterState {
  search: string;
  types: ('automobile' | 'scooter')[];
  fuelTypes: ('essence' | 'electric' | 'hybrid')[];
  priceRange: [number, number];
  onlyAvailable: boolean;
  onlyPromotion: boolean;
}

interface VehicleFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  maxPrice: number;
}

export function VehicleFilters({
  filters,
  onFiltersChange,
  view,
  onViewChange,
  maxPrice,
}: VehicleFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T extends string>(
    key: 'types' | 'fuelTypes',
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated as FilterState[typeof key]);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      types: [],
      fuelTypes: [],
      priceRange: [0, maxPrice],
      onlyAvailable: false,
      onlyPromotion: false,
    });
  };

  const activeFiltersCount =
    filters.types.length +
    filters.fuelTypes.length +
    (filters.onlyAvailable ? 1 : 0) +
    (filters.onlyPromotion ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Type de véhicule */}
      <div>
        <h4 className="font-medium mb-3">Type de véhicule</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'automobile' as const, label: 'Automobiles' },
            { value: 'scooter' as const, label: 'Scooters' },
          ].map((type) => (
            <Badge
              key={type.value}
              variant={filters.types.includes(type.value) ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                filters.types.includes(type.value) && "bg-accent hover:bg-accent/90"
              )}
              onClick={() => toggleArrayFilter('types', type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Carburant */}
      <div>
        <h4 className="font-medium mb-3">Carburant</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'electric' as const, label: 'Électrique' },
            { value: 'essence' as const, label: 'Essence' },
            { value: 'hybrid' as const, label: 'Hybride' },
          ].map((fuel) => (
            <Badge
              key={fuel.value}
              variant={filters.fuelTypes.includes(fuel.value) ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                filters.fuelTypes.includes(fuel.value) && "bg-accent hover:bg-accent/90"
              )}
              onClick={() => toggleArrayFilter('fuelTypes', fuel.value)}
            >
              {fuel.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h4 className="font-medium mb-3">
          Prix: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          max={maxPrice}
          min={0}
          step={1000}
          className="mt-2"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.onlyAvailable}
            onCheckedChange={(checked) => updateFilter('onlyAvailable', !!checked)}
          />
          <span className="text-sm">Disponibles uniquement</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.onlyPromotion}
            onCheckedChange={(checked) => updateFilter('onlyPromotion', !!checked)}
          />
          <span className="text-sm">En promotion</span>
        </label>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Effacer les filtres ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search bar and view toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par marque, modèle... (utilisez ET, OU)"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewChange('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewChange('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block p-6 rounded-2xl border border-border bg-card">
        <FiltersContent />
      </div>

      {/* Mobile filters */}
      {showMobileFilters && (
        <div className="lg:hidden p-6 rounded-2xl border border-border bg-card animate-slide-up">
          <FiltersContent />
        </div>
      )}
    </div>
  );
}
