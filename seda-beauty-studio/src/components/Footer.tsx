import React from 'react';
import {
  Instagram,
  Phone,
  MessageCircle,
  Send,
  MapPin,
  ShieldCheck,
  ArrowUp
} from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { t, branches, localizedServices } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#26160C] text-[#EAE0D5] pt-16 pb-12 px-6 md:px-12 border-t border-[#432818]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D2314]">
          {/* Studio Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A373] text-[#432818] flex items-center justify-center font-serif font-bold text-base shadow-sm">
                SB
              </div>
              <div>
                <span className="font-serif text-2xl font-medium text-white block">
                  Seda Beauty Studio
                </span>
                <span className="text-xs text-[#D4A373] tracking-widest uppercase block font-semibold">
                  {branches.map((b) => b.name).join(' · ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C2B2A4] leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={STUDIO_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#351E11] hover:bg-[#C13584] text-[#EAE0D5] hover:text-white flex items-center justify-center transition-colors border border-[#4E2D1A]"
                title="Instagram @seda__beauty"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={STUDIO_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#351E11] hover:bg-emerald-600 text-[#EAE0D5] hover:text-white flex items-center justify-center transition-colors border border-[#4E2D1A]"
                title="WhatsApp Seda Studio"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={STUDIO_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#351E11] hover:bg-sky-500 text-[#EAE0D5] hover:text-white flex items-center justify-center transition-colors border border-[#4E2D1A]"
                title="Telegram Seda Studio"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`tel:${STUDIO_INFO.phoneRaw}`}
                className="w-9 h-9 rounded-full bg-[#351E11] hover:bg-[#D4A373] hover:text-[#432818] text-[#EAE0D5] flex items-center justify-center transition-colors border border-[#4E2D1A]"
                title="Call 093 33 24 14"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C2B2A4]">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition-colors">
                  {t.nav.bookNow}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C2B2A4]">
              {localizedServices.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Hours Recap */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.locationsTitle}
            </h4>
            <div className="space-y-3 text-xs text-[#C2B2A4]">
              <div>
                {branches.map((b) => (
                  <div key={b.id} className="flex items-start gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-[#D4A373] flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-white">{b.addressFull}</span>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex items-center gap-2 text-white">
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                <a href={`tel:${STUDIO_INFO.phoneRaw}`} className="font-mono font-bold hover:text-[#D4A373]">
                  093 33 24 14
                </a>
              </div>

              <p className="pt-1 text-[#9E8B7F]">
                {t.contact.monFri}: 10:00 – 20:00
                <br />
                {t.contact.sun}: 11:00 – 18:00
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-[#D4A373] hover:underline flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.footer.staffLogin}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E8B7F]">
          <p>© {new Date().getFullYear()} Seda Beauty Studio. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <span>{branches.map((b) => b.name).join(' · ')}</span>
            <span>•</span>
            <a href="tel:093332414" className="hover:text-white font-mono">093 33 24 14</a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[#351E11] hover:bg-[#D4A373] text-[#EAE0D5] hover:text-[#432818] transition-colors flex items-center gap-1 text-[11px] font-medium"
              title={t.footer.top}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t.footer.top}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
