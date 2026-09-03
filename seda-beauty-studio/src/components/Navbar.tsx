import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Calendar,
  Instagram,
  ShieldCheck,
  Phone,
  Globe
} from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/types';

interface NavbarProps {
  onBookClick: () => void;
  onOpenAdmin: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookClick,
  onOpenAdmin,
  bookingsCount,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.hours, href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'hy', label: 'Հայերեն', short: 'ՀԱՅ' },
    { code: 'ru', label: 'Русский', short: 'РУС' },
    { code: 'en', label: 'English', short: 'ENG' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#EAE0D5]/80 py-3.5'
            : 'bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Studio Brand / Monogram */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-semibold transition-all ${
                isScrolled
                  ? 'bg-[#432818] text-white shadow-md'
                  : 'bg-[#D4A373] text-[#432818]'
              }`}
            >
              SB
            </div>
            <div>
              <span
                className={`font-serif text-xl tracking-tight font-medium block leading-none ${
                  isScrolled ? 'text-[#1A1A1A]' : 'text-white'
                }`}
              >
                Seda Beauty
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase block ${
                  isScrolled ? 'text-[#8C6D58]' : 'text-[#EAE0D5]'
                }`}
              >
                Studio · {t.hero.sub}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#D4A373] ${
                  isScrolled ? 'text-[#432818]' : 'text-[#FDFBF7] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Language Selector */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isScrolled
                    ? 'border-[#EAE0D5] bg-white text-[#432818] hover:border-[#D4A373]'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{currentLangObj.short}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#FDFBF7] rounded-2xl shadow-xl border border-[#EAE0D5] py-1 z-50 text-xs">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 font-medium flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-[#432818] text-white font-semibold'
                          : 'text-[#432818] hover:bg-[#EAE0D5]/50'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] opacity-70 font-mono">{l.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Phone Call */}
            <a
              href={`tel:${STUDIO_INFO.phoneRaw}`}
              className={`p-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isScrolled
                  ? 'text-[#432818] hover:bg-[#EAE0D5]/50'
                  : 'text-white hover:bg-white/10'
              }`}
              title={`${t.nav.call}: 093 33 24 14`}
            >
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              <span className="hidden xl:inline text-xs font-mono font-bold tracking-wide">093 33 24 14</span>
            </a>

            {/* Staff / Admin Portal Toggle Button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isScrolled
                  ? 'text-[#6C5549] hover:text-[#432818] hover:bg-[#EAE0D5]/50'
                  : 'text-[#EAE0D5] hover:text-white hover:bg-white/10'
              }`}
              title="Staff Portal (Password: 2026)"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
              <span className="hidden lg:inline text-[11px] font-semibold">{t.nav.staff}</span>
              {bookingsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#432818] text-white font-bold">
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* Instagram Profile */}
            <a
              href={STUDIO_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-[#6C5549] hover:text-[#D4A373] hover:bg-[#EAE0D5]/50'
                  : 'text-[#EAE0D5] hover:text-white hover:bg-white/10'
              }`}
              title="Instagram @seda__beauty"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Book Now Button */}
            <button
              onClick={onBookClick}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center gap-1.5 ${
                isScrolled
                  ? 'bg-[#432818] hover:bg-[#321c0f] text-white shadow-[#432818]/15'
                  : 'bg-[#D4A373] hover:bg-[#c79462] text-[#432818]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.nav.bookNow}</span>
            </button>
          </div>

          {/* Mobile Actions (Language + Hamburger) */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile quick language toggle */}
            <button
              onClick={() => {
                const nextLang = language === 'hy' ? 'ru' : language === 'ru' ? 'en' : 'hy';
                setLanguage(nextLang);
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                isScrolled
                  ? 'border-[#EAE0D5] bg-white text-[#432818]'
                  : 'border-white/20 bg-white/10 text-white'
              }`}
            >
              {currentLangObj.short}
            </button>

            <button
              onClick={onBookClick}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                isScrolled ? 'bg-[#432818] text-white' : 'bg-[#D4A373] text-[#432818]'
              }`}
            >
              {t.nav.bookNow}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl ${
                isScrolled ? 'text-[#432818]' : 'text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md sm:hidden animate-in fade-in">
          <div className="absolute top-20 left-4 right-4 bg-[#FDFBF7] rounded-[24px] p-6 shadow-2xl border border-[#EAE0D5] text-[#1A1A1A]">
            {/* Language Selector inside mobile menu */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D5] mb-4">
              <span className="text-xs uppercase font-bold text-[#8C6D58] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
                Լեզու / Язык / Language
              </span>
              <div className="flex gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      language === l.code
                        ? 'bg-[#432818] text-white'
                        : 'bg-[#EAE0D5]/50 text-[#432818]'
                    }`}
                  >
                    {l.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left font-serif text-lg text-[#432818] hover:text-[#D4A373] py-1 border-b border-[#EAE0D5]"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full py-3.5 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#432818]/20"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.nav.bookNow}</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="p-2.5 rounded-full border border-[#D4A373] text-xs font-medium text-[#432818] flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{t.nav.staff} ({bookingsCount})</span>
                </button>

                <a
                  href={`tel:${STUDIO_INFO.phoneRaw}`}
                  className="p-2.5 rounded-full bg-[#EAE0D5]/60 text-xs font-semibold text-[#432818] flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>093 33 24 14</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
