import React, { useState, useMemo } from 'react';
import { Sparkles, ZoomIn, X, Calendar, Instagram } from 'lucide-react';
import { GalleryItem } from '../types';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface GallerySectionProps {
  onBookNow: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onBookNow }) => {
  const { t, language } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const tags = [
    { id: 'all', label: t.gallery.tags.all },
    { id: 'hair', label: t.gallery.tags.hair },
    { id: 'nails', label: t.gallery.tags.nails },
    { id: 'lashes', label: t.gallery.tags.lashes },
    { id: 'brows', label: t.gallery.tags.brows },
    { id: 'studio', label: t.gallery.tags.studio },
  ];

  const localizedGalleryItems: GalleryItem[] = useMemo(() => {
    return [
      {
        id: 'gal-1',
        title:
          language === 'hy'
            ? 'Հոլիվուդյան Փայլուն Ալիքներ'
            : language === 'ru'
            ? 'Глянцевые Голливудские Волны'
            : 'Signature Hollywood Waves',
        category: 'hair',
        image: '/images/hair-waves.jpg',
        caption:
          language === 'hy'
            ? 'Հեղինակային ջերմային մշակում հայելային փայլով'
            : language === 'ru'
            ? 'Авторская термо-укладка с зеркальным блеском'
            : 'Signature thermal polish technique with radiant mirror shine',
      },
      {
        id: 'gal-2',
        title:
          language === 'hy'
            ? 'Հարսանեկան Շինյոն Ցածր Փնջով'
            : language === 'ru'
            ? 'Свадебный Текстурный Пучок'
            : 'Bridal Low Textured Chignon',
        category: 'hair',
        image: '/images/bridal-chignon.jpg',
        caption:
          language === 'hy'
            ? 'Հարմարեցված քողի և հարսանեկան զգեստի համար'
            : language === 'ru'
            ? 'Идеально адаптирован под фату и вырез платья'
            : 'Sculpted for veil attachment and bridal dress neckline',
      },
      {
        id: 'gal-3',
        title:
          language === 'hy'
            ? 'Ռուսական Ապարատային Մատնահարդարում'
            : language === 'ru'
            ? 'Русский Аппаратный Маникюр'
            : 'Cherry Russian Hardware Manicure',
        category: 'nails',
        image: '/images/cherry-manicure.jpg',
        caption:
          language === 'hy'
            ? 'Մաքուր մաշկ, ադամանդե ֆրեզներ և բալագույն խորը փայլ'
            : language === 'ru'
            ? 'Чистый срез, алмазные фрезы и глубокий черешневый глянец'
            : 'Clean diamond cuticle prep with autumnal cherry gloss',
      },
      {
        id: 'gal-4',
        title:
          language === 'hy'
            ? 'Միկրո-Ֆրենչ Ծաղկային Նեյլ-Արտ'
            : language === 'ru'
            ? 'Микро-Френч с Цветочным Арт-Дизайном'
            : 'Micro-French Square Floral Art',
        category: 'nails',
        image: '/images/french-flower.jpg',
        caption:
          language === 'hy'
            ? 'Ձեռքով նկարված նուրբ ծաղիկներ կաթնագույն հիմքի վրա'
            : language === 'ru'
            ? 'Ручная роспись нежных цветов на молочной базе'
            : 'Hand-painted delicate botanicals over milky pink base',
      },
      {
        id: 'gal-5',
        title:
          language === 'hy'
            ? 'Սեդայի Ատելիե Կիսահավաք Հարդարում'
            : language === 'ru'
            ? 'Полусобранная Студийная Укладка'
            : 'Salon Half-Up Curls & Twists',
        category: 'hair',
        image: '/images/salon-curls.jpg',
        caption:
          language === 'hy'
            ? 'Թեթև փարթամ գանգուրներ և նուրբ հյուսվածքներ'
            : language === 'ru'
            ? 'Упругие локоны и нежные плетения'
            : 'Bouncy curls with gentle pinned twists for celebrations',
      },
      {
        id: 'gal-6',
        title:
          language === 'hy'
            ? 'Օմբրե Գելային Երկարացում'
            : language === 'ru'
            ? 'Изумрудно-Блестящее Наращивание'
            : 'Glitter Ombré Sculpted Soft Tips',
        category: 'nails',
        image: '/images/glitter-emerald.jpg',
        caption:
          language === 'hy'
            ? 'Շքեղ փայլ և ամուր գելային կառուցվածք'
            : language === 'ru'
            ? 'Роскошное мерцание и прочное гелевое укрепление'
            : 'Full soft-gel sculpted set with luxury diamond gradient',
      },
    ];
  }, [language]);

  const filteredItems = localizedGalleryItems.filter((item) =>
    selectedTag === 'all' ? true : item.category === selectedTag
  );

  return (
    <section id="gallery" className="py-24 px-4 md:px-12 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE0D5]/60 text-[#432818] text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{t.gallery.tagline}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A]">
              {t.gallery.title}
            </h2>
            <p className="text-[#6C5549] text-sm md:text-base mt-2 max-w-xl">
              {t.gallery.subtitle}
            </p>
          </div>

          <a
            href={STUDIO_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FDFBF7] border border-[#D4A373] text-[#432818] text-xs font-semibold shadow-sm transition-colors self-start md:self-auto"
          >
            <Instagram className="w-4 h-4 text-[#D4A373]" />
            <span>{t.gallery.instagramFollow} @{STUDIO_INFO.instagramHandle}</span>
          </a>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag.id
                  ? 'bg-[#432818] text-white shadow-md shadow-[#432818]/20'
                  : 'bg-white text-[#432818] hover:bg-[#EAE0D5]/40 border border-[#EAE0D5]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-[24px] overflow-hidden aspect-[3/4] bg-[#EAE0D5]/40 cursor-pointer shadow-[0_4px_20px_rgba(67,40,24,0.06)] hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 border border-[#EAE0D5]"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#23140C]/90 via-[#23140C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                <div className="self-end p-2 rounded-full bg-[#432818]/80 backdrop-blur-md border border-[#D4A373]/30">
                  <ZoomIn className="w-4 h-4 text-[#D4A373]" />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A373]">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-medium text-base text-[#FDFBF7] mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#EAE0D5] line-clamp-2 mt-1 font-light">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-[#23140C] text-white rounded-[28px] overflow-hidden border border-[#D4A373]/30 shadow-2xl flex flex-col">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            <div className="p-6 bg-[#2D1B10] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A373]">
                  {activeItem.category}
                </span>
                <h4 className="font-serif text-xl text-[#FDFBF7] mt-0.5">{activeItem.title}</h4>
                <p className="text-xs text-[#EAE0D5] mt-1 max-w-md">{activeItem.caption}</p>
              </div>

              <button
                onClick={() => {
                  setActiveItem(null);
                  onBookNow();
                }}
                className="px-6 py-2.5 rounded-full bg-[#D4A373] hover:bg-[#c79462] text-[#432818] font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap shadow-md transition-all self-start sm:self-auto"
              >
                <Calendar className="w-3.5 h-3.5 text-[#432818]" />
                <span>{t.gallery.bookLook}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
