// API Configuration and Base Functions
const API_BASE_URL = 'http://localhost:8080';

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('drivedeal_token', token);
  } else {
    localStorage.removeItem('drivedeal_token');
    localStorage.removeItem('drivedeal_role');
  }
};

export const getAuthToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem('drivedeal_token');
  }
  return authToken;
};

// User role management
export const setUserRole = (role: string | null) => {
  if (role) {
    localStorage.setItem('drivedeal_role', role);
  } else {
    localStorage.removeItem('drivedeal_role');
  }
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('drivedeal_role');
};

// API Request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Essayer d'extraire le message d'erreur du backend
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorData: any = null;
    
    try {
      errorData = await response.json();
      // Le backend peut retourner soit {error: "...", message: "..."} soit juste {message: "..."}
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
      errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    }
    
    // Créer une erreur avec le message extrait
    const error = new Error(JSON.stringify(errorData || { message: errorMessage }));
    throw error;
  }

  return response.json();
};

// Types
export interface Vehicle {
  id: number;
  type: 'CAR' | 'SCOOTER';
  energyType: 'ELECTRIC' | 'GASOLINE';
  model: string;
  price: number;
  color: string;
  year: number;
  description: string;
}

export interface VehicleCreateRequest {
  factoryType: 'ELECTRIC' | 'GASOLINE';
  vehicleType: 'CAR' | 'SCOOTER';
  model: string;
  price: number;
  color: string;
  year: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: 'INDIVIDUAL' | 'COMPANY';
  firstName?: string;
  lastName?: string;
  nationality?: string;
  companyId?: string;
  vatNumber?: string;
  parentCompanyId?: number;
  fleetDiscount?: number;
}

export interface ClientCreateRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  clientType: 'INDIVIDUAL' | 'COMPANY';
  firstName?: string;
  lastName?: string;
  nationality?: string;
  companyId?: string;
  vatNumber?: string;
  parentCompanyId?: number;
}

export interface OrderItem {
  vehicleId: number;
  quantity: number;
}

export interface Order {
  id: number;
  clientId: number;
  clientName: string;
  orderType: 'CASH' | 'CREDIT';
  status: string;
  totalAmount: number;
  orderDate: string;
  items: Array<{
    id: number;
    vehicleId: number;
    vehicleModel: string;
    vehicleType: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
  }>;
  cashDiscount?: number;
  months?: number;
  interestRate?: number;
  monthlyPayment?: number;
}

export interface OrderCreateRequest {
  clientId: number;
  orderType: 'CASH' | 'CREDIT';
  items: OrderItem[];
  shippingAddress?: string;
  billingAddress?: string;
  creditDetails?: {
    months: number;
    interestRate: number;
  };
}

export interface DocumentBundle {
  orderId: number;
  clientId: number;
  bundleName: string;
  documentCount: number;
  completed: boolean;
  downloadPath: string | null;
  documentTypes: string[];
}

export interface Document {
  id: number;
  type: string;
  title: string;
  content: string;
  format: string;
  orderId: number;
  clientId: number;
  generatedAt: string;
  fileName: string;
}

export interface CatalogVehicle {
  vehicleId: number;
  model: string;
  displayHtml: string;
  displayType: string;
  decoratorCount: number;
  attributes: {
    vehicleId: number;
    model: string;
    price: number;
    hasAnimations: boolean;
    hasSaleBadge: boolean;
    hasOptions: boolean;
    discountPercentage?: number;
    salePrice?: number;
    availableOptions?: string[];
  };
}

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  message: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerClient: (data: RegisterRequest) =>
    apiRequest<string>('/api/auth/register-client', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerAdmin: () =>
    apiRequest<{ message: string }>('/api/auth/register-admin', { method: 'POST' }),
};

// Vehicles API (Abstract Factory Pattern)
export const vehiclesApi = {
  create: (data: VehicleCreateRequest) =>
    apiRequest<Vehicle>('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest<Vehicle[]>('/api/vehicles'),

  getById: (id: number) => apiRequest<Vehicle>(`/api/vehicles/${id}`),

  getByType: (type: string) => apiRequest<Vehicle[]>(`/api/vehicles/type/${type}`),

  getByEnergy: (energy: string) => apiRequest<Vehicle[]>(`/api/vehicles/energy/${energy}`),
};

// Clients API (Composite Pattern)
export const clientsApi = {
  create: (data: ClientCreateRequest) =>
    apiRequest<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest<Client[]>('/api/clients'),

  getById: (id: number) => apiRequest<Client>(`/api/clients/${id}`),

  addSubsidiary: (parentId: number, data: ClientCreateRequest) =>
    apiRequest<Client>(`/api/clients/company/${parentId}/add`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getHierarchy: (id: number) => apiRequest<any>(`/api/clients/${id}/hierarchy`),

  calculateFleetDiscount: (id: number) =>
    apiRequest<{ discount: number }>(`/api/clients/${id}/fleet-discount`),
};

// Orders API (Factory Method Pattern)
export const ordersApi = {
  create: (data: OrderCreateRequest) =>
    apiRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest<Order[]>('/api/orders'),

  getById: (id: number) => apiRequest<Order>(`/api/orders/${id}`),

  getByClient: (clientId: number) => apiRequest<Order[]>(`/api/orders/client/${clientId}`),

  updateStatus: (id: number, status: string) =>
    apiRequest<Order>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  approveCredit: (id: number) =>
    apiRequest<Order>(`/api/orders/${id}/approve-credit`, { method: 'POST' }),
};

// Documents API (Singleton Pattern)
export const documentsApi = {
  generate: (documentType: string, orderId: number, customData?: Record<string, string>) =>
    apiRequest<Document>('/api/documents/generate', {
      method: 'POST',
      body: JSON.stringify({ documentType, orderId, customData }),
    }),

  getByOrder: (orderId: number) => apiRequest<Document[]>(`/api/documents/order/${orderId}`),

  getTemplate: (type: string) =>
    apiRequest<{ type: string; title: string; content: string; placeholders: Record<string, string> }>(
      `/api/documents/template/${type}`
    ),

  generateBundle: (orderId: number) =>
    apiRequest<Document[]>(`/api/documents/order/${orderId}/bundle`, { method: 'POST' }),
};

// Document Bundles API (Builder Pattern)
export const documentBundlesApi = {
  createComplete: (orderId: number) =>
    apiRequest<DocumentBundle>('/api/document-bundles/complete', {
      method: 'POST',
      body: JSON.stringify({ orderId, bundleType: 'COMPLETE' }),
    }),

  createMinimal: (orderId: number) =>
    apiRequest<DocumentBundle>('/api/document-bundles/minimal', {
      method: 'POST',
      body: JSON.stringify({ orderId, bundleType: 'MINIMAL' }),
    }),

  createRegistration: (orderId: number) =>
    apiRequest<DocumentBundle>('/api/document-bundles/registration', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  getByOrder: (orderId: number) => apiRequest<DocumentBundle>(`/api/document-bundles/order/${orderId}`),

  download: (orderId: number) => `${API_BASE_URL}/api/document-bundles/download/${orderId}`,
};

// PDF API (Adapter Pattern)
export const pdfApi = {
  convert: (documentId: number, saveToDatabase = true, customFileName?: string) =>
    apiRequest<{
      documentId: number;
      originalTitle: string;
      pdfFileName: string;
      fileSize: number;
      downloadUrl: string;
      savedToDatabase: boolean;
    }>('/api/pdf/convert', {
      method: 'POST',
      body: JSON.stringify({ documentId, saveToDatabase, customFileName }),
    }),

  convertBatch: (documentIds: number[], createZip = false) =>
    apiRequest<{
      totalDocuments: number;
      successfulConversions: number;
      failedConversions: number;
      convertedDocuments: any[];
    }>('/api/pdf/convert/batch', {
      method: 'POST',
      body: JSON.stringify({ documentIds, createZip }),
    }),

  downloadUrl: (documentId: number) => `${API_BASE_URL}/api/pdf/download/${documentId}`,

  previewUrl: (documentId: number) => `${API_BASE_URL}/api/pdf/preview/${documentId}`,
};

// Forms API (Bridge Pattern)
export const formsApi = {
  render: (formType: string, entityId: number, rendererType: 'HTML' | 'WIDGET', includeDetails = true) =>
    apiRequest<{
      formType: string;
      rendererType: string;
      title: string;
      content: string;
      entityId: number;
      mimeType: string;
      fieldCount: number;
    }>('/api/forms/render', {
      method: 'POST',
      body: JSON.stringify({ formType, entityId, rendererType, includeDetails }),
    }),

  getVehicleHtml: (id: number) => `${API_BASE_URL}/api/forms/vehicle/${id}/html`,
  getVehicleWidget: (id: number) => apiRequest<any>(`/api/forms/vehicle/${id}/widget`),
  getClientHtml: (id: number) => `${API_BASE_URL}/api/forms/client/${id}/html`,
  getOrderHtml: (id: number) => `${API_BASE_URL}/api/forms/order/${id}/html`,
};

// Catalog API (Decorator Pattern)
export const catalogApi = {
  getVehicles: () =>
    apiRequest<{
      vehicles: CatalogVehicle[];
      viewType: string;
      totalVehicles: number;
      hasAnimations: boolean;
      hasSaleItems: boolean;
    }>('/api/catalog/vehicles'),

  getEnhanced: () =>
    apiRequest<{
      vehicles: CatalogVehicle[];
      viewType: string;
      totalVehicles: number;
      hasAnimations: boolean;
      hasSaleItems: boolean;
    }>('/api/catalog/vehicles/enhanced'),

  decorate: (
    id: number,
    decorators: string[],
    options?: {
      includeAnimations?: boolean;
      includeSaleBadge?: boolean;
      showOptions?: boolean;
      showRecommendations?: boolean;
      theme?: string;
    }
  ) =>
    apiRequest<CatalogVehicle>(`/api/catalog/vehicle/${id}/decorate`, {
      method: 'POST',
      body: JSON.stringify({
        decorators,
        ...options,
      }),
    }),

  getFullyDecorated: (id: number) => apiRequest<CatalogVehicle>(`/api/catalog/vehicle/${id}/fully-decorated`),
};

// Iterator API
export const iteratorApi = {
  sequential: (limit = 10) =>
    apiRequest<Vehicle[]>(`/api/iterator/sequential?limit=${limit}`),

  filtered: (filters: {
    vehicleTypes?: string[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) =>
    apiRequest<Vehicle[]>('/api/iterator/filtered', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),

  paginated: (page: number, size: number, filters?: { onSale?: boolean }) =>
    apiRequest<{
      content: Vehicle[];
      totalPages: number;
      totalElements: number;
    }>(`/api/iterator/paginated?page=${page}&size=${size}`, {
      method: 'POST',
      body: JSON.stringify(filters || {}),
    }),

  search: (params: {
    searchKeyword?: string;
    vehicleTypes?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) =>
    apiRequest<Vehicle[]>('/api/iterator/search', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getStats: () => apiRequest<any>('/api/iterator/stats'),
};

// Observer API
export const observerApi = {
  testSmtp: () => apiRequest<{ success: boolean; message: string }>('/api/observer/smtp-test'),

  testEmail: (to: string, subject: string, body: string) =>
    apiRequest<{ success: boolean; message: string }>('/api/observer/test-email', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body }),
    }),

  triggerVehicleAdded: () =>
    apiRequest<any>('/api/observer/trigger/vehicle-added', { method: 'POST' }),

  triggerPromotion: () =>
    apiRequest<any>('/api/observer/trigger/promotion', { method: 'POST' }),

  getSubscriptions: (clientId: number) =>
    apiRequest<string[]>(`/api/observer/subscriptions/${clientId}`),

  subscribe: (clientId: number, eventType: string) =>
    apiRequest<any>(`/api/observer/subscribe/${clientId}/${eventType}`, { method: 'POST' }),

  unsubscribe: (clientId: number, eventType: string) =>
    apiRequest<any>(`/api/observer/unsubscribe/${clientId}/${eventType}`, { method: 'DELETE' }),
};
