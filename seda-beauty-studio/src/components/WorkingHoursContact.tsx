import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  Instagram,
  ExternalLink,
  MessageCircle,
  Navigation,
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface WorkingHoursContactProps {
  onBookNow: (branchId?: 'vedi' | 'artashat') => void;
}

export const WorkingHoursContact: React.FC<WorkingHoursContactProps> = ({ onBookNow }) => {
  const { t, branches } = useLanguage();
  const [selectedBranchId, setSelectedBranchId] = useState<'vedi' | 'artashat'>('vedi');

  // Local time calculator (UTC+4)
  const [localTimeStr, setLocalTimeStr] = useState<string>('');
  const [isOpenNow, setIsOpenNow] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format into Asia/Yerevan time (Armenia Standard Time)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Yerevan',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };

      const timeFormatter = new Intl.DateTimeFormat([], options);
      const timeParts = timeFormatter.formatToParts(now);
      const hour = parseInt(timeParts.find((p) => p.type === 'hour')?.value || '12', 10);
      const minute = parseInt(timeParts.find((p) => p.type === 'minute')?.value || '0', 10);

      // Get day in Armenia
      const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Yerevan',
        weekday: 'short',
      });
      const dayOfWeek = dayFormatter.format(now); // "Sun", "Mon", etc.
      const isSunday = dayOfWeek === 'Sun';

      setLocalTimeStr(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);

      const currentMinutes = hour * 60 + minute;
      const openMinutes = isSunday ? 11 * 60 : 10 * 60;
      const closeMinutes = isSunday ? 18 * 60 : 20 * 60;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        setIsOpenNow(true);
        setStatusMessage(
          `${t.contact.openNow} (${isSunday ? '18:00' : '20:00'})`
        );
      } else {
        setIsOpenNow(false);
        setStatusMessage(
          `${t.contact.closedNow} (${isSunday ? '11:00' : '10:00'})`
        );
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, [t]);

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <section id="contact" className="py-24 px-4 md:px-12 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE0D5]/60 text-[#432818] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{t.contact.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            {t.contact.title}
          </h2>
          <p className="text-[#6C5549] text-base md:text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Branch Selector Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-[#EAE0D5]/70 border border-[#D4A373]/30 shadow-sm">
            {branches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#432818] text-white shadow-md'
                      : 'text-[#432818] hover:text-[#1A1A1A]'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#D4A373]' : 'text-[#8C6D58]'}`} />
                  <span>{branch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Hours & Live Status */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-[24px] p-6 sm:p-8 border border-[#EAE0D5] shadow-sm">
            <div>
              {/* Live Status Pill */}
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE0D5] mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D58] block">
                    {t.contact.currentStatus} · {activeBranch.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {statusMessage}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#8C6D58] block">{t.contact.localTime}</span>
                  <span className="font-mono text-base font-bold text-[#432818]">
                    {localTimeStr}
                  </span>
                </div>
              </div>

              {/* Weekly Schedule */}
              <h3 className="font-serif font-semibold text-lg text-[#1A1A1A] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4A373]" />
                <span>{t.contact.hoursTitle}</span>
              </h3>

              <div className="space-y-3 text-xs text-[#432818]">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D5]">
                  <span className="font-semibold text-[#1A1A1A]">{t.contact.monFri}</span>
                  <span className="font-mono text-[#432818] font-bold">10:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D5]">
                  <span className="font-semibold text-[#1A1A1A]">{t.contact.sat}</span>
                  <span className="font-mono text-[#432818] font-bold">10:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D5]">
                  <span className="font-semibold text-[#1A1A1A]">{t.contact.sun}</span>
                  <span className="font-mono text-[#432818] font-bold">11:00 – 18:00</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D5] text-xs text-[#6C5549] flex items-start gap-2">
                <CalendarCheck className="w-4 h-4 text-[#D4A373] flex-shrink-0 mt-0.5" />
                <span>
                  {t.contact.reservationNotice}
                </span>
              </div>
            </div>

            {/* Quick action button */}
            <div className="mt-8 pt-6 border-t border-[#EAE0D5]">
              <button
                onClick={() => onBookNow(activeBranch.id)}
                className="w-full py-3.5 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#432818]/15 flex items-center justify-center gap-2"
              >
                <span>{t.contact.bookAtBranch} {activeBranch.name}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Location & Interactive Map Card */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-[24px] p-6 sm:p-8 border border-[#EAE0D5] shadow-sm">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#EAE0D5] mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D58] block">
                      {t.contact.branchLocation}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EAE0D5] text-[#432818] text-[10px] font-bold">
                      {activeBranch.region}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#1A1A1A] mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4A373] flex-shrink-0" />
                    <span>{activeBranch.addressFull}</span>
                  </h3>
                  <p className="text-xs text-[#8C6D58] mt-1">
                    {t.contact.directInquiries}: <strong className="text-[#432818] font-mono">{activeBranch.phone}</strong>
                  </p>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeBranch.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white hover:bg-[#FDFBF7] border border-[#D4A373] text-[#432818] text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-2 self-start sm:self-auto transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{t.contact.getDirections}</span>
                  <ExternalLink className="w-3 h-3 text-[#8C6D58]" />
                </a>
              </div>

              {/* Styled Interactive Map Embed */}
              <div className="relative rounded-2xl overflow-hidden border border-[#EAE0D5] h-64 bg-[#EAE0D5] mb-6 shadow-inner group">
                <iframe
                  key={activeBranch.id}
                  title={`Seda Beauty Studio ${activeBranch.name} Location Map`}
                  src={
                    activeBranch.id === 'vedi'
                      ? 'https://www.openstreetmap.org/export/embed.html?bbox=44.7000%2C39.9000%2C44.7600%2C39.9300&amp;layer=mapnik&amp;marker=39.9133%2C44.7297'
                      : 'https://www.openstreetmap.org/export/embed.html?bbox=44.5200%2C39.9400%2C44.5700%2C39.9750&amp;layer=mapnik&amp;marker=39.9575%2C44.5447'
                  }
                  className="w-full h-full border-0 filter contrast-[1.05] opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />

                {/* Styled Studio Location Overlay Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative flex flex-col items-center">
                    <div className="px-3 py-1 bg-[#432818] text-white text-[11px] font-serif rounded-full shadow-xl border border-[#D4A373] whitespace-nowrap mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-ping" />
                      <span>Seda Beauty · {activeBranch.name}</span>
                    </div>
                    <div className="w-4 h-4 bg-[#D4A373] rounded-full border-2 border-white shadow-lg ring-4 ring-[#D4A373]/30" />
                  </div>
                </div>

                {/* Map Control Bar Overlay */}
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-medium text-[#432818] border border-[#EAE0D5]">
                  {activeBranch.addressFull}
                </div>
              </div>

              {/* Contact Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={`tel:${STUDIO_INFO.phoneRaw}`}
                  className="p-3.5 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-[#EAE0D5] hover:border-[#D4A373] transition-all flex items-center gap-3 group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EAE0D5]/50 text-[#432818] flex items-center justify-center flex-shrink-0 group-hover:bg-[#432818] group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-[#8C6D58] block">
                      {t.contact.directCall}
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] truncate block font-mono">
                      {STUDIO_INFO.phone}
                    </span>
                  </div>
                </a>

                <a
                  href={STUDIO_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-[#EAE0D5] hover:border-[#D4A373] transition-all flex items-center gap-3 group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EAE0D5]/50 text-[#432818] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C13584] group-hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-[#8C6D58] block">
                      Instagram
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] truncate block">
                      @{STUDIO_INFO.instagramHandle}
                    </span>
                  </div>
                </a>

                <a
                  href={STUDIO_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-[#EAE0D5] hover:border-[#D4A373] transition-all flex items-center gap-3 group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EAE0D5]/50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-[#8C6D58] block">
                      WhatsApp
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] truncate block font-mono">
                      {STUDIO_INFO.phone}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
