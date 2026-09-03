import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarPlus,
  Share2,
  MapPin,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking } from '../types';
import { STUDIO_INFO } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingSystemProps {
  bookings: Booking[];
  onAddBooking: (newBooking: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>) => Booking;
  selectedServiceId?: string | null;
  onSelectServiceId?: (id: string | null) => void;
  onOpenAdmin?: () => void;
}

// Convert "HH:MM" string to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes from midnight back to "HH:MM"
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  bookings,
  onAddBooking,
  selectedServiceId,
  onSelectServiceId,
  onOpenAdmin,
}) => {
  const { t, language, localizedServices, branches, currentBranchInfo, formatPrice } = useLanguage();

  // Wizard steps: 1: Service, 2: Date & Time, 3: Details & Confirmation, 4: Success
  const [step, setStep] = useState<number>(selectedServiceId ? 2 : 1);

  // Selected state
  const [currentServiceId, setCurrentServiceId] = useState<string>(
    selectedServiceId || localizedServices[1]?.id || 'lash-hybrid'
  );

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedServiceId) {
      setCurrentServiceId(selectedServiceId);
      setStep(2);
    }
  }, [selectedServiceId]);

  // Date selection (defaults to tomorrow)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // Time slot selection
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Selected branch
  const [selectedBranchId, setSelectedBranchId] = useState<'vedi' | 'artashat'>('vedi');

  // Customer form details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('+374 ');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Confirmed booking artifact & modal popup state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  // Current selected branch object
  const activeBranch = useMemo(() => {
    return currentBranchInfo(selectedBranchId);
  }, [selectedBranchId, currentBranchInfo]);

  // Current selected service object
  const activeService = useMemo(() => {
    return localizedServices.find((s) => s.id === currentServiceId) || localizedServices[0];
  }, [currentServiceId, localizedServices]);

  // Determine working hours for the selected date
  const daySchedule = useMemo(() => {
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday

    if (dayOfWeek === 0) {
      // Sunday: 11:00 to 18:00
      return { openMins: 11 * 60, closeMins: 18 * 60, isClosed: false };
    }
    // Mon - Sat: 10:00 to 20:00
    return { openMins: 10 * 60, closeMins: 20 * 60, isClosed: false };
  }, [selectedDate]);

  // Compute available and conflicting time slots based on active bookings & service duration
  const availableSlots = useMemo(() => {
    const slots: { time: string; available: boolean; conflictReason?: string }[] = [];
    const stepMins = 30; // 30-minute booking increments
    const requiredDuration = activeService.durationMinutes;

    // Filter active bookings for the chosen branch & date
    const dayBookings = bookings.filter(
      (b) =>
        b.date === selectedDate &&
        b.branchId === selectedBranchId &&
        b.status !== 'cancelled'
    );

    for (let m = daySchedule.openMins; m + requiredDuration <= daySchedule.closeMins; m += stepMins) {
      const slotStart = m;
      const slotEnd = m + requiredDuration;
      const slotTimeStr = minutesToTime(m);

      // Check collision against other confirmed appointments
      let hasConflict = false;
      let reason = '';

      for (const b of dayBookings) {
        const bStart = timeToMinutes(b.time);
        const bEnd = bStart + b.durationMinutes;

        // Overlap condition: slotStart < bEnd && slotEnd > bStart
        if (slotStart < bEnd && slotEnd > bStart) {
          hasConflict = true;
          reason = `Booked (${b.time} - ${minutesToTime(bEnd)})`;
          break;
        }
      }

      // Also prevent booking past times if chosen date is today
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (selectedDate === todayStr) {
        const currentMins = today.getHours() * 60 + today.getMinutes();
        if (slotStart <= currentMins + 45) {
          hasConflict = true;
          reason = 'Time has passed';
        }
      }

      slots.push({
        time: slotTimeStr,
        available: !hasConflict,
        conflictReason: reason,
      });
    }

    return slots;
  }, [selectedDate, selectedBranchId, bookings, activeService.durationMinutes, daySchedule]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust Monday as start of week: Monday is 0, Sunday is 6
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Empty slots before month start
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateObj < today;
      const isSelected = dateStr === selectedDate;

      // Count bookings on this day for the selected branch
      const count = bookings.filter(
        (b) => b.date === dateStr && b.branchId === selectedBranchId && b.status !== 'cancelled'
      ).length;

      days.push({
        dayNumber: day,
        dateStr,
        isPast,
        isSelected,
        bookingsCount: count,
      });
    }

    return days;
  }, [currentMonthDate, selectedDate, selectedBranchId, bookings]);

  const handleMonthPrev = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleMonthNext = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errors.name = t.booking.validationName;
    }
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errors.phone = t.booking.validationPhone;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate .ics calendar download
  const handleDownloadICS = () => {
    if (!confirmedBooking) return;
    const startStr = `${confirmedBooking.date.replace(/-/g, '')}T${confirmedBooking.time.replace(':', '')}00`;
    const startMinutes = timeToMinutes(confirmedBooking.time);
    const endMinutes = startMinutes + confirmedBooking.durationMinutes;
    const endStr = `${confirmedBooking.date.replace(/-/g, '')}T${minutesToTime(endMinutes).replace(':', '')}00`;

    const branchLocation = activeBranch.addressFull;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Seda Beauty Studio//Booking System//EN
BEGIN:VEVENT
UID:${confirmedBooking.id}@sedabeautystudio.am
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startStr}
DTEND:${endStr}
SUMMARY:${confirmedBooking.serviceName} - Seda Beauty Studio
DESCRIPTION:Booking Code: ${confirmedBooking.bookingCode}\\nClient: ${confirmedBooking.customerName}\\nStudio Branch: ${branchLocation}\\nPhone: ${activeBranch.phone}
LOCATION:${branchLocation}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Seda_Beauty_Booking_${confirmedBooking.bookingCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle final submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!selectedTime) {
      setFormErrors((prev) => ({ ...prev, time: t.booking.validationTime }));
      return;
    }

    const newBooking = onAddBooking({
      serviceId: activeService.id,
      serviceName: activeService.name,
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      priceAMD: activeService.priceAMD,
      durationMinutes: activeService.durationMinutes,
      date: selectedDate,
      time: selectedTime,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      notes: customerNotes.trim() || undefined,
      status: 'confirmed',
    });

    setConfirmedBooking(newBooking);
    // Requirement 1: Immediately show modal confirmation notification with details and save-to-calendar reminder!
    setShowConfirmationModal(true);
    setStep(4);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E8D4C8', '#9B5B53', '#F2DEC9'],
      });
    } catch {
      // Confetti non-critical
    }
  };

  const resetBookingFlow = () => {
    setStep(1);
    setSelectedTime('');
    setConfirmedBooking(null);
    setShowConfirmationModal(false);
    setCustomerNotes('');
    if (onSelectServiceId) onSelectServiceId(null);
  };

  // Weekday labels in current language
  const weekdayLabels = useMemo(() => {
    if (language === 'hy') {
      return ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'];
    }
    if (language === 'ru') {
      return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    }
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }, [language]);

  return (
    <section id="booking" className="py-20 px-4 md:px-8 bg-[#FDFBF7] relative">
      {/* Modal Confirmation Notification Immediately After Successful Booking (Requirement 1) */}
      <BookingConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        booking={confirmedBooking}
        onDownloadCalendar={handleDownloadICS}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE0D5]/60 text-[#432818] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Seda Beauty Studio</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            {t.booking.title}
          </h2>
          <p className="text-[#6C5549] text-base md:text-lg">
            {t.booking.subtitle}
          </p>

          {/* Staff toggle link */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-[#8C6D58] hover:text-[#432818] underline underline-offset-4 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{t.nav.staff}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker (Steps 1 to 3) */}
        {step < 4 && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#EAE0D5] -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#D4A373] transition-all duration-300 -z-0"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              {[
                { s: 1, label: t.booking.step1 },
                { s: 2, label: t.booking.step2 },
                { s: 3, label: t.booking.step3 },
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => {
                    if (item.s === 1 || (item.s === 2 && currentServiceId)) {
                      setStep(item.s);
                    }
                  }}
                  className={`relative z-10 flex flex-col items-center gap-1.5 transition-colors ${
                    step >= item.s ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                      step === item.s
                        ? 'bg-[#432818] text-white ring-4 ring-[#EAE0D5]'
                        : step > item.s
                        ? 'bg-[#D4A373] text-[#432818] font-bold'
                        : 'bg-white border-2 border-[#EAE0D5] text-[#8C6D58]'
                    }`}
                  >
                    {step > item.s ? <CheckCircle2 className="w-4 h-4 text-[#432818]" /> : item.s}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      step === item.s ? 'text-[#1A1A1A] font-semibold' : 'text-[#8C6D58]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Container Card */}
        <div className="bg-white rounded-[28px] shadow-xl shadow-[#432818]/5 border border-[#EAE0D5] overflow-hidden">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.booking.step1Title}</h3>
                  <p className="text-sm text-[#6C5549]">{t.booking.step1Desc}</p>
                </div>
                <div className="text-xs text-[#432818] bg-[#EAE0D5]/40 px-3.5 py-1.5 rounded-full border border-[#EAE0D5]">
                  {localizedServices.length} {t.nav.services}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localizedServices.map((srv) => {
                  const isSelected = srv.id === currentServiceId;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setCurrentServiceId(srv.id)}
                      className={`relative p-4 rounded-[20px] border-2 transition-all cursor-pointer flex gap-4 ${
                        isSelected
                          ? 'border-[#D4A373] bg-[#FDFBF7] shadow-md ring-2 ring-[#D4A373]/20'
                          : 'border-[#EAE0D5] hover:border-[#D4A373] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <img
                        src={srv.image}
                        alt={srv.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-medium text-base text-[#1A1A1A] truncate">
                            {srv.name}
                          </h4>
                          {srv.popular && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4A373] text-[#432818] flex-shrink-0">
                              {t.services.popularBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6C5549] line-clamp-2 my-1">
                          {srv.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EAE0D5]">
                          <span className="text-xs text-[#6C5549] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                            {srv.durationMinutes} {t.services.duration}
                          </span>
                          <span className="font-semibold text-sm text-[#1A1A1A]">
                            {formatPrice(srv.priceAMD)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#432818]/15"
                >
                  <span>{t.booking.continueToTime}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date Picker & Time Slot Selection */}
          {step === 2 && (
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.booking.step2Title}</h3>
                  <p className="text-sm text-[#6C5549]">
                    {t.booking.selectedService}:{' '}
                    <strong className="text-[#1A1A1A] font-semibold">{activeService.name}</strong>{' '}
                    ({activeService.durationMinutes} {t.services.duration} · {formatPrice(activeService.priceAMD)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#8C6D58] hover:text-[#432818] hover:underline flex items-center gap-1 self-start md:self-auto font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t.booking.changeService}</span>
                </button>
              </div>

              {/* Branch Selector Pill */}
              <div className="mb-6 p-4 rounded-2xl bg-[#EAE0D5]/40 border border-[#EAE0D5]">
                <span className="text-xs uppercase font-bold tracking-wider text-[#6C5549] block mb-2">
                  {t.booking.selectBranch}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {branches.map((b) => {
                    const isSelected = selectedBranchId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'bg-white border-[#432818] ring-2 ring-[#432818]/20 shadow-sm'
                            : 'bg-[#FDFBF7] border-[#EAE0D5] hover:border-[#D4A373]'
                        }`}
                      >
                        <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#D4A373]' : 'text-[#8C6D58]'}`} />
                        <div>
                          <span className="font-serif font-bold text-sm text-[#1A1A1A] block">
                            {b.name}
                          </span>
                          <span className="text-xs text-[#6C5549] block mt-0.5">
                            {b.addressFull}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Interactive Calendar */}
                <div className="lg:col-span-6 bg-[#FDFBF7] p-5 rounded-[24px] border border-[#EAE0D5]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-semibold text-lg text-[#1A1A1A]">
                      {currentMonthDate.toLocaleString(
                        language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US',
                        { month: 'long', year: 'numeric' }
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleMonthPrev}
                        className="p-1.5 rounded-full hover:bg-[#EAE0D5] text-[#432818] transition-colors"
                        aria-label="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleMonthNext}
                        className="p-1.5 rounded-full hover:bg-[#EAE0D5] text-[#432818] transition-colors"
                        aria-label="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday headers in localized language */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs font-semibold text-[#8C6D58]">
                    {weekdayLabels.map((day) => (
                      <div key={day} className="py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendarDays.map((d, index) => {
                      if (!d) {
                        return <div key={`empty-${index}`} className="h-10" />;
                      }

                      const isSunday = new Date(d.dateStr).getDay() === 0;

                      return (
                        <button
                          key={d.dateStr}
                          type="button"
                          disabled={d.isPast}
                          onClick={() => {
                            setSelectedDate(d.dateStr);
                            setSelectedTime('');
                          }}
                          className={`h-11 rounded-xl text-sm relative flex flex-col items-center justify-center transition-all ${
                            d.isPast
                              ? 'text-[#C7B5AA] cursor-not-allowed opacity-40 line-through'
                              : d.isSelected
                              ? 'bg-[#432818] text-white font-bold shadow-md shadow-[#432818]/30'
                              : 'hover:bg-[#EAE0D5] text-[#1A1A1A] font-medium'
                          }`}
                        >
                          <span>{d.dayNumber}</span>
                          {d.bookingsCount > 0 && !d.isSelected && !d.isPast && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] mt-0.5" />
                          )}
                          {isSunday && !d.isPast && !d.isSelected && (
                            <span className="text-[9px] text-[#8C6D58] -mt-1">11-18h</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-[11px] text-[#8C6D58]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#432818]" />
                      <span>{t.booking.calendarSelected}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D4A373]" />
                      <span>{t.booking.calendarBooked}</span>
                    </div>
                    <span>Yerevan (GMT+4)</span>
                  </div>
                </div>

                {/* Right: Time Slots */}
                <div className="lg:col-span-6 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#D4A373]" />
                      <span className="font-semibold text-sm text-[#1A1A1A]">
                        {t.booking.openSlotsTitle}
                      </span>
                    </div>
                    <span className="text-xs text-[#8C6D58]">
                      {activeService.durationMinutes} {t.services.duration}
                    </span>
                  </div>

                  {/* Slots container */}
                  <div className="flex-1 max-h-[340px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            title={slot.conflictReason || t.booking.slotAvailable}
                            className={`py-3 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all border ${
                              !slot.available
                                ? 'bg-[#F4EFEA] text-[#A89388] border-[#EAE0D5] cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[#432818] text-white border-[#432818] shadow-md shadow-[#432818]/25 scale-[1.02]'
                                : 'bg-white text-[#1A1A1A] border-[#EAE0D5] hover:border-[#D4A373] hover:bg-[#FDFBF7]'
                            }`}
                          >
                            <span className="text-sm font-mono">{slot.time}</span>
                            {!slot.available ? (
                              <span className="text-[10px] font-normal text-[#A89388] mt-0.5">
                                {t.booking.slotOccupied}
                              </span>
                            ) : (
                              <span className="text-[10px] font-normal text-[#8C6D58] mt-0.5">
                                {t.booking.slotAvailable}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notice about duration collision */}
                  <div className="mt-4 p-3.5 rounded-[18px] bg-[#FDFBF7] border border-[#EAE0D5] text-xs text-[#6C5549] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#D4A373] flex-shrink-0 mt-0.5" />
                    <span>
                      {t.booking.durationNotice}
                    </span>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#EAE0D5]">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#8C6D58] hover:text-[#1A1A1A] flex items-center gap-1 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{t.booking.backBtn}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!selectedTime}
                      onClick={() => setStep(3)}
                      className={`px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                        selectedTime
                          ? 'bg-[#432818] hover:bg-[#321c0f] text-white shadow-lg shadow-[#432818]/20'
                          : 'bg-[#D4A373]/50 text-white cursor-not-allowed'
                      }`}
                    >
                      <span>{t.booking.continueToDetails}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Information & Final Summary */}
          {step === 3 && (
            <div className="p-6 md:p-10">
              <div className="mb-6">
                <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.booking.step3Title}</h3>
                <p className="text-sm text-[#6C5549]">{t.booking.step3Desc}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form fields */}
                <form onSubmit={handleSubmitBooking} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                      {t.booking.nameLabel} <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Lusine Karapetyan"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-[#FDFBF7] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4A373] ${
                          formErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-[#EAE0D5]'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                      {t.booking.phoneLabel} <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+374 94 00 00 00"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-[#FDFBF7] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4A373] ${
                          formErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-[#EAE0D5]'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
                    )}
                    <span className="text-[11px] text-[#8C6D58] mt-1 block">
                      WhatsApp / SMS confirmation
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                      {t.booking.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE0D5] bg-[#FDFBF7] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                      {t.booking.notesLabel}
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-3" />
                      <textarea
                        rows={3}
                        placeholder={t.booking.notesPlaceholder}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EAE0D5] bg-[#FDFBF7] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#432818]/25 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4A373]" />
                      <span>{t.booking.confirmBtn}</span>
                    </button>
                  </div>
                </form>

                {/* Right: Summary Voucher Card */}
                <div className="lg:col-span-5 bg-[#FDFBF7] rounded-[24px] p-6 border border-[#EAE0D5] flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D5] mb-4">
                      <span className="text-xs uppercase tracking-widest font-semibold text-[#432818]">
                        {t.booking.summaryTitle}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAE0D5] text-[#432818] font-medium">
                        Seda Beauty Studio
                      </span>
                    </div>

                    <div className="space-y-4 text-sm text-[#432818]">
                      <div>
                        <span className="text-xs text-[#8C6D58] block">{t.confirmModal.serviceLabel}</span>
                        <p className="font-serif font-semibold text-base text-[#1A1A1A] mt-0.5">
                          {activeService.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#EAE0D5]">
                        <div>
                          <span className="text-xs text-[#8C6D58] block">{t.confirmModal.dateTimeLabel}</span>
                          <span className="font-medium text-[#1A1A1A] font-mono">
                            {selectedDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-[#8C6D58] block">{t.confirmModal.durationLabel}</span>
                          <span className="font-medium text-[#1A1A1A]">
                            {selectedTime} ({activeService.durationMinutes} {t.services.duration})
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#EAE0D5]">
                        <span className="text-xs text-[#8C6D58] block">{t.confirmModal.branchLabel}</span>
                        <div className="flex items-start gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4A373] flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-[#432818] font-medium leading-relaxed">
                            {activeBranch.addressFull}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8C6D58] mt-1">
                          Phone: <strong className="text-[#432818]">{activeBranch.phone}</strong>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#EAE0D5] flex items-baseline justify-between">
                        <span className="text-sm font-semibold text-[#1A1A1A]">{t.confirmModal.priceLabel}</span>
                        <div className="text-right">
                          <span className="text-xl font-serif font-bold text-[#432818]">
                            {formatPrice(activeService.priceAMD)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE0D5] text-[11px] text-[#8C6D58] leading-relaxed">
                    <p>• {t.booking.cancellationNotice}</p>
                    <p>• {t.booking.beverageNotice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation Voucher */}
          {step === 4 && confirmedBooking && (
            <div className="p-8 md:p-12 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#EAE0D5]/50 text-[#432818] flex items-center justify-center mx-auto mb-4 border border-[#D4A373]">
                <CheckCircle2 className="w-8 h-8 text-[#432818]" />
              </div>

              <span className="text-xs uppercase font-bold tracking-widest px-3.5 py-1 rounded-full bg-[#EAE0D5] text-[#432818]">
                {t.staffModal.statusConfirmed}
              </span>

              <h3 className="text-3xl font-serif text-[#1A1A1A] mt-3 mb-2">
                {t.booking.successTitle}
              </h3>
              <p className="text-sm text-[#6C5549] max-w-md mx-auto mb-6">
                {t.booking.successDesc}
              </p>

              {/* Printable / Savable Voucher */}
              <div className="bg-[#FDFBF7] rounded-[24px] p-6 border-2 border-dashed border-[#D4A373] text-left max-w-md mx-auto mb-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D5] mb-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#8C6D58] block">
                      {t.confirmModal.codeLabel}
                    </span>
                    <span className="font-mono font-bold text-lg text-[#432818]">
                      {confirmedBooking.bookingCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#8C6D58] block">{t.confirmModal.clientLabel}</span>
                    <span className="font-medium text-sm text-[#1A1A1A]">
                      {confirmedBooking.customerName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#432818]">
                  <div className="flex justify-between">
                    <span className="text-[#8C6D58]">{t.confirmModal.serviceLabel}:</span>
                    <strong className="text-[#1A1A1A]">{confirmedBooking.serviceName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C6D58]">{t.confirmModal.dateTimeLabel}:</span>
                    <strong className="text-[#1A1A1A]">
                      {confirmedBooking.date} at {confirmedBooking.time}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C6D58]">{t.confirmModal.durationLabel}:</span>
                    <span>{confirmedBooking.durationMinutes} {t.services.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C6D58]">{t.confirmModal.priceLabel}:</span>
                    <strong className="text-[#432818]">
                      {formatPrice(confirmedBooking.priceAMD)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[#8C6D58]">{t.confirmModal.branchLabel}:</span>
                    <span className="text-right font-medium">
                      {confirmedBooking.branchName || activeBranch.name}
                      <span className="block text-[11px] text-[#8C6D58]">
                        {activeBranch.addressFull}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownloadICS}
                  className="px-6 py-3 rounded-full bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                  <CalendarPlus className="w-4 h-4 text-[#D4A373]" />
                  <span>{t.confirmModal.saveCalendarBtn}</span>
                </button>

                <a
                  href={`${STUDIO_INFO.whatsappUrl}%20regarding%20booking%20${confirmedBooking.bookingCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.confirmModal.whatsappBtn}</span>
                </a>

                <button
                  onClick={resetBookingFlow}
                  className="px-6 py-3 rounded-full bg-white hover:bg-[#FDFBF7] border border-[#D4A373] text-[#432818] text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <span>{t.booking.bookAnother}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
