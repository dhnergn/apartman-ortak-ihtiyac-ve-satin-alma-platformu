import { z } from 'zod';

export const createApartmentSchema = z.object({
  name: z.string().min(3, 'Apartman/Site adı en az 3 karakter olmalıdır').max(100),
  city: z.string().min(2, 'Şehir adı zorunludur'),
  district: z.string().min(2, 'İlçe adı zorunludur'),
  addressLine: z.string().min(5, 'Adres detayı gereklidir'),
  totalUnits: z.number().int().min(2, 'En az 2 bağımsız bölüm (daire) olmalıdır').max(500),
  unitPrefix: z.string().max(10).optional().default('Daire '),
  managerUnitNumber: z.string().min(1, 'Yöneticinin bulunduğu daire numarası belirtilmelidir').default('1'),
  postalCode: z.string().max(10).optional(),
});

export const createNeedSchema = z.object({
  apartmentId: z.string().min(1, 'Apartman ID zorunludur'),
  category: z.string().min(2, 'Kategori seçilmelidir'),
  title: z.string().min(5, 'İhtiyaç başlığı en az 5 karakter olmalıdır').max(120),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır').max(1000),
  type: z.enum(['PERSONAL_BULK_PURCHASE', 'COMMON_PROPERTY', 'SERVICE_CONTRACT', 'SECURITY_PROJECT']),
  targetParticipants: z.number().int().min(1, 'En az 1 daire hedeflenmelidir'),
  estimatedBudget: z.number().nonnegative().optional(),
  deadlineDays: z.number().int().min(1).max(90).default(14),
  initialQuantity: z.number().int().min(1).default(1),
  userNotes: z.string().max(255).optional(),
});

export const joinNeedSchema = z.object({
  needId: z.string().min(1),
  apartmentId: z.string().min(1),
  unitId: z.string().min(1),
  quantity: z.number().int().min(1, 'Adet en az 1 olmalıdır').max(50),
  notes: z.string().max(200).optional(),
});

export const quoteItemSchema = z.object({
  itemTitle: z.string().min(2, 'Hizmet/Ürün adı zorunludur'),
  quantity: z.number().int().min(1),
  unitPrice: z.number().positive('Birim fiyat 0 dan büyük olmalıdır'),
});

export const createQuoteSchema = z.object({
  needId: z.string().min(1),
  providerId: z.string().min(1),
  items: z.array(quoteItemSchema).min(1, 'En az 1 kalem ürün/hizmet eklenmelidir'),
  warrantyMonths: z.number().int().min(0),
  completionTimeDays: z.number().int().min(1, 'En az 1 gün tamamlama süresi girilmelidir'),
  installationIncluded: z.boolean(),
  paymentTerms: z.string().min(3, 'Ödeme şartı belirtilmelidir'),
  description: z.string().min(5, 'Teklif açıklaması gereklidir'),
  validityDays: z.number().int().min(1).max(90).default(30),
});

export const castVoteSchema = z.object({
  voteId: z.string().min(1),
  apartmentId: z.string().min(1),
  unitId: z.string().min(1),
  decision: z.enum(['YES', 'NO', 'ABSTAIN']),
});
