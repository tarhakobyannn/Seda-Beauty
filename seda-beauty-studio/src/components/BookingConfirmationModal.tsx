import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  X,
  Sparkles,
  MessageCircle,
  Download
} from 'lucide-react';
import { Booking } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { STUDIO_INFO } from '../data/mockData';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onDownloadCalendar: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onDownloadCalendar,
}) => {
  const { t, formatPrice } = useLanguage();

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-lg rounded-[28px] shadow-2xl flex flex-col border border-[#EAE0D5] overflow-hidden">
        {/* Header with warm luxury accent */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#432818] to-[#2E1A10] text-[#FDFBF7] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#EAE0D5] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A373] text-[#432818] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4A373]/20 border border-[#D4A373]/30 text-[#D4A373] text-[10px] font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Seda Beauty Studio</span>
              </div>
              <h3 className="font-serif font-bold text-lg md:text-xl text-white leading-snug">
                {t.confirmModal.title}
              </h3>
              <p className="text-xs text-[#EAE0D5]/90 mt-0.5">
                {t.confirmModal.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          {/* Booking Code Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#EAE0D5] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C6D58] font-bold block">
                {t.confirmModal.codeLabel}
              </span>
              <span className="text-xl font-mono font-bold text-[#432818]">
                {booking.bookingCode}
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.staffModal.statusConfirmed}
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE0D5] space-y-3 text-sm">
            <div className="flex justify-between items-start pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.serviceLabel}
              </span>
              <span className="font-serif font-bold text-[#1A1A1A] text-right max-w-[240px]">
                {booking.serviceName}
              </span>
            </div>

            <div className="flex justify-between items-start pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.branchLabel}
              </span>
              <span className="font-medium text-[#432818] text-right">
                {booking.branchName || 'Արարատի մարզ, ք․ Վեդի'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.dateTimeLabel}
              </span>
              <span className="font-semibold text-[#1A1A1A] font-mono">
                {booking.date} · {booking.time}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.durationLabel}
              </span>
              <span className="font-medium text-[#432818]">
                {booking.durationMinutes} {t.services.duration}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.clientLabel}
              </span>
              <span className="font-medium text-[#1A1A1A]">
                {booking.customerName}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-[#EAE0D5]">
              <span className="text-[#8C6D58] flex items-center gap-1.5 text-xs">
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                {t.confirmModal.phoneLabel}
              </span>
              <span className="font-mono text-[#432818]">
                {booking.customerPhone}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs uppercase font-bold text-[#8C6D58]">
                {t.confirmModal.priceLabel}
              </span>
              <span className="text-lg font-serif font-bold text-[#432818]">
                {formatPrice(booking.priceAMD)}
              </span>
            </div>
          </div>

          {/* Save to Calendar Reminder Box (Requirement 1) */}
          <div className="bg-[#D4A373]/15 border-2 border-[#D4A373]/40 p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#432818] text-[#D4A373] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-sm text-[#432818]">
                  {t.confirmModal.calendarReminderTitle}
                </h4>
                <p className="text-xs text-[#6C5549] mt-0.5 leading-relaxed">
                  {t.confirmModal.calendarReminderText}
                </p>
                <button
                  onClick={onDownloadCalendar}
                  className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#432818] hover:bg-[#341F14] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 text-[#D4A373]" />
                  <span>{t.confirmModal.saveCalendarBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${STUDIO_INFO.phoneRaw}`}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#EAE0D5] hover:border-[#432818] text-[#432818] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
              <span className="truncate">{t.confirmModal.callBtn}</span>
            </a>
            <a
              href={`https://wa.me/${STUDIO_INFO.phoneRaw.replace('+', '')}?text=${encodeURIComponent(
                `Hello Seda Beauty Studio, I booked an appointment with code ${booking.bookingCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="truncate">{t.confirmModal.whatsappBtn}</span>
            </a>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#EAE0D5]/30 border-t border-[#EAE0D5] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            {t.confirmModal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
