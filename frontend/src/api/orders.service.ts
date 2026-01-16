import api from './index.service';

export interface OrderItem {
  vehicleId: number;
  quantity: number;
}

export interface CreditDetails {
  months: number;
  interestRate: number;
}

export interface OrderRequest {
  clientId: number;
  orderType: 'CASH' | 'CREDIT';
  items: OrderItem[];
  shippingAddress: string;
  billingAddress?: string;
  creditDetails?: CreditDetails;
}

export interface OrderItemResponse {
  id: number;
  vehicleId: number;
  vehicleModel: string;
  vehicleType: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface OrderResponse {
  id: number;
  clientId: number;
  clientName: string;
  orderType: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  shippingAddress: string;
  billingAddress: string;
  items: OrderItemResponse[];
  cashDiscount: number | null;
  paid: boolean | null;
  months: number | null;
  interestRate: number | null;
  creditStatus: string | null;
  approved: boolean | null;
  monthlyPayment: number | null;
}

export const ordersService = {
  // Créer une commande
  createOrder: (data: OrderRequest) => 
    api.post<OrderResponse>('/orders', data),

  // Approuver une commande crédit
  approveCredit: (orderId: number) => 
    api.post<OrderResponse>(`/orders/${orderId}/approve-credit`),

  // Changer le statut d'une commande
  updateStatus: (orderId: number, status: string) => 
    api.put<OrderResponse>(`/orders/${orderId}/status`, { status }),

  // Obtenir une commande
  getOrder: (orderId: number) => 
    api.get<OrderResponse>(`/orders/${orderId}`),

  // Lister les commandes d'un client
  getClientOrders: (clientId: number) => 
    api.get<OrderResponse[]>(`/orders/client/${clientId}`),
};