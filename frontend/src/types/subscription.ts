// src/types/subscription.ts
export interface Subscription {
  id?: number;
  clientId: number;
  subscriptionType: string;
  vehicleTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  emailFrequency?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionType {
  value: string;
  label: string;
  description: string;
}

export interface ClientSubscription {
  clientId: number;
  email: string;
  name: string;
  activeSubscriptions: string[];
  preferences: {
    vehicleTypes: string[];
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    emailFrequency: string;
  };
}

export interface UnsubscribeRequest {
  clientId: number;
  subscriptionType: string;
}