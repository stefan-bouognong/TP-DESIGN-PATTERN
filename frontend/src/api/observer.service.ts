import api from './index.service';

export interface TestEmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface CustomEventRequest {
  eventType: string;
  message: string;
  data?: Record<string, any>;
}

export interface VehicleEventData {
  vehicleId?: number;
  name?: string;
  model?: string;
  brand?: string;
  price?: number;
  oldPrice?: number;
  newPrice?: number;
  available?: boolean;
  onSale?: boolean;
}

export interface SmtpTestResponse {
  success: boolean;
  connected: boolean;
  smtpInfo: string;
  message: string;
  timestamp: string;
}

export interface EventResponse {
  success: boolean;
  event: string;
  message: string;
  timestamp: string;
  vehicle?: string;
  price?: string;
  oldPrice?: string;
  newPrice?: string;
  discount?: string;
  savings?: string;
  vehicleId?: number;
  // Autres champs selon l'événement
}

export interface ObserverStats {
  totalObservers: number;
  observers: Array<{
    name: string;
    active: boolean;
    type: string;
    notificationCount: number;
  }>;
  totalEventsPublished: number;
  recentEventsCount: number;
  eventsByType: Record<string, number>;
  vehiclesAdded: number;
  promotionsSent: number;
  ordersNotified: number;
  lastEvent: {
    type: string;
    message: string;
    timestamp: string;
    vehicleName?: string;
  };
}

export interface HealthCheckResponse {
  timestamp: string;
  status: string;
  smtp: string;
  observers: number;
  observersActive: Array<{
    name: string;
    active: boolean;
    lastActivity: string;
  }>;
  message: string;
  success: boolean;
}

export interface EventType {
  name: string;
  description: string;
  requiresVehicleData: boolean;
}

export const observerService = {
  // Tester la connexion SMTP
  testSmtp: () => 
    api.get<SmtpTestResponse>('/observer/smtp-test'),

  // Tester l'envoi d'email
  testEmail: (data: TestEmailRequest) => 
    api.post<EventResponse>('/observer/test-email', data),

  // Déclencher un événement véhicule ajouté
  triggerVehicleAdded: (vehicleData?: VehicleEventData) => 
    api.post<EventResponse>('/observer/trigger/vehicle-added', vehicleData),

  // Déclencher un événement promotion
  triggerVehiclePromotion: (vehicleData?: VehicleEventData) => 
    api.post<EventResponse>('/observer/trigger/vehicle-promotion', vehicleData),

  // Déclencher un événement changement de prix
  triggerVehiclePriceChanged: (vehicleData: VehicleEventData) => 
    api.post<EventResponse>('/observer/trigger/vehicle-price-changed', vehicleData),

  // Déclencher un événement disponibilité changée
  triggerVehicleAvailabilityChanged: (vehicleId: number, available: boolean) => 
    api.post<EventResponse>('/observer/trigger/vehicle-availability-changed', {
      vehicleId,
      available
    }),

  // Déclencher un événement commande créée
  triggerOrderCreated: (orderData?: {
    orderId: number;
    customer: string;
    amount: number;
    vehicleName?: string;
  }) => 
    api.post<EventResponse>('/observer/trigger/order-created', orderData),

  // Déclencher un événement personnalisé
  triggerCustomEvent: (data: CustomEventRequest) => 
    api.post<EventResponse>('/observer/trigger/custom-event', data),

  // Obtenir les statistiques
  getStats: () => 
    api.get<ObserverStats>('/observer/stats'),

  // Tous les tests en une fois
  testAll: () => 
    api.post<EventResponse>('/observer/test-all'),

  // Workflow de test
  testWorkflow: (clientEmail: string, subscriptionType: string) => 
    api.post('/observer/workflow/test', { clientEmail, subscriptionType }),

  // Health check
  healthCheck: () => 
    api.get<HealthCheckResponse>('/observer/health'),

  // Types d'événements
  getEventTypes: () => 
    api.get<{ 
      success: boolean; 
      eventTypes: EventType[]; 
      count: number; 
      timestamp: string 
    }>('/observer/event-types'),

  // Notifications pour un véhicule spécifique
  getVehicleNotifications: (vehicleId: number) => 
    api.get(`/observer/vehicle/${vehicleId}/notifications`),

  // Historique des événements
  getEventHistory: (limit?: number, eventType?: string) => 
    api.get('/observer/history', { params: { limit, eventType } }),
};