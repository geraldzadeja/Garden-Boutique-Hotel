'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useState, useEffect, useMemo } from 'react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomDatePicker from '@/components/CustomDatePicker';

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  capacity: number;
  bedType: string;
  size: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  isActive: boolean;
  totalUnits: number;
  maxAvailableQuantity: number;
}

interface RoomSelection {
  roomId: string;
  quantity: number;
}

function AvailabilityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({});

  // Fetch available rooms based on dates
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        if (checkIn && checkOut) {
          const response = await fetch(`/api/rooms/availability-with-quantity?checkIn=${checkIn}&checkOut=${checkOut}`);
          const data = await response.json();
          setRooms(data.rooms || []);
        } else {
          // If no dates selected, show all active rooms with their total units
          const response = await fetch('/api/rooms');
          const data = await response.json();
          const activeRooms = (data.rooms || [])
            .filter((room: Room) => room.isActive)
            .map((room: Room) => ({
              ...room,
              maxAvailableQuantity: room.totalUnits,
            }));
          setRooms(activeRooms);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    fetchRooms();
    // Reset selections when dates change
    setSelectedRooms([]);
  }, [checkIn, checkOut]);

  // Auto-update URL when dates or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      router.push(`/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`, { scroll: false });
    }
  }, [checkIn, checkOut, guests, router]);

  // Handle check-in date change - auto-adjust check-out if needed
  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);

    if (newCheckIn && checkOut) {
      const checkInDate = new Date(newCheckIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate <= checkInDate) {
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(nextDay.toISOString().split('T')[0]);
      }
    }
  };

  // Calculate minimum check-out date (day after check-in)
  const getMinCheckOutDate = () => {
    if (!checkIn) return '';
    const checkInDate = new Date(checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split('T')[0];
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get quantity for a specific room
  const getQuantity = (roomId: string) => {
    const selection = selectedRooms.find((s) => s.roomId === roomId);
    return selection ? selection.quantity : 0;
  };

  // Update room quantity
  const updateQuantity = (roomId: string, newQuantity: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    // Clamp quantity between 0 and max available
    const clampedQuantity = Math.max(0, Math.min(newQuantity, room.maxAvailableQuantity));

    setSelectedRooms((prev) => {
      const existing = prev.find((s) => s.roomId === roomId);

      if (clampedQuantity === 0) {
        // Remove if quantity is 0
        return prev.filter((s) => s.roomId !== roomId);
      } else if (existing) {
        // Update existing
        return prev.map((s) =>
          s.roomId === roomId ? { ...s, quantity: clampedQuantity } : s
        );
      } else {
        // Add new
        return [...prev, { roomId, quantity: clampedQuantity }];
      }
    });
  };

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalRooms = selectedRooms.reduce((sum, s) => sum + s.quantity, 0);
    const totalCapacity = selectedRooms.reduce((sum, selection) => {
      const room = rooms.find((r) => r.id === selection.roomId);
      return sum + (room ? room.capacity * selection.quantity : 0);
    }, 0);
    const totalPrice = selectedRooms.reduce((sum, selection) => {
      const room = rooms.find((r) => r.id === selection.roomId);
      return sum + (room ? room.pricePerNight * selection.quantity : 0);
    }, 0);
    const nights = calculateNights();
    const grandTotal = totalPrice * nights;

    return {
      totalRooms,
      totalCapacity,
      totalPrice,
      nights,
      grandTotal,
    };
  }, [selectedRooms, rooms, checkIn, checkOut]);

  // Check if requirements are met
  const requirementsMet = useMemo(() => {
    const guestsNum = parseInt(guests);
    const hasSelections = selectedRooms.length > 0;
    const hasDates = checkIn && checkOut;
    const capacityMet = summary.totalCapacity >= guestsNum;

    return hasSelections && hasDates && capacityMet;
  }, [selectedRooms, checkIn, checkOut, guests, summary]);

  // Handle continue to booking
  const handleContinue = () => {
    if (!requirementsMet) return;

    // Build query string with multiple rooms
    const roomsQuery = selectedRooms
      .map((s) => `rooms=${s.roomId}:${s.quantity}`)
      .join('&');

    router.push(
      `/booking?${roomsQuery}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <Navigation variant="solid" hideBookNow />

      {/* Hero Header */}
      <section className="relative py-16 md:py-20 mt-[90px] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <p className="text-white/70 text-[11px] tracking-[0.4em] uppercase mb-4 font-medium">Check Availability</p>
          <h1 className="text-[42px] md:text-[52px] leading-[1.1] font-serif mb-6 text-white">
            Select Your Rooms
          </h1>
          <p className="text-[17px] text-white/70 max-w-xl mx-auto leading-[1.7] font-light">
            Choose your dates and select the perfect accommodation for your stay
          </p>
        </div>
      </section>

      {/* Search Controls */}
      <div className="bg-white border-b border-[#e5e5e5] py-6 px-4 sticky top-[90px] z-40 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Check-in Input */}
            <CustomDatePicker
              label="Check-in"
              value={checkIn}
              onChange={handleCheckInChange}
              minDate={new Date().toISOString().split('T')[0]}
              placeholder="Select date"
              variant="light"
            />

            {/* Check-out Input */}
            <CustomDatePicker
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
              minDate={getMinCheckOutDate()}
              placeholder="Select date"
              highlightDate={checkIn}
              variant="light"
            />

            {/* Guests Control */}
            <div className="flex flex-col">
              <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">Guests</label>
              <div className="flex items-center gap-3 h-[46px] px-4 rounded-sm bg-white border border-[#e5e5e5]">
                <button
                  type="button"
                  onClick={() => setGuests(String(Math.max(1, parseInt(guests) - 1)))}
                  disabled={parseInt(guests) <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#f5f5f0] hover:bg-[#e8e8e0] text-[#111111] font-medium text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="text-[#111111] font-medium text-[15px]">{guests}</span>
                  <span className="text-[#666] text-[13px] ml-1.5">{parseInt(guests) === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGuests(String(Math.min(22, parseInt(guests) + 1)))}
                  disabled={parseInt(guests) >= 22}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#f5f5f0] hover:bg-[#e8e8e0] text-[#111111] font-medium text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="lg:pr-[390px]">
          {/* Room Cards */}
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#873260] mx-auto"></div>
                  <p className="mt-6 text-[#32373c] text-[15px] font-light">Finding available rooms...</p>
                </div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto mb-6 text-[#873260]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h2 className="text-[28px] font-serif text-[#111111] mb-3">No rooms available</h2>
                <p className="text-[#32373c] text-[15px] font-light mb-8">Please try different dates.</p>
                <Link href="/" className="inline-block bg-[#111111] hover:bg-[#333333] text-white px-8 py-3.5 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase">
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-[#32373c] text-[14px] font-light">
                  Select room types and quantities below. You can choose multiple rooms.
                </p>
                {rooms.map((room) => {
                  const quantity = getQuantity(room.id);
                  return (
                    <div
                      key={room.id}
                      className={`bg-white rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer ${
                        quantity > 0 ? 'border-[#873260] shadow-lg' : 'border-[#e5e5e5] hover:shadow-md'
                      }`}
                      onClick={() => router.push(`/rooms/${room.slug}`)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5">
                        {/* Room Image Carousel */}
                        <div className="relative h-[220px] md:h-full md:col-span-2 overflow-hidden group">
                          <Image
                            src={room.images[cardImageIndex[room.id] || 0] || room.images[0]}
                            alt={room.name}
                            fill
                            className="object-cover transition-all duration-500 ease-out"
                          />
                          {quantity > 0 && (
                            <div className="absolute top-4 left-4 bg-[#873260] text-white px-3 py-1.5 rounded-sm z-10">
                              <span className="text-[12px] font-medium">{quantity} Selected</span>
                            </div>
                          )}
                          {room.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setCardImageIndex(prev => ({ ...prev, [room.id]: ((prev[room.id] || 0) - 1 + room.images.length) % room.images.length })); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                              >
                                <svg className="w-4 h-4 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setCardImageIndex(prev => ({ ...prev, [room.id]: ((prev[room.id] || 0) + 1) % room.images.length })); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                              >
                                <svg className="w-4 h-4 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {room.images.map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === (cardImageIndex[room.id] || 0) ? 'bg-white w-3' : 'bg-white/50'}`} />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="md:col-span-3 p-6 flex flex-col">
                          <div className="mb-4">
                            <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1.5 font-medium">{room.bedType}</p>
                            <h3 className="text-[22px] font-serif text-[#111111] leading-tight">{room.name}</h3>
                          </div>

                          {/* Room Stats */}
                          <div className="flex gap-6 py-3 border-y border-[#e5e5e5] mb-4">
                            <div>
                              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1 font-medium">Guests</p>
                              <p className="text-[14px] text-[#111111] font-light">{room.capacity}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1 font-medium">Price</p>
                              <p className="text-[18px] text-[#111111] font-serif">€{room.pricePerNight}<span className="text-[11px] text-[#666] font-light">/night</span></p>
                            </div>
                            <div>
                              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1 font-medium">Available</p>
                              <p className="text-[14px] text-[#111111] font-light">{room.maxAvailableQuantity} {room.maxAvailableQuantity === 1 ? 'room' : 'rooms'}</p>
                            </div>
                          </div>

                          <p className="text-[13px] text-[#32373c] font-light leading-[1.7] mb-5 line-clamp-2">{room.description}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-end mt-auto gap-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(room.id, quantity - 1)}
                              disabled={quantity <= 0}
                              className="w-10 h-10 flex items-center justify-center rounded-sm bg-[#f5f5f0] hover:bg-[#e8e8e0] text-[#111111] font-medium text-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <div className="w-12 text-center">
                              <span className="text-[#111111] font-serif text-[24px]">{quantity}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateQuantity(room.id, quantity + 1)}
                              disabled={quantity >= room.maxAvailableQuantity}
                              className="w-10 h-10 flex items-center justify-center rounded-sm bg-[#111111] hover:bg-[#333333] text-white font-medium text-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              +
                         </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Floating Booking Summary - Desktop Only - Show only when rooms selected */}
      {selectedRooms.length > 0 && (
        <div className="hidden lg:block fixed top-[140px] right-8 w-[340px] z-40">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">

            {/* Hotel Info Header */}
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <h3 className="text-[18px] font-bold text-[#111111] mb-3">Garden Boutique Hotel</h3>

              {/* Check-in/Check-out Times */}
              <div className="flex items-start gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-[13px] text-gray-600">
                  <span>Check-in after 14:00 | Checkout 11:00 AM</span>
                </div>
              </div>

              {/* Dates */}
              {checkIn && checkOut && (
                <div className="flex items-start gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-[13px] text-gray-600">
                    <span>{new Date(checkIn).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(checkOut).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              )}

              {/* Guests */}
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="text-[13px] text-gray-600">
                  <span>{guests} {parseInt(guests) === 1 ? 'adult' : 'adults'}, {summary.totalRooms} {summary.totalRooms === 1 ? 'room' : 'rooms'}</span>
                </div>
              </div>
            </div>

            {/* Selected Rooms List - Scrollable */}
            <div className="max-h-[140px] overflow-y-auto scrollbar-thin divide-y divide-gray-200">
              {selectedRooms.map((selection) => {
                const room = rooms.find((r) => r.id === selection.roomId);
                if (!room) return null;
                return (
                  <div key={selection.roomId} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      {/* Room Image Thumbnail */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={room.images[0]}
                          alt={room.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Room Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-[#111111] mb-1 line-clamp-1">{room.name}</h4>
                        <p className="text-[12px] text-gray-600 mb-2">
                          {selection.quantity} {selection.quantity === 1 ? 'room' : 'rooms'} × {summary.nights} {summary.nights === 1 ? 'night' : 'nights'}
                        </p>
                        <button
                          onClick={() => updateQuantity(selection.roomId, 0)}
                          className="text-[12px] text-[#873260] hover:text-[#6d2850] font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-[16px] font-bold text-[#111111]">€{(room.pricePerNight * selection.quantity * summary.nights).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Price Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="mb-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[16px] font-bold text-[#111111]">Total</span>
                  <span className="text-[24px] font-bold text-[#111111]">€{summary.grandTotal}</span>
                </div>
              </div>

              {/* Validation Messages */}
              {!checkIn || !checkOut ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-[11px] text-amber-700 leading-tight">Select check-in and check-out dates</p>
                </div>
              ) : summary.totalCapacity < parseInt(guests) ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[11px] text-red-700 leading-tight">Need more capacity for {guests} guests</p>
                </div>
              ) : null}

              {/* CTA Button */}
              <button
                onClick={handleContinue}
                disabled={!requirementsMet}
                className="w-full bg-[#873260] hover:bg-[#6d2850] text-white py-3 rounded-lg transition-all text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#873260]"
              >
                Book {summary.totalRooms} {summary.totalRooms === 1 ? 'room' : 'rooms'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Booking Summary - Shows at bottom only when rooms selected */}
      {selectedRooms.length > 0 && (
        <div className="lg:hidden bg-gradient-to-br from-white to-[#fafaf8] border-t-2 border-[#873260]/20 p-4 fixed bottom-0 left-0 right-0 z-40 shadow-2xl">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-[#873260]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[11px] text-[#666] font-medium">{summary.nights} {summary.nights === 1 ? 'night' : 'nights'} • {summary.totalRooms} {summary.totalRooms === 1 ? 'room' : 'rooms'}</p>
                </div>
                <p className="text-[28px] font-serif text-[#873260] leading-none">€{summary.grandTotal}</p>
                <p className="text-[10px] text-[#999] mt-1">Includes all fees</p>
              </div>
              <button
                onClick={handleContinue}
                disabled={!requirementsMet}
                className="bg-[#111111] hover:bg-[#333333] text-white px-5 py-3.5 rounded-lg transition-all text-[11px] font-medium tracking-[0.1em] uppercase disabled:opacity-40 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
              >
                Continue
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {!requirementsMet && (
              <div className="bg-[#fff8e6] border-l-4 border-[#f5d78e] rounded-r-lg p-2.5 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8a6d3b] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[10px] text-[#8a6d3b]">
                  {!checkIn || !checkOut ? 'Select dates to continue' : 'Need more room capacity'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for mobile fixed footer */}
      {selectedRooms.length > 0 && <div className="lg:hidden h-[100px]"></div>}

      <Footer />
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <Suspense>
      <AvailabilityContent />
    </Suspense>
  );
}
