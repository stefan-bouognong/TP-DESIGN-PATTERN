export type CustomerType = 'individual' | 'company';
export type CompanyType = 'parent' | 'subsidiary';

export interface AuthUser {
  id: string;
  email: string;
  customerType: CustomerType;
  profile: IndividualProfile | CompanyProfile;
  createdAt: Date;
}

export interface IndividualProfile {
  type: 'individual';
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CompanyProfile {
  type: 'company';
  companyType: CompanyType;
  companyName: string;
  siret: string;
  vatNumber: string;
  parentCompanyId?: string;
  parentCompanyName?: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  fleetSize?: number;
}

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'credit';

export interface CreditRequest {
  monthlyIncome: number;
  employmentStatus: 'employed' | 'self-employed' | 'retired' | 'other';
  employerName?: string;
  desiredDuration: 12 | 24 | 36 | 48 | 60;
}

export interface CheckoutData {
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  creditRequest?: CreditRequest;
}
