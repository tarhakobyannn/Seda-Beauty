import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { GallerySection } from './components/GallerySection';
import { BookingSystem } from './components/BookingSystem';
import { WorkingHoursContact } from './components/WorkingHoursContact';
import { Footer } from './components/Footer';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Booking } from './types';
import { INITIAL_BOOKINGS } from './data/mockData';
import { StudioDatabase } from './db/database';
import { LanguageProvider } from './context/LanguageContext';

function StudioAppContent() {
  // Bookings state initialized from StudioDatabase
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  // Selected service ID to pre-populate booking flow
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Admin portal modal
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Initialize persistent database
  useEffect(() => {
    StudioDatabase.init()
      .then((records) => {
        if (records && records.length > 0) {
          setBookings(records);
        }
        setIsDbLoaded(true);
      })
      .catch((err) => {
        console.warn('DB init fallback', err);
        setIsDbLoaded(true);
      });
  }, []);

  // Smooth scroll helper
  const scrollToBooking = useCallback(() => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToServices = useCallback(() => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Handle service selection from Services or Gallery
  const handleSelectServiceToBook = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToBooking();
  };

  // Add new booking handler with DB write
  const handleAddBooking = (
    newBookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>
  ): Booking => {
    const randomCodeSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...newBookingData,
      id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      bookingCode: `SEDA-${randomCodeSuffix}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    StudioDatabase.add(newBooking).catch(console.error);
    return newBooking;
  };

  // Update status (e.g. completed, cancelled, confirmed) with DB update
  const handleUpdateStatus = (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    StudioDatabase.updateStatus(id, status).catch(console.error);
  };

  // Reset demo bookings
  const handleResetDemoData = async () => {
    await StudioDatabase.reset(INITIAL_BOOKINGS);
    setBookings(INITIAL_BOOKINGS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A]">
      {/* Top Floating Navigation */}
      <Navbar
        onBookClick={scrollToBooking}
        onOpenAdmin={() => setIsAdminOpen(true)}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Editorial Showcase Hero */}
        <HeroSection
          onBookClick={scrollToBooking}
          onExploreServices={scrollToServices}
          onSelectServiceToBook={handleSelectServiceToBook}
        />

        {/* Studio Story & Philosophy */}
        <AboutSection onBookNow={scrollToBooking} />

        {/* Services & Treatment Menu */}
        <ServicesSection onBookService={handleSelectServiceToBook} />

        {/* Verified Client Testimonials */}
        <ReviewsSection />

        {/* Portfolio Gallery */}
        <GallerySection onBookNow={scrollToBooking} />

        {/* Functional Interactive Booking System with Confirmation Modal */}
        <BookingSystem
          bookings={bookings}
          onAddBooking={handleAddBooking}
          selectedServiceId={selectedServiceId}
          onSelectServiceId={setSelectedServiceId}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Working Hours & Ararat Province Locations */}
        <WorkingHoursContact onBookNow={scrollToBooking} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Staff / Admin Management Modal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateStatus}
        onAddManualBooking={handleAddBooking}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StudioAppContent />
    </LanguageProvider>
  );
}
