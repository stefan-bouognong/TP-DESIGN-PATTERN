import api from './index.service';

export interface SubscribeRequest {
  clientId: number;
  subscriptionType: string;
  vehicleTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  colors?: string[];
  availableOnly?: boolean;
  onSaleOnly?: boolean;
  yearFrom?: number;
  yearTo?: number;
  emailFrequency?: string;
}

export interface UnsubscribeRequest {
  clientId: number;
  subscriptionType: string;
}

export interface ClientPreferences {
  clientId: number;
  clientEmail: string;
  clientName: string;
  activeSubscriptions: string[];
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  preferredVehicleTypes: string[];
  minPrice: number;
  maxPrice: number;
  brands: string[];
  colors: string[];
  availableOnly: boolean;
  onSaleOnly: boolean;
  yearFrom: number;
  yearTo: number;
  emailFrequency: string;
  lastNotificationDate: string;
  totalNotifications: number;
}

export interface SubscriptionStats {
  subscriptionType: string;
  activeSubscribers: number;
  details: Array<{
    clientId: number;
    clientEmail: string;
    clientName: string;
    preferences: {
      vehicleTypes: string[];
      minPrice: number;
      maxPrice: number;
      brands: string[];
      availableOnly: boolean;
      onSaleOnly: boolean;
    };
  }>;
}

export interface DashboardResponse {
  success: boolean;
  dashboard: {
    subscriptionsByType: Record<string, number>;
    totalActiveSubscriptions: number;
    totalSubscribers: number;
    notificationsSent: number;
    topSubscribers: Array<{
      clientId: number;
      email: string;
      name: string;
      subscriptionCount: number;
      notificationCount: number;
    }>;
    vehicleTypeDistribution: Record<string, number>;
  };
  message: string;
  timestamp: string;
}

export interface NotificationHistory {
  id: number;
  eventType: string;
  clientId: number;
  clientEmail: string;
  vehicleId?: number;
  vehicleName?: string;
  message: string;
  sentAt: string;
  read: boolean;
}

export const subscriptionsService = {
  // Abonner un client
  subscribe: (data: SubscribeRequest) => 
    api.post('/subscriptions/subscribe', data),

  // Désabonner un client
  unsubscribe: (data: UnsubscribeRequest) => 
    api.post('/subscriptions/unsubscribe', data),

  // Mettre à jour les préférences
  updatePreferences: (clientId: number, preferences: Partial<ClientPreferences>) => 
    api.put(`/subscriptions/client/${clientId}/preferences`, preferences),

  // Obtenir les préférences d'un client
  getClientPreferences: (clientId: number) => 
    api.get<ClientPreferences>(`/subscriptions/client/${clientId}/preferences`),

  // Obtenir les statistiques par type
  getSubscriptionStats: (subscriptionType: string) => 
    api.get<SubscriptionStats>(`/subscriptions/stats/${subscriptionType}`),

  // Obtenir les types d'abonnement disponibles
  getSubscriptionTypes: () => 
    api.get<string[]>('/subscriptions/types'),

  // Obtenir le tableau de bord
  getDashboard: () => 
    api.get<DashboardResponse>('/subscriptions/dashboard'),

  // Obtenir l'historique des notifications
  getNotificationHistory: (clientId?: number, limit?: number) => 
    api.get<NotificationHistory[]>('/subscriptions/history', { 
      params: { clientId, limit } 
    }),

  // Marquer une notification comme lue
  markAsRead: (notificationId: number) => 
    api.patch(`/subscriptions/notifications/${notificationId}/read`),

  // Tester une notification
  testNotification: (clientId: number, subscriptionType: string) => 
    api.post(`/subscriptions/test-notification`, { clientId, subscriptionType }),
};