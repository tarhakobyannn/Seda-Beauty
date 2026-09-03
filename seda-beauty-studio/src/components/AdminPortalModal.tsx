import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  Download,
  RotateCcw,
  Plus,
  Lock,
  KeyRound,
  Sparkles,
  MapPin,
  LogOut
} from 'lucide-react';
import { Booking } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onUpdateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
  onAddManualBooking: (newBooking: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>) => Booking;
  onResetDemoData: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
  onAddManualBooking,
  onResetDemoData,
}) => {
  const { t, language, localizedServices, branches, formatPrice } = useLanguage();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Portal states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual walk-in appointment form state
  const [manualServiceId, setManualServiceId] = useState(localizedServices[0]?.id || 'hair-waves');
  const [manualBranchId, setManualBranchId] = useState<'vedi' | 'artashat'>('vedi');
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('13:00');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('+374 ');
  const [manualNotes, setManualNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // When admin clicks X or Cancel, reset auth and immediately close
  const handleClose = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
    setShowAddModal(false);
    onClose();
  };

  // Password submission check (password: 2026)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '2026') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError(t.staffModal.wrongPassword);
    }
  };

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const matchSearch =
          b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = statusFilter === 'all' || b.status === statusFilter;

        let matchDate = true;
        if (dateFilter === 'today') {
          matchDate = b.date === todayStr;
        } else if (dateFilter === 'upcoming') {
          matchDate = b.date >= todayStr;
        }

        return matchSearch && matchStatus && matchDate;
      })
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  }, [bookings, searchTerm, statusFilter, dateFilter, todayStr]);

  // Statistics (NOTE: Schedule Volume was removed per user requirement!)
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const todayCount = bookings.filter((b) => b.date === todayStr && b.status === 'confirmed').length;

    return { totalCount, confirmedCount, todayCount };
  }, [bookings, todayStr]);

  if (!isOpen) return null;

  // Render Password Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#FDFBF7] w-full max-w-md rounded-[28px] shadow-2xl flex flex-col border border-[#EAE0D5] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-[#432818] text-[#FDFBF7] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4A373] text-[#432818] flex items-center justify-center font-bold text-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-base text-white">
                  {t.staffModal.loginTitle}
                </h3>
                <p className="text-[11px] text-[#D4A373]">
                  Seda Beauty Studio
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full text-[#EAE0D5] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Password Form */}
          <div className="p-6 md:p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#D4A373]/20 border border-[#D4A373]/40 text-[#432818] flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-[#432818]" />
            </div>

            <p className="text-center text-xs text-[#6C5549] mb-6 leading-relaxed">
              {t.staffModal.loginDesc}
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder={t.staffModal.passwordPlaceholder}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-3 rounded-2xl border border-[#EAE0D5] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                />
                {passwordError && (
                  <p className="text-xs text-rose-600 mt-2 text-center font-medium">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-2xl border border-[#EAE0D5] text-[#6C5549] text-xs font-semibold hover:bg-[#EAE0D5]/50 transition-colors"
                >
                  {t.staffModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  {t.staffModal.loginBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Booking Code,Customer Name,Phone,Email,Branch,Date,Time,Duration (min),Service,Price (AMD),Status,Notes',
    ];
    const rows = filteredBookings.map(
      (b) =>
        `"${b.bookingCode}","${b.customerName}","${b.customerPhone}","${
          b.customerEmail || ''
        }","${b.branchName || ''}","${b.date}","${b.time}","${
          b.durationMinutes
        }","${b.serviceName}","${b.priceAMD}","${b.status}","${
          b.notes || ''
        }"`
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Seda_Beauty_Bookings_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const srv =
      localizedServices.find((s) => s.id === manualServiceId) ||
      localizedServices[0];
    const br = branches.find((b) => b.id === manualBranchId) || branches[0];

    onAddManualBooking({
      serviceId: srv.id,
      serviceName: srv.name,
      branchId: br.id,
      branchName: br.name,
      priceAMD: srv.priceAMD,
      durationMinutes: srv.durationMinutes,
      date: manualDate,
      time: manualTime,
      customerName: manualName.trim(),
      customerPhone: manualPhone.trim(),
      notes: manualNotes.trim() || undefined,
      status: 'confirmed',
    });

    setManualName('');
    setManualNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-5xl max-h-[90vh] rounded-[28px] shadow-2xl flex flex-col border border-[#EAE0D5] overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#432818] text-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4A373] text-[#432818] flex items-center justify-center font-bold text-xs">
              SB
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-white">
                {t.staffModal.title}
              </h3>
              <p className="text-xs text-[#D4A373]">
                {t.staffModal.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1 text-xs rounded-full bg-[#341F14] text-[#EAE0D5] hover:text-white flex items-center gap-1 transition-colors"
              title="Lock portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.staffModal.logout}</span>
            </button>
            {/* When admin presses x, staff portal automatically closes immediately */}
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-[#EAE0D5] hover:text-white hover:bg-[#341F14] transition-colors"
              title={t.staffModal.close}
              aria-label="Close Staff Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Strip (3 cards only - Schedule Volume removed per instruction!) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 md:px-6 bg-[#EAE0D5]/30 border-b border-[#EAE0D5]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D5] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#8C6D58] block font-semibold">
              {t.staffModal.todayClients}
            </span>
            <span className="text-xl font-serif font-bold text-[#1A1A1A]">
              {stats.todayCount} {t.staffModal.appointments}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D5] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#8C6D58] block font-semibold">
              {t.staffModal.activeBookings}
            </span>
            <span className="text-xl font-serif font-bold text-[#432818]">
              {stats.confirmedCount} {t.staffModal.confirmed}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#EAE0D5] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#8C6D58] block font-semibold">
              {t.staffModal.totalRegistered}
            </span>
            <span className="text-xl font-serif font-bold text-[#1A1A1A]">
              {stats.totalCount} {t.staffModal.total}
            </span>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EAE0D5] bg-white">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8C6D58] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.staffModal.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-[#EAE0D5] bg-[#FDFBF7] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#D4A373]"
              />
            </div>

            {/* Date filter pills */}
            <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-full border border-[#EAE0D5]">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateFilter === 'all'
                    ? 'bg-[#432818] text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.filterAll}
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateFilter === 'today'
                    ? 'bg-[#432818] text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.filterToday}
              </button>
              <button
                onClick={() => setDateFilter('upcoming')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  dateFilter === 'upcoming'
                    ? 'bg-[#432818] text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.filterUpcoming}
              </button>
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-full border border-[#EAE0D5]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[#432818] text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.filterAll}
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === 'confirmed'
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.statusConfirmed}
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.statusCompleted}
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === 'cancelled'
                    ? 'bg-rose-700 text-white font-semibold'
                    : 'text-[#6C5549] hover:bg-[#EAE0D5]'
                }`}
              >
                {t.staffModal.statusCancelled}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#432818] hover:bg-[#321c0f] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.staffModal.newWalkInBtn}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white hover:bg-[#FDFBF7] border border-[#D4A373] text-[#432818] text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download CSV report"
            >
              <Download className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{t.staffModal.exportCSV}</span>
            </button>
            <button
              onClick={onResetDemoData}
              className="p-2 text-xs text-[#8C6D58] hover:text-[#432818] hover:bg-[#FDFBF7] rounded-full transition-colors border border-transparent hover:border-[#EAE0D5]"
              title={t.staffModal.resetData}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bookings List Table */}
        <div className="flex-1 overflow-y-auto p-4 md:px-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-[#8C6D58]">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#D4A373]" />
              <p className="font-medium text-sm text-[#1A1A1A]">
                {language === 'hy'
                  ? 'Այս պարամետրերով ամրագրումներ չեն գտնվել:'
                  : language === 'ru'
                  ? 'Записей по вашему запросу не найдено.'
                  : 'No appointments matching this query.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => {
                const isToday = b.date === todayStr;

                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      b.status === 'cancelled'
                        ? 'bg-[#FDFBF7] opacity-60 border-[#EAE0D5]'
                        : b.status === 'completed'
                        ? 'bg-[#F4F9F5] border-emerald-200'
                        : isToday
                        ? 'bg-[#FDFBF7] border-[#D4A373] shadow-sm'
                        : 'bg-white border-[#EAE0D5] hover:shadow-md'
                    }`}
                  >
                    {/* Left: Code, Date & Time */}
                    <div className="flex items-start gap-3 min-w-[200px]">
                      <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D5] flex flex-col items-center justify-center text-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-[#D4A373]">
                          {new Date(b.date + 'T00:00:00').toLocaleDateString(
                            language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US',
                            { weekday: 'short' }
                          )}
                        </span>
                        <span className="font-bold text-sm text-[#1A1A1A]">
                          {b.date.split('-')[2]}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#432818]">
                            {b.bookingCode}
                          </span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#D4A373]/20 text-[#432818] font-bold">
                              {t.staffModal.filterToday}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6C5549] mt-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>
                            {b.time} ({b.durationMinutes} {t.services.duration})
                          </span>
                        </div>
                        {b.branchName && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#8C6D58] mt-0.5">
                            <MapPin className="w-3 h-3 text-[#D4A373]" />
                            <span>{b.branchName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Client and Service */}
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#8C6D58]" />
                        <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                          {b.customerName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#6C5549] mt-1">
                        <a
                          href={`tel:${b.customerPhone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-1 text-[#432818] hover:text-[#D4A373] transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#D4A373]" />
                          <span className="font-mono font-medium">{b.customerPhone}</span>
                        </a>
                      </div>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xs font-medium text-[#1A1A1A]">
                          {b.serviceName}
                        </span>
                        <span className="text-xs font-bold text-[#432818]">
                          · {formatPrice(b.priceAMD)}
                        </span>
                      </div>

                      {b.notes && (
                        <p className="text-[11px] text-[#8C6D58] mt-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EAE0D5] inline-block">
                          {b.notes}
                        </p>
                      )}
                    </div>

                    {/* Right: Status and Actions */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status === 'confirmed'
                          ? t.staffModal.statusConfirmed
                          : b.status === 'completed'
                          ? t.staffModal.statusCompleted
                          : t.staffModal.statusCancelled}
                      </span>

                      <div className="flex items-center gap-1">
                        {b.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => onUpdateStatus(b.id, 'completed')}
                              title={t.staffModal.markCompleted}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(b.id, 'cancelled')}
                              title={t.staffModal.cancelBooking}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'confirmed')}
                            title={t.staffModal.restoreBooking}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EAE0D5] text-[#432818] border border-[#EAE0D5] transition-colors text-xs font-semibold px-2"
                          >
                            {t.staffModal.restoreBooking}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Walk-in Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[#FDFBF7] w-full max-w-md rounded-2xl shadow-xl p-6 border border-[#EAE0D5] text-xs">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
                  {t.staffModal.walkInTitle}
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#8C6D58] hover:text-[#1A1A1A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateWalkIn} className="space-y-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    {t.staffModal.walkInService}
                  </label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                  >
                    {localizedServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({formatPrice(s.priceAMD)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    {t.staffModal.tableBranch}
                  </label>
                  <select
                    value={manualBranchId}
                    onChange={(e) => setManualBranchId(e.target.value as 'vedi' | 'artashat')}
                    className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-[#1A1A1A] block mb-1">
                      {t.staffModal.walkInDate}
                    </label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#1A1A1A] block mb-1">
                      {t.staffModal.walkInTime}
                    </label>
                    <input
                      type="time"
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    {t.staffModal.walkInClient}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ani Sargsyan"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    {t.staffModal.walkInPhone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] block mb-1">
                    {t.staffModal.walkInNotes}
                  </label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EAE0D5] bg-white text-[#1A1A1A]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-[#EAE0D5] text-[#432818] hover:bg-[#EAE0D5]"
                  >
                    {t.staffModal.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#432818] text-white rounded-full hover:bg-[#321c0f] font-semibold"
                  >
                    {t.staffModal.saveWalkIn}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
