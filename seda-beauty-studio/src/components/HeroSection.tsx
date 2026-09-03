import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, Star, ShieldCheck, Clock, MapPin, ChevronRight, Phone } from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onBookClick: () => void;
  onExploreServices: () => void;
  onSelectServiceToBook?: (serviceId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookClick,
  onExploreServices,
  onSelectServiceToBook,
}) => {
  const { t, language, formatPrice } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  const heroShowcase = useMemo(() => {
    return [
      {
        id: 'waves',
        serviceId: 'hair-waves',
        title:
          language === 'hy'
            ? 'Հոլիվուդյան Ալիքներ'
            : language === 'ru'
            ? 'Голливудские Волны'
            : 'Signature Cascading Hollywood Waves',
        category:
          language === 'hy'
            ? 'Վարսահարդարում'
            : language === 'ru'
            ? 'Парикмахерское искусство'
            : 'Haute Coiffure',
        image: '/images/hair-waves.jpg',
        priceAMD: 12000,
        duration: '60',
        description:
          language === 'hy'
            ? 'Փարթամ, փայլուն և երկարակյաց ալիքներ ջերմային պաշտպանությամբ և հայելային փայլով:'
            : language === 'ru'
            ? 'Глянцевые, упругие струящиеся локоны с кератиновым термо-запечатыванием для блеска.'
            : 'Glossy, buoyant cascading curls with thermal keratin seal for red-carpet shine.',
      },
      {
        id: 'bridal',
        serviceId: 'hair-bridal-updo',
        title:
          language === 'hy'
            ? 'Հարսանեկոյն Հավաքվածք և Շինյոն'
            : language === 'ru'
            ? 'Свадебный Текстурный Низкий Пучок'
            : 'Bridal Textured Low Chignon Updo',
        category:
          language === 'hy'
            ? 'Հարսանեկան Ատելիե'
            : language === 'ru'
            ? 'Свадебное ателье'
            : 'Bridal Atelier',
        image: '/images/bridal-chignon.jpg',
        priceAMD: 18000,
        duration: '90',
        description:
          language === 'hy'
            ? 'Եվրոպական բարձրակարգ հավաքվածք՝ նախատեսված հատուկ Ձեր զգեստի և քողի համար:'
            : language === 'ru'
            ? 'Скульптурный европейский пучок, созданный под вырез платья и фату.'
            : 'Sculpted European chignon designed around your dress neckline and veil.',
      },
      {
        id: 'cherry',
        serviceId: 'nails-russian-manicure',
        title:
          language === 'hy'
            ? 'Ապարատային Մատնահարդարում (Ռուսական)'
            : language === 'ru'
            ? 'Аппаратный Маникюр (Russian Manicure)'
            : 'Glossy Deep Cherry Russian Manicure',
        category:
          language === 'hy'
            ? 'Եղունգների Խնամք'
            : language === 'ru'
            ? 'Аппаратный маникюр'
            : 'Hardware Nails',
        image: '/images/cherry-manicure.jpg',
        priceAMD: 8000,
        duration: '60',
        description:
          language === 'hy'
            ? 'Մաշկի անթերի մշակում ադամանդե ֆրեզներով, հավասարեցում և հարուստ գույն:'
            : language === 'ru'
            ? 'Безупречная обработка кутикулы алмазными фрезами с глубоким глянцем.'
            : 'Immaculate diamond-bit cuticle care with rich autumnal cherry wine gloss.',
      },
      {
        id: 'french',
        serviceId: 'nails-french-art',
        title:
          language === 'hy'
            ? 'Միկրո-Ֆրենչ և Կաթնագույն Հիմք'
            : language === 'ru'
            ? 'Микро-Френч и Молочный Базовый Оттенок'
            : 'Micro-French Square & Milky Pink',
        category:
          language === 'hy'
            ? 'Հեղինակային Նեյլ-Արտ'
            : language === 'ru'
            ? 'Фирменный маникюр'
            : 'Signature Nails',
        image: '/images/french-flower.jpg',
        priceAMD: 11000,
        duration: '75',
        description:
          language === 'hy'
            ? 'Ձեռքով նկարված չափազանց բարակ ժպիտներ և կաթնագույն նուրբ երանգավորում:'
            : language === 'ru'
            ? 'Сверхчеткие линии улыбки ручной росписи на полупрозрачной молочной базе.'
            : 'Ultra-crisp hand-painted smile lines over translucent milky base.',
      },
      {
        id: 'curls-atelier',
        serviceId: 'hair-salon-curls',
        title:
          language === 'hy'
            ? 'Ատելիե Կիսահավաք Հարդարում'
            : language === 'ru'
            ? 'Полусобранная Укладка и Локоны'
            : 'Atelier Half-Up Styling & Curls',
        category:
          language === 'hy'
            ? 'Սեդայի Աշխատանքներ'
            : language === 'ru'
            ? 'Работы студии Седы'
            : 'Seda Studio Work',
        image: '/images/salon-curls.jpg',
        priceAMD: 10000,
        duration: '50',
        description:
          language === 'hy'
            ? 'Թեթև գանգուրներ և նուրբ հյուսվածքներ ցանկացած տոնակատարության համար:'
            : language === 'ru'
            ? 'Упругие стойкие кудри и мягкие закрепленные жгуты для мероприятий.'
            : 'Certified master styling with bouncy curls and soft pinned twists.',
      },
      {
        id: 'emerald',
        serviceId: 'nails-gel-extensions',
        title:
          language === 'hy'
            ? 'Գելային Երկարացում և Օմբրե Փայլ'
            : language === 'ru'
            ? 'Гелевое Наращивание и Блестящий Омбре'
            : 'Glitter Ombré Sculpted Tips',
        category:
          language === 'hy'
            ? 'Նեյլ-Արտ Երկարացում'
            : language === 'ru'
            ? 'Арт-наращивание'
            : 'Haute Nail Art',
        image: '/images/glitter-emerald.jpg',
        priceAMD: 15000,
        duration: '90',
        description:
          language === 'hy'
            ? 'Ամուր գելային տիպսեր և ադամանդյա փայլով օմբրե էֆեկտ:'
            : language === 'ru'
            ? 'Мягкие гелевые типсы полного покрытия с мерцающим алмазным омбре.'
            : 'Full-cover soft gel tips accented with shimmering diamond ombré.',
      },
    ];
  }, [language]);

  const currentItem = heroShowcase[activeIdx] || heroShowcase[0];

  const handleBookThisLook = (serviceId: string) => {
    if (onSelectServiceToBook) {
      onSelectServiceToBook(serviceId);
    } else {
      onBookClick();
    }
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-12 bg-[#FDFBF7] overflow-hidden">
      {/* Background Decorative Warm Accents */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#EAE0D5]/60 blur-3xl pointer-events-none -ml-32 -mb-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Copy & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Atelier Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAE0D5]/70 border border-[#D4A373]/40 text-[#432818] text-xs font-semibold uppercase tracking-widest mb-5 self-start">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Seda Beauty Studio</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#1A1A1A] leading-[1.1] tracking-tight">
              {t.hero.title}{' '}
              <span className="italic font-normal text-[#432818] underline decoration-[#D4A373]/40">
                {t.hero.titleLuxury}
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="mt-5 text-[#6C5549] text-base md:text-lg leading-relaxed max-w-xl">
              {t.hero.desc}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-book-now-btn"
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#432818] hover:bg-[#2F1C10] text-[#FDFBF7] text-sm font-medium tracking-wide shadow-lg shadow-[#432818]/15 hover:shadow-xl transition-all duration-200 group"
              >
                <Calendar className="w-4 h-4 text-[#D4A373]" />
                <span>{t.hero.reserveBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A373] transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-explore-treatments-btn"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FDFBF7] border border-[#EAE0D5] hover:border-[#D4A373] text-[#432818] text-sm font-medium transition-colors"
              >
                <span>{t.hero.exploreBtn}</span>
              </button>

              <a
                href={`tel:${STUDIO_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#EAE0D5]/70 hover:bg-[#EAE0D5] text-[#432818] text-xs font-bold tracking-wider transition-colors"
                title={`${t.hero.callBtn}: 093 33 24 14`}
              >
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>093 33 24 14</span>
              </a>
            </div>

            {/* Trust Indicators Bar */}
            <div className="mt-10 pt-8 border-t border-[#EAE0D5] grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="flex items-center gap-1 text-[#432818]">
                  <Star className="w-4 h-4 fill-[#D4A373] text-[#D4A373]" />
                  <span className="font-serif font-bold text-lg text-[#1A1A1A]">4.96</span>
                </div>
                <p className="text-xs text-[#6C5549] mt-0.5">{t.hero.reviewsLabel}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#432818]">
                  <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                  <span className="font-serif font-bold text-lg text-[#1A1A1A]">{t.hero.certified}</span>
                </div>
                <p className="text-xs text-[#6C5549] mt-0.5">{t.hero.certifiedDesc}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#432818]">
                  <MapPin className="w-4 h-4 text-[#D4A373]" />
                  <span className="font-serif font-bold text-base text-[#1A1A1A]">{t.hero.branchesLabel}</span>
                </div>
                <p className="text-xs text-[#6C5549] mt-0.5 font-medium">{t.hero.sub}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative bg-white rounded-[28px] p-3 sm:p-4 border border-[#EAE0D5] shadow-[0_12px_40px_rgba(67,40,24,0.08)]">
              
              {/* Featured Main Image with Smooth Cross-Fade */}
              <div className="relative aspect-[3/4] sm:aspect-[4/4.8] rounded-[22px] overflow-hidden bg-[#EAE0D5]/40 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentItem.id}
                    src={currentItem.image}
                    alt={currentItem.title}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#23140C]/90 via-[#23140C]/30 to-transparent pointer-events-none" />

                {/* Top Badge: Category & Atelier Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-[#432818]/85 backdrop-blur-md border border-[#D4A373]/40 text-[#FDFBF7] text-[11px] font-semibold uppercase tracking-wider">
                    {currentItem.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#432818] text-[11px] font-bold">
                    {formatPrice(currentItem.priceAMD)}
                  </span>
                </div>

                {/* Bottom Overlay: Title, Description & Action Button */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-[#FDFBF7] leading-snug">
                    {currentItem.title}
                  </h3>
                  <p className="text-xs text-[#EAE0D5] mt-1 line-clamp-2 leading-relaxed">
                    {currentItem.description}
                  </p>

                  <div className="mt-3.5 flex items-center justify-between gap-3 pt-3 border-t border-white/15">
                    <div className="flex items-center gap-1.5 text-xs text-[#D4A373]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentItem.duration} {t.services.duration} · {t.hero.session}</span>
                    </div>

                    <button
                      onClick={() => handleBookThisLook(currentItem.serviceId)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4A373] hover:bg-[#c29263] text-[#23140C] text-xs font-bold tracking-wide transition-colors shadow-md"
                    >
                      <span>{t.hero.bookThisLook}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Style Selector Carousel / Thumbnails */}
              <div className="mt-3 pt-2">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#6C5549]">
                    {t.hero.selectLook} ({activeIdx + 1}/{heroShowcase.length})
                  </span>
                  <span className="text-[11px] text-[#D4A373] font-medium">{t.hero.realPhotos}</span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {heroShowcase.map((item, index) => {
                    const isSelected = index === activeIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveIdx(index)}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-200 group ${
                          isSelected
                            ? 'border-[#432818] ring-2 ring-[#D4A373]/50 scale-[1.03] shadow-md'
                            : 'border-transparent opacity-65 hover:opacity-100 hover:border-[#D4A373]'
                        }`}
                        title={item.title}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#432818]/20 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
