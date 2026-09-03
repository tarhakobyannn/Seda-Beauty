import React, { useState, useMemo } from 'react';
import {
  Clock,
  Sparkles,
  Calendar,
  Check,
  Search,
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServicesSectionProps {
  onBookService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const { t, localizedServices, formatPrice } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalService, setDetailModalService] = useState<Service | null>(null);

  const categories: { id: ServiceCategory; label: string; count: number }[] = [
    { id: 'all', label: t.services.categories.all, count: localizedServices.length },
    {
      id: 'hair',
      label: t.services.categories.hair,
      count: localizedServices.filter((s) => s.category === 'hair').length,
    },
    {
      id: 'nails',
      label: t.services.categories.nails,
      count: localizedServices.filter((s) => s.category === 'nails').length,
    },
    {
      id: 'lashes',
      label: t.services.categories.lashes,
      count: localizedServices.filter((s) => s.category === 'lashes').length,
    },
    {
      id: 'brows',
      label: t.services.categories.brows,
      count: localizedServices.filter((s) => s.category === 'brows').length,
    },
    {
      id: 'facials',
      label: t.services.categories.facials,
      count: localizedServices.filter((s) => s.category === 'facials').length,
    },
  ];

  const filteredServices = useMemo(() => {
    return localizedServices.filter((s) => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [localizedServices, activeCategory, searchQuery]);

  return (
    <section id="services" className="py-24 px-4 md:px-12 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE0D5]/60 text-[#432818] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{t.services.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            {t.services.title}
          </h2>
          <p className="text-[#6C5549] text-base md:text-lg">
            {t.services.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#432818] text-white shadow-md shadow-[#432818]/20'
                    : 'bg-white hover:bg-[#EAE0D5]/40 text-[#432818] border border-[#EAE0D5]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === cat.id ? 'bg-[#D4A373] text-[#432818]' : 'bg-[#EAE0D5] text-[#432818]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.services.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EAE0D5] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6D58]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-[24px] overflow-hidden border border-[#EAE0D5] hover:border-[#D4A373] transition-all duration-300 shadow-[0_4px_24px_rgba(67,40,24,0.04)] hover:shadow-xl hover:shadow-[#432818]/10 flex flex-col group"
            >
              {/* Image with badges */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Popular Pill */}
                {service.popular && (
                  <div className="absolute top-4 left-4 bg-[#D4A373] text-[#432818] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                    {t.services.popularBadge}
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                  <Clock className="w-3 h-3 text-[#D4A373]" />
                  <span>{service.durationMinutes} {t.services.duration}</span>
                </div>

                {/* Price tag on image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between text-white">
                  <div>
                    <span className="text-xl font-serif font-bold text-white drop-shadow">
                      {formatPrice(service.priceAMD)}
                    </span>
                  </div>
                  <button
                    onClick={() => setDetailModalService(service)}
                    className="text-xs text-[#D4A373] hover:text-white flex items-center gap-0.5 underline underline-offset-2"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{t.services.careInfoBtn}</span>
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#1A1A1A] mb-2 group-hover:text-[#432818] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#6C5549] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Feature bullets */}
                  <div className="space-y-1.5 mb-6">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#432818]">
                        <Check className="w-3.5 h-3.5 text-[#D4A373] flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => onBookService(service.id)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#FDFBF7] hover:bg-[#432818] text-[#432818] hover:text-white border border-[#D4A373] hover:border-[#432818] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4A373] group-hover:text-white" />
                  <span>{t.services.bookBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Service Detail / Aftercare Modal */}
      {detailModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 border border-[#EAE0D5] shadow-2xl relative">
            <button
              onClick={() => setDetailModalService(null)}
              className="absolute right-4 top-4 p-2 text-[#8C6D58] hover:text-[#1A1A1A] hover:bg-[#FDFBF7] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={detailModalService.image}
                alt={detailModalService.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAE0D5]/50 text-[#432818]">
                  {detailModalService.category.toUpperCase()}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#1A1A1A] mt-0.5">
                  {detailModalService.name}
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#432818] bg-[#FDFBF7] p-4 rounded-[20px] border border-[#EAE0D5] mb-4">
              <div className="flex justify-between pb-2 border-b border-[#EAE0D5]">
                <span className="text-[#8C6D58]">{t.services.durationLabel}:</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {detailModalService.durationMinutes} {t.services.duration}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#EAE0D5]">
                <span className="text-[#8C6D58]">{t.services.priceLabel}:</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {formatPrice(detailModalService.priceAMD)}
                </span>
              </div>
              <div>
                <span className="text-[#8C6D58] font-semibold block mb-1">
                  {t.services.aftercareLabel}:
                </span>
                <p className="text-[#6C5549] leading-relaxed">
                  {detailModalService.aftercare}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDetailModalService(null)}
                className="px-4 py-2 text-xs text-[#6C5549] rounded-full hover:bg-[#FDFBF7]"
              >
                {t.services.closeModal}
              </button>
              <button
                onClick={() => {
                  const sId = detailModalService.id;
                  setDetailModalService(null);
                  onBookService(sId);
                }}
                className="px-6 py-2.5 bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md"
              >
                {t.services.bookNowModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
