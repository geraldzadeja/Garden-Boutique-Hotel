'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
  specialRequests: string | null;
  pricePerNight: string;
  totalPrice: string;
  status: string;
  createdAt: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || searchParams.get('bookingNumbers')?.split(',')[0] || '';
  const email = searchParams.get('email') || '';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ref || !email) {
      setError('Missing booking information.');
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingNumber: ref, email }),
        });

        if (!response.ok) {
          setError('Could not retrieve booking details.');
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

    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const copyReference = () => {
    const refs = bookings[0]?.reservationGroupId || bookings[0]?.bookingNumber || '';
    navigator.clipboard.writeText(refs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const grandTotal = bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation variant="solid" />
        <div className="mt-[90px] py-32 text-center">
          <div className="w-10 h-10 border-2 border-[#873260] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#32373c] text-[15px] font-light">Loading your booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation variant="solid" />
        <section className="mt-[90px] py-16 md:py-20 bg-[#111111]">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-[40px] md:text-[52px] leading-[1] font-serif text-white">Booking Not Found</h1>
          </div>
        </section>
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-[#32373c] text-[16px] font-light mb-8">{error || 'We could not find your booking.'}</p>
          <Link href="/my-booking" className="inline-block px-8 py-3.5 bg-[#111111] text-white text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#333] transition-colors">
            Look Up My Booking
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const firstBooking = bookings[0];

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Header */}
      <section className="mt-[90px] py-16 md:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">Booking Confirmed</p>
          <h1 className="text-[40px] md:text-[52px] leading-[1] font-serif text-white">Thank You, {firstBooking.guestName.split(' ')[0]}</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-sm p-5 flex items-start gap-4 mb-10">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[15px] font-medium text-green-800 mb-1">Your booking has been confirmed</p>
            <p className="text-[14px] text-green-700 font-light">A confirmation will be sent to {firstBooking.guestEmail}</p>
          </div>
        </div>

        {/* Booking Reference */}
        <div className="bg-[#faf9f7] border border-[#e5e5e5] rounded-sm p-6 md:p-8 mb-8 text-center">
          <p className="text-[#873260] text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">Reservation Reference</p>
          <span className="text-[24px] md:text-[32px] font-mono font-semibold text-[#111111] tracking-wider">
            {firstBooking.reservationGroupId || firstBooking.bookingNumber}
          </span>
          <button
            onClick={copyReference}
            className="mt-4 inline-flex items-center gap-2 text-[12px] text-[#873260] hover:text-[#6b2750] font-medium tracking-[0.1em] uppercase transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Reference'}
          </button>
          <p className="text-[13px] text-[#999] font-light mt-3">Please save this reference number for your records</p>
        </div>

        {/* Booking Summary */}
        <div className="border border-[#e5e5e5] rounded-sm overflow-hidden mb-8">
          <div className="bg-[#faf9f7] px-6 md:px-8 py-4 border-b border-[#e5e5e5]">
            <h2 className="text-[18px] font-serif text-[#111111]">Booking Summary</h2>
          </div>
          <div className="px-6 md:px-8 py-6 space-y-5">
            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-green-50 text-green-700 border border-green-200">
                Confirmed
              </span>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Guest */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Guest</span>
              <span className="text-[15px] text-[#111111]">{firstBooking.guestName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Email</span>
              <span className="text-[15px] text-[#111111]">{firstBooking.guestEmail}</span>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Dates */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Check-in</span>
              <span className="text-[15px] text-[#111111]">{formatDate(firstBooking.checkInDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Check-out</span>
              <span className="text-[15px] text-[#111111]">{formatDate(firstBooking.checkOutDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Duration</span>
              <span className="text-[15px] text-[#111111]">{firstBooking.numberOfNights} night{firstBooking.numberOfNights > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider">Guests</span>
              <span className="text-[15px] text-[#111111]">{firstBooking.numberOfGuests}</span>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Rooms */}
            <div>
              <span className="text-[13px] text-[#999] font-light uppercase tracking-wider block mb-3">Room{bookings.length > 1 ? 's' : ''}</span>
              <div className="space-y-3">
                {(() => {
                  // Group bookings by room name
                  const grouped = bookings.reduce<Record<string, { room: BookingRoom; count: number; pricePerNight: string }>>((acc, b) => {
                    const key = b.room.name;
                    if (!acc[key]) {
                      acc[key] = { room: b.room, count: 0, pricePerNight: b.pricePerNight };
                    }
                    acc[key].count++;
                    return acc;
                  }, {});

                  return Object.entries(grouped).map(([name, { room, count, pricePerNight }]) => (
                    <div key={name} className="flex justify-between items-center bg-[#faf9f7] rounded-sm px-4 py-3">
                      <div>
                        <p className="text-[15px] text-[#111111] font-medium">{name}{count > 1 ? ` x${count}` : ''}</p>
                        <p className="text-[13px] text-[#999] font-light">{room.bedType} &middot; {room.size}m&sup2;</p>
                      </div>
                      <p className="text-[15px] text-[#111111]">{formatPrice(pricePerNight)} <span className="text-[12px] text-[#999] font-light">/ night</span></p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="border-t border-[#e5e5e5]" />

            {/* Total */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-[15px] font-medium text-[#111111]">Total</span>
              <span className="text-[22px] font-serif text-[#111111]">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="border border-[#e5e5e5] rounded-sm overflow-hidden mb-8">
          <div className="bg-[#faf9f7] px-6 md:px-8 py-4 border-b border-[#e5e5e5]">
            <h2 className="text-[18px] font-serif text-[#111111]">What Happens Next</h2>
          </div>
          <div className="px-6 md:px-8 py-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#873260]/10 flex items-center justify-center">
                  <span className="text-[13px] font-medium text-[#873260]">1</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#111111] mb-1">Booking Confirmed</p>
                  <p className="text-[14px] text-[#32373c] font-light leading-[1.7]">Your reservation has been confirmed and your room is secured.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#873260]/10 flex items-center justify-center">
                  <span className="text-[13px] font-medium text-[#873260]">2</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#111111] mb-1">Confirmation Email</p>
                  <p className="text-[14px] text-[#32373c] font-light leading-[1.7]">You will receive a confirmation email at <strong className="font-medium">{firstBooking.guestEmail}</strong> with your booking details.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#873260]/10 flex items-center justify-center">
                  <span className="text-[13px] font-medium text-[#873260]">3</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#111111] mb-1">Payment at Check-in</p>
                  <p className="text-[14px] text-[#32373c] font-light leading-[1.7]">Payment is made in cash at the hotel reception upon check-in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Fallback */}
        <div className="bg-[#faf9f7] border border-[#e5e5e5] rounded-sm p-6 md:p-8 mb-8">
          <p className="text-[14px] text-[#32373c] font-light leading-[1.8]">
            If you do not receive a confirmation email within 24 hours, please contact us directly:
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a href="mailto:boutiquehotelgarden@gmail.com" className="inline-flex items-center gap-2 text-[14px] text-[#873260] hover:text-[#6b2750] font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              boutiquehotelgarden@gmail.com
            </a>
            <a href="tel:+355699662622" className="inline-flex items-center gap-2 text-[14px] text-[#873260] hover:text-[#6b2750] font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +355 69 966 2622
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/my-booking"
            className="px-8 py-3.5 bg-[#111111] text-white text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#333] transition-colors text-center"
          >
            Manage My Booking
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 border border-[#e5e5e5] text-[#111111] text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm hover:bg-[#f5f5f5] transition-colors text-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
