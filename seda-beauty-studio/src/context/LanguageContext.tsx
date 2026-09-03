import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language } from '../i18n/types';
import { TRANSLATIONS, LOCALIZED_SERVICES } from '../i18n/translations';
import { Service } from '../types';

export interface LocalizedBranch {
  id: 'vedi' | 'artashat';
  name: string;
  region: string;
  address: string;
  addressFull: string;
  city: string;
  phone: string;
  phoneRaw: string;
  mapQuery: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.hy;
  localizedServices: Service[];
  branches: LocalizedBranch[];
  currentBranchInfo: (branchId: 'vedi' | 'artashat') => LocalizedBranch;
  formatPrice: (amd: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'seda_beauty_language_pref';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const existingContext = useContext(LanguageContext);
  if (existingContext) {
    return <>{children}</>;
  }

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'hy' || saved === 'ru' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'hy'; // Default to Armenian as requested by user
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => {
    return TRANSLATIONS[language] || TRANSLATIONS.hy;
  }, [language]);

  // Transform localized services to match Service interface for current language
  const localizedServices: Service[] = useMemo(() => {
    return LOCALIZED_SERVICES.map((ls) => ({
      id: ls.id,
      name: ls.name[language] || ls.name.hy,
      category: (ls.category === 'skincare' ? 'facials' : ls.category) as Service['category'],
      priceAMD: ls.priceAMD,
      priceUSD: ls.priceUSD,
      durationMinutes: ls.durationMinutes,
      description: ls.description[language] || ls.description.hy,
      popular: ls.popular,
      image: ls.image,
      features: ls.features[language] || ls.features.hy,
      aftercare: ls.aftercare[language] || ls.aftercare.hy,
    }));
  }, [language]);

  // Localized branches
  const branches: LocalizedBranch[] = useMemo(() => {
    return [
      {
        id: 'vedi',
        name: language === 'hy' ? 'ք․ Վեդի (Ատելիե)' : language === 'ru' ? 'г. Веди (Ателье)' : 'Vedi Studio Atelier',
        city: language === 'hy' ? 'Վեդի' : language === 'ru' ? 'Веди' : 'Vedi',
        region: language === 'hy' ? 'Արարատի մարզ' : language === 'ru' ? 'Араратский регион' : 'Ararat Province',
        address: language === 'hy' ? 'ք․ Վեդի' : language === 'ru' ? 'г. Веди' : 'Vedi City',
        addressFull:
          language === 'hy'
            ? 'Արարատի մարզ, ք․ Վեդի'
            : language === 'ru'
            ? 'Араратский регион, г. Веди'
            : 'Ararat Province, Vedi City, Armenia',
        phone: '093 33 24 14',
        phoneRaw: '+37493332414',
        mapQuery: 'Vedi,+Ararat+Province,+Armenia',
        coordinates: {
          lat: 39.9133,
          lng: 44.7297,
        },
      },
      {
        id: 'artashat',
        name: language === 'hy' ? 'ք․ Արտաշատ (Ստուդիա)' : language === 'ru' ? 'г. Арташат (Студия)' : 'Artashat Studio Atelier',
        city: language === 'hy' ? 'Արտաշատ' : language === 'ru' ? 'Арташат' : 'Artashat',
        region: language === 'hy' ? 'Արարատի մարզ' : language === 'ru' ? 'Араратский регион' : 'Ararat Province',
        address: language === 'hy' ? 'ք․ Արտաշատ' : language === 'ru' ? 'г. Арташат' : 'Artashat City',
        addressFull:
          language === 'hy'
            ? 'Արարատի մարզ, ք․ Արտաշատ'
            : language === 'ru'
            ? 'Араратский регион, г. Арташат'
            : 'Ararat Province, Artashat City, Armenia',
        phone: '093 33 24 14',
        phoneRaw: '+37493332414',
        mapQuery: 'Artashat,+Ararat+Province,+Armenia',
        coordinates: {
          lat: 39.9575,
          lng: 44.5447,
        },
      },
    ];
  }, [language]);

  const currentBranchInfo = (branchId: 'vedi' | 'artashat'): LocalizedBranch => {
    return branches.find((b) => b.id === branchId) || branches[0];
  };

  const formatPrice = (amd: number) => {
    return `${amd.toLocaleString()} ֏`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        localizedServices,
        branches,
        currentBranchInfo,
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const fallbackBranches: LocalizedBranch[] = [
  {
    id: 'vedi',
    name: 'ք․ Վեդի (Ատելիե)',
    city: 'Վեդի',
    region: 'Արարատի մարզ',
    address: 'ք․ Վեդի',
    addressFull: 'Արարատի մարզ, ք․ Վեդի',
    phone: '093 33 24 14',
    phoneRaw: '+37493332414',
    mapQuery: 'Vedi,+Ararat+Province,+Armenia',
    coordinates: { lat: 39.9133, lng: 44.7297 },
  },
  {
    id: 'artashat',
    name: 'ք․ Արտաշատ (Ստուդիա)',
    city: 'Արտաշատ',
    region: 'Արարատի մարզ',
    address: 'ք․ Արտաշատ',
    addressFull: 'Արարատի մարզ, ք․ Արտաշատ',
    phone: '093 33 24 14',
    phoneRaw: '+37493332414',
    mapQuery: 'Artashat,+Ararat+Province,+Armenia',
    coordinates: { lat: 39.9575, lng: 44.5447 },
  },
];

const defaultFallbackContext: LanguageContextType = {
  language: 'hy',
  setLanguage: () => {},
  t: TRANSLATIONS.hy,
  localizedServices: LOCALIZED_SERVICES.map((ls) => ({
    id: ls.id,
    name: ls.name.hy,
    category: (ls.category === 'skincare' ? 'facials' : ls.category) as Service['category'],
    priceAMD: ls.priceAMD,
    priceUSD: ls.priceUSD,
    durationMinutes: ls.durationMinutes,
    description: ls.description.hy,
    popular: ls.popular,
    image: ls.image,
    features: ls.features.hy,
    aftercare: ls.aftercare.hy,
  })),
  branches: fallbackBranches,
  currentBranchInfo: (branchId: 'vedi' | 'artashat') =>
    fallbackBranches.find((b) => b.id === branchId) || fallbackBranches[0],
  formatPrice: (amd: number) => `${amd.toLocaleString()} ֏`,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return defaultFallbackContext;
  }
  return context;
};
