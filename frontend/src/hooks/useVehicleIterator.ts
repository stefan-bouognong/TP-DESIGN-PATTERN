import { useState, useCallback } from 'react';
import { iteratorService, IteratorFilterRequest, BackendVehicle } from '@/api/iterator.service';

interface IteratorConfig {
  type: 'FILTERED' | 'PAGINATED';
  filters?: IteratorFilterRequest;
  page?: number;
  size?: number;
}

export const useVehicleIterator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const loadVehicles = useCallback(async (config: IteratorConfig) => {
    setLoading(true);
    setError(null);

    try {
      if (config.type === 'FILTERED') {
        const response = await iteratorService.filteredIteration(
          config.filters || {},
          config.size
        );
        
        if (response.data.success) {
          setVehicles(response.data.vehicles);
          setTotal(response.data.count);
          setHasNext(false);
          setHasPrevious(false);
        }
      } else if (config.type === 'PAGINATED') {
        const currentPage = config.page || 1;
        const response = await iteratorService.paginatedIteration(
          currentPage,
          config.size || 12,
          config.filters
        );
        
        if (response.data.success) {
          setVehicles(response.data.vehicles);
          setTotal(response.data.total);
          setPage(response.data.page);
          setTotalPages(response.data.totalPages);
          setHasNext(response.data.hasNext);
          setHasPrevious(response.data.hasPrevious);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(async (config: IteratorConfig) => {
    if (!hasNext || loading) return;
    
    const nextConfig = {
      ...config,
      type: 'PAGINATED' as const,
      page: page + 1,
    };
    
    await loadVehicles(nextConfig);
  }, [hasNext, loading, page, loadVehicles]);

  const reset = useCallback(() => {
    setVehicles([]);
    setTotal(0);
    setPage(1);
    setTotalPages(1);
    setHasNext(false);
    setHasPrevious(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    vehicles,
    total,
    page,
    totalPages,
    hasNext,
    hasPrevious,
    loadVehicles,
    loadNextPage,
    reset,
  };
};