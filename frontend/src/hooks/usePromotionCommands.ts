import { useState, useCallback } from 'react';
import { promotionsService, ClearanceCommandResponse } from '@/api/promotions.service';

export const usePromotionCommands = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState<ClearanceCommandResponse | null>(null);

  const applyClearance = useCallback(async (days: number, discount: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await promotionsService.applyClearance(days, discount);
      
      if (response.data.success) {
        setLastCommand(response.data);
        return {
          success: true,
          data: response.data,
        };
      } else {
        setError(response.data.message || 'Erreur lors de l\'application de la solde');
        return {
          success: false,
          error: response.data.message,
        };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur réseau';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const applyPromotion = useCallback(async (vehicleIds: number[], discount: number, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await promotionsService.applyPromotion(vehicleIds, discount, name);
      
      if (response.data.success) {
        setLastCommand(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur réseau';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const undoLastCommand = useCallback(async (commandId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await promotionsService.undoPromotion(commandId);
      
      if (response.data.success) {
        setLastCommand(null);
        return { success: true, data: response.data };
      } else {
        setError(response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur réseau';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLastCommand(null);
  }, []);

  return {
    loading,
    error,
    lastCommand,
    applyClearance,
    applyPromotion,
    undoLastCommand,
    reset,
  };
};