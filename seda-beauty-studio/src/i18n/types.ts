export type Language = 'hy' | 'ru' | 'en';

export interface LocalizedService {
  id: string;
  category: 'hair' | 'lashes' | 'brows' | 'skincare' | 'nails';
  name: { hy: string; ru: string; en: string };
  description: { hy: string; ru: string; en: string };
  priceAMD: number;
  priceUSD: number;
  durationMinutes: number;
  popular?: boolean;
  image: string;
  features: { hy: string[]; ru: string[]; en: string[] };
  aftercare: { hy: string; ru: string; en: string };
}
