export type ServiceCategory = 'all' | 'hair' | 'nails' | 'lashes' | 'brows' | 'facials';

export interface Service {
  id: string;
  name: string;
  category: 'hair' | 'nails' | 'lashes' | 'brows' | 'facials';
  priceAMD: number;
  priceUSD: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
  image: string;
  features: string[];
  aftercare: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  serviceId: string;
  serviceName: string;
  branchId?: 'vedi' | 'artashat';
  branchName?: string;
  priceAMD: number;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24-hour format)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'hair' | 'nails' | 'lashes' | 'brows' | 'facials' | 'studio';
  image: string;
  caption: string;
}

export interface StudioBranch {
  id: 'vedi' | 'artashat';
  name: string;
  nameArmenian: string;
  city: string;
  region: string;
  address: string;
  addressFull: string;
  mapQuery: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  phoneRaw: string;
}

export interface StudioInfo {
  name: string;
  tagline: string;
  instagramHandle: string;
  instagramUrl: string;
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  telegramUrl: string;
  address: string;
  city: string;
  region: string;
  country: string;
  branches: StudioBranch[];
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewsCount: number;
}
