import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ordersService, OrderRequest, OrderResponse } from '@/api/orders.service';
import {  useCartStore } from '@/contexts/CartContext';
import { DeliveryInfo, PaymentMethod, CreditRequest } from '@/types/auth';
import { useAuthStore } from '@/store/useAuthStore';

interface CreateOrderParams {
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  creditRequest?: CreditRequest;
}

export function useOrder() {
  const [isProcessing, setIsProcessing] = useState(false);

  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore(state => state.items)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);  
  const user = useAuthStore((state) => state.user);  
  const navigate = useNavigate();

  const createOrder = async ({
    deliveryInfo,
    paymentMethod,
    creditRequest,
  }: CreateOrderParams): Promise<OrderResponse | null> => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour passer commande');
      return null;
    }

    setIsProcessing(true);

    try {
      // Formater l'adresse de livraison
      const shippingAddress = `${deliveryInfo.address}, ${deliveryInfo.postalCode} ${deliveryInfo.city}, ${deliveryInfo.country}`;
      
      // Préparer les items de la commande
      const orderItems = items.map(item => ({
        vehicleId: item.vehicle.id,
        quantity: item.quantity,
      }));

      // Préparer la requête
      const orderRequest: OrderRequest = {
        clientId: user.id,
        orderType: paymentMethod === 'cash' ? 'CASH' : 'CREDIT',
        items: orderItems,
        shippingAddress,
        billingAddress: shippingAddress, // Même adresse pour la facturation
      };

      // Ajouter les détails de crédit si nécessaire
      if (paymentMethod === 'credit' && creditRequest) {
        orderRequest.creditDetails = {
          months: creditRequest.desiredDuration,
          interestRate: 5.5, // Taux d'intérêt par défaut (à ajuster selon vos besoins)
        };
      }

      // Créer la commande
      const response = await ordersService.createOrder(orderRequest);

      // Succès
      toast.success(`Commande créée avec succès !`);
      clearCart();
      
      return response;
    } catch (error: any) {
      console.error('Erreur lors de la création de la commande:', error);
      
      // Gérer les erreurs spécifiques
      if (error.response?.status === 400) {
        toast.error('Données de commande invalides');
      } else if (error.response?.status === 404) {
        toast.error('Client ou véhicule introuvable');
      } else {
        toast.error('Erreur lors de la création de la commande');
      }
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const approveCredit = async (orderId: number): Promise<boolean> => {
    try {
      await ordersService.approveCredit(orderId);
      toast.success('Crédit approuvé avec succès');
      return true;
    } catch (error) {
      toast.error('Erreur lors de l\'approbation du crédit');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
    try {
      await ordersService.updateStatus(orderId, status);
      toast.success('Statut de la commande mis à jour');
      return true;
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      return false;
    }
  };

  return {
    createOrder,
    approveCredit,
    updateOrderStatus,
    isProcessing,
  };
}