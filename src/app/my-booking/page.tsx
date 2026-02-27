'use client';

import { useState } from 'react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface BookingRoom {
  name: string;
  slug: string;
  images: string[];
  bedType: string;
  size: number;
}

interface Booking {
  id: string;
  bookingNumber: string;
  reservationGroupId: string | null;
  roomId: string;
  room: BookingRoom;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNationality: string | null;
  specialRequests: string | null;
  pricePerNight: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  cancelledAt: string | null;
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  PENDING: { label: 'Pending Confirmation', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  COMPLETED: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  NO_SHOW: { label: 'No Show', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export default function MyBookingPage() {
  const [lookupForm, setLookupForm] = useState({ bookingNumber: '', email: '' });
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null); // bookingNumber to cancel
  const [cancelling, setCancelling] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lookupForm),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Booking not found.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingNumber: string) => {
    setCancelling(true);

    try {
      const response = await fetch('/api/bookings/guest/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber, email: lookupForm.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Could not cancel booking.');
        setCancelling(false);
        setShowCancelModal(null);
        return;
      }

      const data = await response.json();
      // Update all bookings in local state (entire reservation gets cancelled)
      setBookings(prev =>
        prev?.map(b => ({
          ...b,
          status: 'CANCELLED',
          cancelledAt: data.booking.cancelledAt,
        })) || null
      );
      setShowCancelModal(null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(Number(price));
  };

  const canCancel = (status: string) => ['PENDING', 'CONFIRMED'].includes(status);

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Header */}
      <section className="mt-[70px] sm:mt-[90px] py-10 sm:py-16 md:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-3 sm:mb-4 font-medium">Guest Services</p>
          <h1 className="text-[30px] sm:text-[40px] md:text-[52px] leading-[1] font-serif text-white">Manage Booking</h1>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 md:py-16">

        {/* Error Banner */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-sm p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] text-red-700">{error}</p>
          </div>
        )}

        {/* Lookup Form */}
        {!bookings && (
          <div className="max-w-lg mx-auto">
            <p className="text-[16px] text-[#32373c] font-light leading-[1.8] text-center mb-10">
              Enter your booking reference number and the email address used during booking to view your reservation details.
            </p>

            <form onSubmit={handleLookup} className="space-y-5">
              <div>
                <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                  Booking Reference <span className="text-[#991b1b]">*</span>
                </label>
                <input
                  type="text"
                  value={lookupForm.bookingNumber}
                  onChange={(e) => setLookupForm({ ...lookupForm, bookingNumber: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111] font-mono tracking-wider"
                  placeholder="BK260216XXXXXX"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                  Email Address <span className="text-[#991b1b]">*</span>
                </label>
                <input
                  type="email"
                  value={lookupForm.email}
                  onChange={(e) => setLookupForm({ ...lookupForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-[#333333] disabled:bg-[#ccc] text-white py-4 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Find My Booking'}
              </button>
            </form>
          </div>
        )}

        {/* Booking Details */}
        {bookings && bookings.length > 0 && (() => {
          const firstBooking = bookings[0];
          const reservationRef = firstBooking.reservationGroupId || firstBooking.bookingNumber;
          const overallStatus = statusConfig[firstBooking.status] || statusConfig.PENDING;
          const grandTotal = bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

          return (
          <div>
            {/* Back button */}
            <button
              onClick={() => { setBookings(null); setError(''); }}
              className="inline-flex items-center gap-2 text-[13px] text-[#873260] hover:text-[#6b2750] font-medium mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New Search
            </button>

            <div className="border border-[#e5e5e5] rounded-sm overflow-hidden mb-6">
              {/* Reservation Header */}
              <div className="bg-[#faf9f7] px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-[#999] tracking-[0.2em] uppercase font-medium mb-1">Reservation Reference</p>
                  <p className="text-[16px] sm:text-[18px] font-mono font-semibold text-[#111111] tracking-wider break-all sm:break-normal">{reservationRef}</p>
                </div>
                <span className={`inline-flex items-center self-start px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide uppercase ${overallStatus.bg} ${overallStatus.text} border ${overallStatus.border}`}>
                  {overallStatus.label}
                </span>
              </div>

              {/* Reservation Details */}
              <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-4">
                {/* Dates & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-1">Check-in</p>
                    <p className="text-[15px] text-[#111111]">{formatDate(firstBooking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-1">Check-out</p>
                    <p className="text-[15px] text-[#111111]">{formatDate(firstBooking.checkOutDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-1">Duration</p>
                    <p className="text-[15px] text-[#111111]">{firstBooking.numberOfNights} night{firstBooking.numberOfNights > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-1">Guests</p>
                    <p className="text-[15px] text-[#111111]">{firstBooking.numberOfGuests} guest{firstBooking.numberOfGuests > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-2">Room{bookings.length > 1 ? 's' : ''}</p>
                  <div className="space-y-2">
                    {(() => {
                      const grouped = bookings.reduce<Record<string, { room: BookingRoom; count: number; pricePerNight: string }>>((acc, b) => {
                        const key = b.room.name;
                        if (!acc[key]) acc[key] = { room: b.room, count: 0, pricePerNight: b.pricePerNight };
                        acc[key].count++;
                        return acc;
                      }, {});
                      return Object.entries(grouped).map(([name, { room, count, pricePerNight }]) => (
                        <div key={name} className="flex justify-between items-center bg-[#faf9f7] rounded-sm px-4 py-3">
                          <div>
                            <p className="text-[15px] text-[#111111] font-medium">{count > 1 ? `${count}× ` : ''}{name}</p>
                            <p className="text-[13px] text-[#999] font-light">{room.bedType} &middot; {room.size}m&sup2;</p>
                          </div>
                          <p className="text-[15px] text-[#111111]">{formatPrice(pricePerNight)} <span className="text-[12px] text-[#999] font-light">/ night</span></p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {firstBooking.specialRequests && (
                  <div>
                    <p className="text-[11px] text-[#999] tracking-[0.15em] uppercase font-medium mb-1">Special Requests</p>
                    <p className="text-[14px] text-[#32373c] font-light">{firstBooking.specialRequests}</p>
                  </div>
                )}

                <div className="border-t border-[#e5e5e5] pt-4 flex justify-between items-center">
                  <span className="text-[15px] font-medium text-[#111111]">Total{bookings.length > 1 ? ` (${bookings.length} rooms)` : ''}</span>
                  <span className="text-[20px] font-serif text-[#111111]">{formatPrice(grandTotal)}</span>
                </div>

                {firstBooking.status === 'CANCELLED' && firstBooking.cancelledAt && (
                  <p className="text-[13px] text-red-600 font-light">
                    Cancelled on {formatDate(firstBooking.cancelledAt)}
                  </p>
                )}
              </div>

              {/* Cancel Action */}
              {bookings.some(b => canCancel(b.status)) && (
                <div className="px-4 sm:px-6 md:px-8 py-4 border-t border-[#e5e5e5] bg-[#faf9f7]">
                  <button
                    onClick={() => setShowCancelModal(firstBooking.bookingNumber)}
                    className="text-[12px] text-red-600 hover:text-red-700 font-medium tracking-[0.1em] uppercase transition-colors"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-[14px] text-[#32373c] font-light">
                Need help? Contact us at{' '}
                <a href="mailto:boutiquehotelgarden@gmail.com" className="text-[#873260] hover:text-[#6b2750] font-medium transition-colors">
                  boutiquehotelgarden@gmail.com
                </a>
              </p>
            </div>
          </div>
          );
        })()}

        {/* No results after search */}
        {bookings && bookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[16px] text-[#32373c] font-light mb-6">No bookings found with those details.</p>
            <button
              onClick={() => { setBookings(null); setError(''); }}
              className="px-8 py-3.5 bg-[#111111] text-white text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#333] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !cancelling && setShowCancelModal(null)} />
          <div className="relative bg-white rounded-sm max-w-md w-full p-5 sm:p-8 shadow-xl">
            <h3 className="text-[18px] sm:text-[20px] font-serif text-[#111111] mb-3 sm:mb-4">Cancel Reservation</h3>
            <p className="text-[14px] text-[#32373c] font-light leading-[1.7] mb-6">
              Are you sure you want to cancel reservation <strong className="font-medium font-mono">{showCancelModal}</strong>?
              {bookings && bookings.length > 1 && ' This will cancel all rooms in this reservation.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 border border-[#e5e5e5] text-[#111111] text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(showCancelModal)}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
