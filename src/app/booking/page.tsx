'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, Suspense } from 'react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  images: string[];
  capacity: number;
}

interface RoomSelection {
  room: Room;
  quantity: number;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';

  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [countryCode, setCountryCode] = useState('+355'); // Default to Albania
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Common country codes with flags
  const countryCodes = [
    { code: '+355', country: 'Albania', iso2: 'al' },
    { code: '+213', country: 'Algeria', iso2: 'dz' },
    { code: '+54', country: 'Argentina', iso2: 'ar' },
    { code: '+61', country: 'Australia', iso2: 'au' },
    { code: '+43', country: 'Austria', iso2: 'at' },
    { code: '+973', country: 'Bahrain', iso2: 'bh' },
    { code: '+880', country: 'Bangladesh', iso2: 'bd' },
    { code: '+375', country: 'Belarus', iso2: 'by' },
    { code: '+32', country: 'Belgium', iso2: 'be' },
    { code: '+387', country: 'Bosnia', iso2: 'ba' },
    { code: '+55', country: 'Brazil', iso2: 'br' },
    { code: '+359', country: 'Bulgaria', iso2: 'bg' },
    { code: '+1', country: 'Canada', iso2: 'ca' },
    { code: '+56', country: 'Chile', iso2: 'cl' },
    { code: '+86', country: 'China', iso2: 'cn' },
    { code: '+57', country: 'Colombia', iso2: 'co' },
    { code: '+385', country: 'Croatia', iso2: 'hr' },
    { code: '+357', country: 'Cyprus', iso2: 'cy' },
    { code: '+420', country: 'Czech Rep.', iso2: 'cz' },
    { code: '+45', country: 'Denmark', iso2: 'dk' },
    { code: '+20', country: 'Egypt', iso2: 'eg' },
    { code: '+372', country: 'Estonia', iso2: 'ee' },
    { code: '+358', country: 'Finland', iso2: 'fi' },
    { code: '+33', country: 'France', iso2: 'fr' },
    { code: '+995', country: 'Georgia', iso2: 'ge' },
    { code: '+49', country: 'Germany', iso2: 'de' },
    { code: '+30', country: 'Greece', iso2: 'gr' },
    { code: '+852', country: 'Hong Kong', iso2: 'hk' },
    { code: '+36', country: 'Hungary', iso2: 'hu' },
    { code: '+354', country: 'Iceland', iso2: 'is' },
    { code: '+91', country: 'India', iso2: 'in' },
    { code: '+62', country: 'Indonesia', iso2: 'id' },
    { code: '+98', country: 'Iran', iso2: 'ir' },
    { code: '+964', country: 'Iraq', iso2: 'iq' },
    { code: '+353', country: 'Ireland', iso2: 'ie' },
    { code: '+972', country: 'Israel', iso2: 'il' },
    { code: '+39', country: 'Italy', iso2: 'it' },
    { code: '+81', country: 'Japan', iso2: 'jp' },
    { code: '+962', country: 'Jordan', iso2: 'jo' },
    { code: '+254', country: 'Kenya', iso2: 'ke' },
    { code: '+965', country: 'Kuwait', iso2: 'kw' },
    { code: '+371', country: 'Latvia', iso2: 'lv' },
    { code: '+961', country: 'Lebanon', iso2: 'lb' },
    { code: '+370', country: 'Lithuania', iso2: 'lt' },
    { code: '+352', country: 'Luxembourg', iso2: 'lu' },
    { code: '+389', country: 'Macedonia', iso2: 'mk' },
    { code: '+60', country: 'Malaysia', iso2: 'my' },
    { code: '+356', country: 'Malta', iso2: 'mt' },
    { code: '+52', country: 'Mexico', iso2: 'mx' },
    { code: '+373', country: 'Moldova', iso2: 'md' },
    { code: '+382', country: 'Montenegro', iso2: 'me' },
    { code: '+212', country: 'Morocco', iso2: 'ma' },
    { code: '+31', country: 'Netherlands', iso2: 'nl' },
    { code: '+64', country: 'New Zealand', iso2: 'nz' },
    { code: '+234', country: 'Nigeria', iso2: 'ng' },
    { code: '+47', country: 'Norway', iso2: 'no' },
    { code: '+968', country: 'Oman', iso2: 'om' },
    { code: '+92', country: 'Pakistan', iso2: 'pk' },
    { code: '+970', country: 'Palestine', iso2: 'ps' },
    { code: '+51', country: 'Peru', iso2: 'pe' },
    { code: '+63', country: 'Philippines', iso2: 'ph' },
    { code: '+48', country: 'Poland', iso2: 'pl' },
    { code: '+351', country: 'Portugal', iso2: 'pt' },
    { code: '+974', country: 'Qatar', iso2: 'qa' },
    { code: '+40', country: 'Romania', iso2: 'ro' },
    { code: '+7', country: 'Russia', iso2: 'ru' },
    { code: '+966', country: 'Saudi Arabia', iso2: 'sa' },
    { code: '+381', country: 'Serbia', iso2: 'rs' },
    { code: '+65', country: 'Singapore', iso2: 'sg' },
    { code: '+421', country: 'Slovakia', iso2: 'sk' },
    { code: '+386', country: 'Slovenia', iso2: 'si' },
    { code: '+27', country: 'South Africa', iso2: 'za' },
    { code: '+82', country: 'South Korea', iso2: 'kr' },
    { code: '+34', country: 'Spain', iso2: 'es' },
    { code: '+94', country: 'Sri Lanka', iso2: 'lk' },
    { code: '+46', country: 'Sweden', iso2: 'se' },
    { code: '+41', country: 'Switzerland', iso2: 'ch' },
    { code: '+963', country: 'Syria', iso2: 'sy' },
    { code: '+886', country: 'Taiwan', iso2: 'tw' },
    { code: '+66', country: 'Thailand', iso2: 'th' },
    { code: '+216', country: 'Tunisia', iso2: 'tn' },
    { code: '+90', country: 'Turkey', iso2: 'tr' },
    { code: '+380', country: 'Ukraine', iso2: 'ua' },
    { code: '+971', country: 'UAE', iso2: 'ae' },
    { code: '+44', country: 'UK', iso2: 'gb' },
    { code: '+1', country: 'USA', iso2: 'us' },
    { code: '+58', country: 'Venezuela', iso2: 've' },
    { code: '+84', country: 'Vietnam', iso2: 'vn' },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse room selections from URL
  const roomSelections = useMemo(() => {
    const roomsParams = searchParams.getAll('rooms');
    return roomsParams.map(param => {
      const [roomId, quantity] = param.split(':');
      return { roomId, quantity: parseInt(quantity) || 1 };
    });
  }, [searchParams]);

  // Fetch room details from database
  useEffect(() => {
    const fetchRooms = async () => {
      if (roomSelections.length === 0) {
        setRoomLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        const allRooms = data.rooms || [];

        const selections: RoomSelection[] = roomSelections
          .map(({ roomId, quantity }) => {
            const room = allRooms.find((r: Room) => r.id === roomId);
            return room ? { room, quantity } : null;
          })
          .filter((s): s is RoomSelection => s !== null);

        setSelectedRooms(selections);
        setRoomLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRoomLoading(false);
      }
    };
    fetchRooms();
  }, [roomSelections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a unique group ID for this reservation (all rooms booked together)
      const reservationGroupId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create bookings sequentially to avoid race conditions
      const bookingsToCreate = selectedRooms.flatMap(({ room, quantity }) =>
        Array.from({ length: quantity }, () => ({
          roomId: room.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: parseInt(guests),
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: `${countryCode} ${formData.phone}`,
          specialRequests: formData.specialRequests,
          reservationGroupId, // Same group ID for all rooms in this reservation
        }))
      );

      const createdBookings = [];

      // Create bookings one by one sequentially
      for (const bookingData of bookingsToCreate) {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Booking creation failed:', errorData);
          alert(errorData?.error || 'Failed to create booking. Please try again.');
          setIsSubmitting(false);
          return;
        }

        const booking = await response.json();
        createdBookings.push(booking);

        // Small delay to ensure unique timestamps
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Successfully created ${createdBookings.length} bookings with group ID: ${reservationGroupId}`);

      // Redirect to confirmation page with booking references
      const bookingNumbers = createdBookings.map((b: any) => b.bookingNumber).join(',');
      router.push(`/booking/confirmation?bookingNumbers=${encodeURIComponent(bookingNumbers)}&email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating your booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  // Calculate totals
  const totals = useMemo(() => {
    const subtotalPerNight = selectedRooms.reduce((sum, { room, quantity }) =>
      sum + (room.pricePerNight * quantity), 0
    );
    const totalRooms = selectedRooms.reduce((sum, { quantity }) => sum + quantity, 0);
    const grandTotal = subtotalPerNight * nights;

    return { subtotalPerNight, totalRooms, grandTotal };
  }, [selectedRooms, nights]);

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (selectedRooms.length === 0) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">No rooms selected</h1>
          <p className="text-gray-600 mb-6">Please select rooms to continue with your booking.</p>
          <Link href="/" className="inline-block bg-sage-500 hover:bg-sage-600 text-white px-8 py-3 rounded-xl transition-colors font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <Navigation variant="solid" />

      {/* Hero Header */}
      <section className="relative py-16 md:py-20 mt-[90px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <p className="text-white/70 text-[11px] tracking-[0.4em] uppercase mb-4 font-medium">Final Step</p>
          <h1 className="text-[42px] md:text-[52px] leading-[1.1] font-serif mb-6 text-white">
            Complete Your Booking
          </h1>
          <p className="text-[17px] text-white/70 max-w-xl mx-auto leading-[1.7] font-light">
            Just a few more details and you're all set
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Booking Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm border border-[#e5e5e5] p-8">
              <h2 className="text-[20px] font-serif text-[#111111] mb-6">Guest Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                    Full Name <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                    Email Address <span className="text-[#991b1b]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                    Phone Number <span className="text-[#991b1b]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      {/* Custom Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-[120px] px-3 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111] bg-white cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className={`fi fi-${countryCodes.find(c => c.code === countryCode)?.iso2} text-[18px] flex-shrink-0`}></span>
                        <span className="flex-1 text-center">{countryCode}</span>
                        <svg className="w-3 h-3 text-[#111111] flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M6 9L1 4h10z" />
                        </svg>
                      </button>

                      {/* Custom Dropdown Menu */}
                      {isDropdownOpen && (
                        <>
                          {/* Backdrop to close dropdown */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsDropdownOpen(false)}
                          ></div>

                          {/* Dropdown Options */}
                          <div className="absolute top-full left-0 mt-1 w-[200px] max-h-[300px] overflow-y-auto bg-white border border-[#e5e5e5] rounded-sm shadow-lg z-20">
                            {countryCodes.map(({ code, country, iso2 }) => (
                              <button
                                key={code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(code);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-left hover:bg-[#f5f5f5] transition-colors flex items-center gap-2 text-[14px] ${
                                  countryCode === code ? 'bg-[#873260]/10' : ''
                                }`}
                              >
                                <span className={`fi fi-${iso2} text-[18px]`}></span>
                                <span className="text-[#111111]">{code}</span>
                                <span className="text-[#666] text-[12px] ml-auto">{country}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                      placeholder="XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                    Special Requests <span className="text-[#666] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111] resize-none"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-[#333333] disabled:bg-[#ccc] text-white py-4 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking Request'
                  )}
                </button>

                <p className="text-[12px] text-[#666] text-center font-light">
                  No online payment required. Pay in cash at the hotel reception upon check-in.
                </p>
              </form>
            </div>
          </div>

          {/* Booking Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm border border-[#e5e5e5] p-6">
              <h3 className="text-[20px] font-serif text-[#111111] mb-6">Booking Summary</h3>

              <div className="space-y-5">
                {/* Selected Rooms */}
                <div className="pb-5 border-b border-[#e5e5e5]">
                  <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-3 font-medium">Selected Rooms</p>
                  {selectedRooms.map(({ room, quantity }) => (
                    <div key={room.id} className="flex justify-between text-[13px] py-1.5">
                      <span className="text-[#32373c] font-light">
                        {quantity}× {room.name}
                      </span>
                      <span className="text-[#111111] font-medium">
                        €{room.pricePerNight * quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="pb-5 border-b border-[#e5e5e5]">
                  <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-3 font-medium">Stay Details</p>
                  <div className="flex justify-between text-[13px] py-1">
                    <span className="text-[#666] font-light">Check-in</span>
                    <span className="text-[#111111] font-medium">{checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
                  </div>
                  <div className="flex justify-between text-[13px] py-1">
                    <span className="text-[#666] font-light">Check-out</span>
                    <span className="text-[#111111] font-medium">{checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="pb-5 border-b border-[#e5e5e5]">
                  <div className="flex justify-between text-[13px] py-1">
                    <span className="text-[#666] font-light">Total Rooms</span>
                    <span className="text-[#111111] font-medium">{totals.totalRooms}</span>
                  </div>
                  <div className="flex justify-between text-[13px] py-1">
                    <span className="text-[#666] font-light">Guests</span>
                    <span className="text-[#111111] font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between text-[13px] py-1">
                    <span className="text-[#666] font-light">Nights</span>
                    <span className="text-[#111111] font-medium">{nights}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#f5f5f0] rounded-sm p-4 mt-5">
                <div className="flex justify-between text-[13px] text-[#666] mb-2">
                  <span>Subtotal per night</span>
                  <span>€{totals.subtotalPerNight}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#e5e5e5]">
                  <span className="text-[15px] font-medium text-[#111111]">Total</span>
                  <span className="text-[24px] font-serif text-[#873260]">€{totals.grandTotal}</span>
                </div>
                <p className="text-[11px] text-[#666] mt-2">For {nights} {nights === 1 ? 'night' : 'nights'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
