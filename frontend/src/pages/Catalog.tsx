import React, { useState, useEffect } from 'react';
import {Layout} from '@/components/layout/Layout';
import { VehicleIterator } from '@/components/vehicles/VehicleIterator';
import { VehicleFilters, FilterState } from '@/components/vehicles/VehicleFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { iteratorService } from '@/api/iterator.service';
import { Filter, Grid3x3, List } from 'lucide-react';

export default function Catalog() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [iteratorType, setIteratorType] = useState<'FILTERED' | 'PAGINATED'>('FILTERED');
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    types: [],
    fuelTypes: [],
    onlyAvailable: false,
    onlyPromotion: false,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await iteratorService.getIteratorStats();
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Erreur statistiques:', error);
      }
    };
    loadStats();
  }, []);

  // Convertir les filtres frontend en filtres backend
  const getBackendFilters = () => ({
    vehicleTypes: filters.types,
    available: filters.onlyAvailable,
    onSale: filters.onlyPromotion,
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Catalogue</h1>
              <p className="text-muted-foreground">Pattern Iterator en action</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              >
                {view === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid3x3 className="h-4 w-4 mr-2" />}
                {view === 'grid' ? 'Liste' : 'Grille'}
              </Button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Véhicules</p>
                  <p className="text-2xl font-bold">{stats.totalVehicles || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Itérateurs actifs</p>
                  <p className="text-2xl font-bold">{stats.activeIterators || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <Badge>{iteratorType === 'FILTERED' ? 'Filtré' : 'Paginé'}</Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium">Filtres</span>
                </div>
                <VehicleFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  view={view}
                  onViewChange={setView}
                />
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <Tabs value={iteratorType} onValueChange={(v: any) => setIteratorType(v)}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="FILTERED">Filtré</TabsTrigger>
                <TabsTrigger value="PAGINATED">Paginé</TabsTrigger>
              </TabsList>
              
              <TabsContent value="FILTERED">
                <VehicleIterator
                  type="FILTERED"
                  filters={getBackendFilters()}
                  viewMode={view}
                  pageSize={view === 'grid' ? 12 : 8}
                />
              </TabsContent>
              
              <TabsContent value="PAGINATED">
                <VehicleIterator
                  type="PAGINATED"
                  filters={getBackendFilters()}
                  viewMode={view}
                  pageSize={view === 'grid' ? 12 : 8}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </Layout>
  );
}