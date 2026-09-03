import React from 'react';
import { Sparkles, Heart, Award, Check } from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC<{ onBookNow: () => void }> = ({ onBookNow }) => {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t.about.p1Title,
      desc: t.about.p1Desc,
    },
    {
      title: t.about.p2Title,
      desc: t.about.p2Desc,
    },
    {
      title: t.about.p3Title,
      desc: t.about.p3Desc,
    },
    {
      title: t.about.p4Title,
      desc: t.about.p4Desc,
    },
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-[#FDFBF7] relative overflow-hidden">
      {/* Decorative subtle background circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EAE0D5]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D4A373]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Atmospheric Studio Imagery Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main large studio photo */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#432818]/10 border-4 border-white aspect-[4/5]">
                <img
                  src="/images/salon-curls.jpg"
                  alt="Seda Hovhannisyan Beauty Studio Ararat Vedi Artashat"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#23140C]/75 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-medium tracking-widest text-[#D4A373]">
                    {t.about.masterName}
                  </span>
                  <h4 className="text-xl font-serif font-medium mt-1 text-[#FDFBF7]">
                    {t.about.masterSub}
                  </h4>
                  <p className="text-xs text-[#EAE0D5] mt-0.5">
                    {t.about.masterDiplomas}
                  </p>
                </div>
              </div>

              {/* Floating secondary badge card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-5 rounded-[24px] shadow-xl shadow-[#432818]/10 border border-[#EAE0D5] max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EAE0D5]/50 text-[#432818] flex items-center justify-center font-bold">
                    <Award className="w-5 h-5 text-[#D4A373]" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-base text-[#1A1A1A] block">
                      {t.about.certifiedMaster}
                    </span>
                    <span className="text-xs text-[#6C5549]">
                      {t.about.coiffure}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating quote pill */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-[#432818] text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-serif flex items-center gap-2 border border-[#D4A373]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{t.about.quote}</span>
              </div>
            </div>
          </div>

          {/* Right: Studio Story & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE0D5]/60 text-[#432818] text-xs font-semibold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{t.about.tagline}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-[1.15]">
              {t.about.title}
            </h2>

            <p className="text-base md:text-lg text-[#432818]/85 font-normal leading-relaxed">
              {t.about.p1}
            </p>

            <p className="text-sm md:text-base text-[#6C5549] leading-relaxed">
              {t.about.p2}
            </p>

            {/* 4 Pillars of Excellence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {pillars.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[20px] bg-white border border-[#EAE0D5] shadow-sm hover:border-[#D4A373] transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] mb-1">
                    <Check className="w-4 h-4 text-[#D4A373] flex-shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-[#6C5549] pl-6 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onBookNow}
                className="px-7 py-3.5 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white text-sm font-semibold uppercase tracking-wider transition-all shadow-lg shadow-[#432818]/15 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.about.experienceBtn}
              </button>

              <a
                href={STUDIO_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#FDFBF7] border border-[#D4A373] text-[#432818] text-sm font-medium transition-colors"
              >
                Instagram @{STUDIO_INFO.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
