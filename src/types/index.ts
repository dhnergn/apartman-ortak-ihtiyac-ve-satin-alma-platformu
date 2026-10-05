export type UserRole = 'RESIDENT' | 'MANAGER' | 'PROVIDER' | 'SUPPLIER' | 'ADMIN';

export type VerificationStatus = 'VERIFIED' | 'DOCUMENT_SUBMITTED' | 'UNVERIFIED' | 'REJECTED';

export type NeedType =
  | 'PERSONAL_BULK_PURCHASE' // Bireysel toplu alım (örn. su arıtma filtresi, yangın tüpü)
  | 'COMMON_PROPERTY'        // Apartman ortak alanı tamir & bakım (örn. asansör, çatı)
  | 'SERVICE_CONTRACT'       // Düzenli hizmet sözleşmesi (örn. haftalık temizlik, bahçıvan)
  | 'SECURITY_PROJECT';      // Güvenlik yatırımı (örn. kamera sistemi, akıllı kilit)

export type NeedStatus =
  | 'COLLECTING_DEMAND' // Talep toplanıyor
  | 'QUOTING'           // Sağlayıcılardan teklifler toplanıyor
  | 'VOTING'            // Apartman oylamasında
  | 'ORDERED'           // Karar verildi, sipariş/hizmet aşamasında
  | 'COMPLETED'         // Tamamlandı
  | 'CANCELLED';        // İptal edildi

export type QuoteStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';

export type BallotDecision = 'YES' | 'NO' | 'ABSTAIN';

export type PaymentStatus = 'PAYMENT_PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  apartmentId?: string;
  unitId?: string;
}

export interface Apartment {
  id: string;
  name: string;
  city: string;
  district: string;
  addressLine: string;
  inviteCode: string;
  totalUnits: number;
  managerId: string;
  managerName: string;
  createdAt: string;
}

export interface ApartmentUnit {
  id: string;
  apartmentId: string;
  unitNumber: string; // e.g. "A01", "Daire 4"
  floorNumber: number;
  residentName?: string;
  residentId?: string;
}

export interface NeedParticipant {
  id: string;
  needId: string;
  userId: string;
  userName: string;
  unitId: string;
  unitNumber: string;
  quantity: number;
  joinedAt: string;
  notes?: string;
}

export interface Need {
  id: string;
  apartmentId: string;
  createdBy: string;
  createdByName: string;
  category: string;
  title: string;
  description: string;
  type: NeedType;
  targetParticipants: number;
  currentParticipants: number;
  totalQuantity: number;
  estimatedBudget?: number;
  deadline?: string;
  status: NeedStatus;
  createdAt: string;
  participants: NeedParticipant[];
  imageUrl?: string;
}

export interface Provider {
  id: string;
  userId: string;
  companyName: string;
  taxNumber?: string;
  providerType: 'SERVICE_PROVIDER' | 'SUPPLIER';
  verificationStatus: VerificationStatus;
  ratingScore: number;
  ratingCount: number;
  completedJobsCount: number;
  serviceCategories: string[];
  serviceRegions: string[];
  contactPhone: string;
  contactEmail: string;
}

export interface QuoteItem {
  id: string;
  itemTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  needId: string;
  providerId: string;
  providerName: string;
  providerVerification: VerificationStatus;
  providerRating: number;
  version: number;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  validityDate: string;
  estimatedStartDate?: string;
  completionTimeDays: number;
  warrantyMonths: number;
  installationIncluded: boolean;
  paymentTerms: string;
  description: string;
  status: QuoteStatus;
  createdAt: string;
  revisionNotes?: string;
}

export interface VoteBallot {
  unitId: string;
  unitNumber: string;
  userId: string;
  decision: BallotDecision;
  castAt: string;
}

export interface Vote {
  id: string;
  apartmentId: string;
  needId?: string;
  quoteId?: string;
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'CLOSED';
  ballots: VoteBallot[];
  totalEligibleUnits: number;
}

export interface AuditLog {
  id: string;
  apartmentId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  timestamp: string;
  ipAddress?: string;
}

export interface PaymentRecord {
  id: string;
  needId: string;
  unitId: string;
  unitNumber: string;
  userId: string;
  userName: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
}
