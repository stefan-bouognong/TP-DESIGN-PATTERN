import { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Grid, List, Zap, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleCard } from '@/components/ui/VehicleCard';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { iteratorApi } from '@/lib/api';
import type { Vehicle } from '@/lib/api';

const CatalogIterator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 6;

  // Fetch vehicles using React Query
  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles', searchQuery, priceRange[0], priceRange[1], selectedTypes],
    queryFn: () => iteratorApi.search({
      searchKeyword: searchQuery || undefined,
      vehicleTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
    }),
  });

  // Filter vehicles (additional client-side filter for energy type not supported by API)
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    return vehicles.filter((vehicle) => {
      const matchesEnergy = selectedEnergy.length === 0 || selectedEnergy.includes(vehicle.energyType);
      return matchesEnergy;
    });
  }, [vehicles, selectedEnergy]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleEnergyToggle = (energy: string) => {
    setSelectedEnergy((prev) =>
      prev.includes(energy) ? prev.filter((e) => e !== energy) : [...prev, energy]
    );
    setCurrentPage(1);
  };

  const handleAddToCart = (vehicle: Vehicle) => {
    toast({
      title: 'Added to Cart',
      description: `${vehicle.model} has been added to your cart.`,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading vehicles...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-12 bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-display font-bold mb-2">Error loading vehicles</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Iterator Pattern
          </span>
          <h1 className="section-heading">Vehicle Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete inventory with advanced filtering and pagination
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-72 flex-shrink-0 space-y-6 animate-slide-in-right">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 input-field"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <Label>Price Range</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value);
                        setCurrentPage(1);
                      }}
                      max={100000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-3">
                    <Label>Vehicle Type</Label>
                    <div className="space-y-2">
                      {['CAR', 'SCOOTER'].map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={type}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleTypeToggle(type)}
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type.charAt(0) + type.slice(1).toLowerCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Energy Type */}
                  <div className="space-y-3">
                    <Label>Energy Type</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="ELECTRIC"
                          checked={selectedEnergy.includes('ELECTRIC')}
                          onCheckedChange={() => handleEnergyToggle('ELECTRIC')}
                        />
                        <label htmlFor="ELECTRIC" className="text-sm cursor-pointer flex items-center gap-1">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          Electric
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="GASOLINE"
                          checked={selectedEnergy.includes('GASOLINE')}
                          onCheckedChange={() => handleEnergyToggle('GASOLINE')}
                        />
                        <label htmlFor="GASOLINE" className="text-sm cursor-pointer flex items-center gap-1">
                          <Fuel className="w-4 h-4 text-amber-500" />
                          Gasoline
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 100000]);
                      setSelectedTypes([]);
                      setSelectedEnergy([]);
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredVehicles.length} vehicles found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {paginatedVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onAddToCart={() => handleAddToCart(vehicle)}
                    onViewDetails={() => {}}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedVehicles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-display font-bold mb-2">No vehicles found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogIterator;