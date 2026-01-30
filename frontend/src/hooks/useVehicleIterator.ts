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
          setVehicles(response.data.vehicles || []);
          setTotal(response.data.count || 0);
          setHasNext(false);
          setHasPrevious(false);
          setPage(1);
          setTotalPages(1);
        } else {
          setError(response.data.message || 'Erreur filtrage');
        }
      } else if (config.type === 'PAGINATED') {
        const currentPage = config.page || 1;
        const response = await iteratorService.paginatedIteration(
          currentPage,
          config.size || 12,
          config.filters
        );
        
        console.log('Réponse paginée complète:', response.data); // Debug
        
        if (response.data.success) {
          // ICI: utiliser page.content au lieu de vehicles
          const pageData = response.data.page;
          setVehicles(pageData?.content || []);
          setTotal(pageData?.totalElements || 0);
          setPage(pageData?.pageNumber || 1);
          setTotalPages(pageData?.totalPages || 1);
          setHasNext(pageData?.hasNext || false);
          setHasPrevious(pageData?.hasPrevious || false);
        } else {
          setError(response.data.message || 'Erreur pagination');
        }
      }
    } catch (err: any) {
      console.error('Erreur détaillée:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(async (config: IteratorFilterRequest) => {
    if (!hasNext || loading) return;
    
    const nextPage = page + 1;
    
    try {
      setLoading(true);
      const response = await iteratorService.paginatedIteration(
        nextPage,
        12, // taille fixe pour "charger plus"
        config
      );
      
      if (response.data.success) {
        const pageData = response.data.page;
        setVehicles(prev => [...prev, ...(pageData?.content || [])]);
        setTotal(pageData?.totalElements || 0);
        setPage(pageData?.pageNumber || nextPage);
        setTotalPages(pageData?.totalPages || 1);
        setHasNext(pageData?.hasNext || false);
        setHasPrevious(pageData?.hasPrevious || false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  }, [hasNext, loading, page]);

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