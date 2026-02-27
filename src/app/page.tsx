'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import CustomDatePicker from '@/components/CustomDatePicker';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
}

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 rounded-2xl h-[400px] flex items-center justify-center">
      <div className="text-center text-gray-500">
        <p className="text-lg font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before element enters viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return { elementRef, isVisible };
}

export default function HomePage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Scroll animation refs
  const introSection = useScrollAnimation();
  const roomsSection = useScrollAnimation();
  const amenitiesSection = useScrollAnimation();
  const testimonialsSection = useScrollAnimation();
  const locationSection = useScrollAnimation();

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        const activeRooms = (data.rooms || []).filter((room: Room) => room.isActive);
        setRooms(activeRooms);
        setRoomsLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollInterval = setInterval(() => {
      const imageWidth = 340; // 320px width + 20px gap
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const currentScroll = carousel.scrollLeft;

      if (currentScroll >= maxScroll - 10) {
        // Reset to beginning
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll to next image
        carousel.scrollBy({ left: imageWidth, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, []);

  // Handle check-in date change - auto-adjust check-out if needed
  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);

    // If check-out is before or equal to new check-in, set it to next day
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

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guests || parseInt(guests) < 1) {
      alert('Please enter number of guests');
      return;
    }
    router.push(`/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="transparent" />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
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

        {/* Hero Content - Logo at Top (desktop only, mobile uses combined layout below) */}
        <div className="hidden sm:flex absolute top-4 md:top-5 left-0 right-0 z-10 justify-center px-4">
          <div className="animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <Image
              src="/garden-logo.png"
              alt={APP_NAME}
              width={600}
              height={210}
              className="h-40 md:h-56 lg:h-72 w-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Mobile: Logo + Booking Widget centered together */}
        <div className="sm:hidden absolute inset-0 flex flex-col items-center justify-center z-10 px-4 gap-4">
          <div className="animate-fade-in -mt-20" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <Image
              src="/garden-logo.png"
              alt={APP_NAME}
              width={600}
              height={210}
              className="h-60 w-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <form onSubmit={handleCheckAvailability} className="w-full max-w-4xl mt-2">
            <div className="flex flex-col items-stretch justify-between gap-3">
              <CustomDatePicker
                label="Arrival"
                value={checkIn}
                onChange={handleCheckInChange}
                minDate={new Date().toISOString().split('T')[0]}
                placeholder="Select date"
              />
              <CustomDatePicker
                label="Departure"
                value={checkOut}
                onChange={setCheckOut}
                minDate={getMinCheckOutDate()}
                placeholder="Select date"
                highlightDate={checkIn}
              />
              <div className="w-full">
                <div className="flex items-end justify-between pb-2.5 border-b border-white/40">
                  <div>
                    <span className="text-white/60 text-[11px] tracking-[0.15em] uppercase block mb-0.5">Guests</span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={guests}
                        placeholder="-"
                        required
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '') {
                            setGuests('');
                          } else {
                            const num = Math.min(22, parseInt(val));
                            setGuests(String(num));
                          }
                        }}
                        className="bg-transparent text-white text-lg font-light w-8 outline-none border-none text-center placeholder:text-white/40"
                      />
                      <span className="text-white text-lg font-light">{!guests || parseInt(guests) === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests(String(Math.max(1, (parseInt(guests) || 1) - 1)))}
                      className="w-7 h-7 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuests(String(Math.min(22, (parseInt(guests) || 0) + 1)))}
                      className="w-7 h-7 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14m-7-7h14" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-1 w-full px-5 py-3.5 bg-white/10 backdrop-blur-md border border-white/40 text-white text-base font-light hover:bg-white/25 transition-all duration-300 whitespace-nowrap"
              >
                Find room
              </button>
            </div>
          </form>
        </div>

        {/* Desktop Booking Widget */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center z-10 px-4 md:px-8 pt-32 md:pt-40">
          <form onSubmit={handleCheckAvailability} className="w-full max-w-4xl">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-1.5 sm:gap-3 lg:gap-5">
              {/* Arrival */}
              <CustomDatePicker
                label="Arrival"
                value={checkIn}
                onChange={handleCheckInChange}
                minDate={new Date().toISOString().split('T')[0]}
                placeholder="Select date"
              />

              {/* Departure */}
              <CustomDatePicker
                label="Departure"
                value={checkOut}
                onChange={setCheckOut}
                minDate={getMinCheckOutDate()}
                placeholder="Select date"
                highlightDate={checkIn}
              />

              {/* Guests */}
              <div className="w-full lg:max-w-[180px]">
                <div className="flex items-end justify-between pb-2.5 border-b border-white/40">
                  <div>
                    <span className="text-white/60 text-[9px] tracking-[0.15em] uppercase block mb-0.5">Guests</span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={guests}
                        placeholder="-"
                        required
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '') {
                            setGuests('');
                          } else {
                            const num = Math.min(22, parseInt(val));
                            setGuests(String(num));
                          }
                        }}
                        className="bg-transparent text-white text-base sm:text-lg md:text-xl font-light w-7 sm:w-8 outline-none border-none text-center placeholder:text-white/40"
                      />
                      <span className="text-white text-base sm:text-lg md:text-xl font-light">{!guests || parseInt(guests) === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests(String(Math.max(1, (parseInt(guests) || 1) - 1)))}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuests(String(Math.min(22, (parseInt(guests) || 0) + 1)))}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/40 text-white/80 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14m-7-7h14" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Find Room Button */}
              <button
                type="submit"
                className="mt-1 lg:mt-0 w-full lg:w-auto px-5 sm:px-6 py-3 sm:py-2.5 border border-white/60 text-white text-sm sm:text-base font-light hover:bg-white hover:text-gray-900 transition-all duration-300 whitespace-nowrap"
              >
                Find room
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2️⃣ INTRODUCTION / STORY SECTION - Hotel Vienna Style */}
      <section className="py-12 md:py-16 px-4 bg-white" ref={introSection.elementRef}>
        <div className="max-w-5xl mx-auto">
          {/* Centered Text Content */}
          <div className={`text-center mb-12 transition-all duration-1000 ${introSection.isVisible ? 'opacity-100 translate-y-0' : 'sm:opacity-0 sm:translate-y-10'}`}>
            <p className="text-[#873260] text-[11px] tracking-[0.4em] uppercase mb-6 font-medium">Welcome To</p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[52px] leading-[1.1] font-serif mb-6 text-[#111111] px-4">
              Garden Boutique Hotel
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-[15px] sm:text-[18px] text-[#32373c]/80 leading-[1.8] font-light">
                Step into a world where time slows down, where the gentle rustling of leaves replaces the noise of everyday life. Our garden sanctuary in the heart of Elbasan offers more than just a place to stay—it's a retreat for the soul, surrounded by lush greenery and thoughtfully curated spaces.
              </p>
            </div>
          </div>

          {/* Horizontal Scrolling Gallery - Hotel Vienna Style */}
          <div className={`relative transition-all duration-1000 ${introSection.isVisible ? 'opacity-100' : 'sm:opacity-0'}`}>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {/* Image 1 */}
              <div className="relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[9/16] snap-center overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?q=80&w=2074"
                  alt="Garden Boutique Hotel Interior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Image 2 */}
              <div className="relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[9/16] snap-center overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Hotel Exterior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Image 3 */}
              <div className="relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[9/16] snap-center overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2071"
                  alt="Garden View"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Image 4 */}
              <div className="relative flex-shrink-0 w-[280px] md:w-[320px] aspect-[9/16] snap-center overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"
                  alt="Room Interior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Minimal Navigation Arrows */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none px-4">
              <button
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Previous images"
              >
                <svg className="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                aria-label="Next images"
              >
                <svg className="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ ROOM HIGHLIGHTS SECTION */}
      <section className="py-16 md:py-20 px-4 bg-gray-50" ref={roomsSection.elementRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${roomsSection.isVisible ? 'animate-fade-in-up' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            <p className="text-[#873260] text-[11px] tracking-[0.4em] uppercase mb-6 font-medium">Accommodations</p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.2] font-serif mb-6 text-[#111111]">
              Our Rooms & Suites
            </h2>
            <p className="text-[17px] text-[#32373c] max-w-2xl mx-auto leading-relaxed font-light">
              Discover our thoughtfully designed rooms, each offering comfort and tranquility
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-700 ${roomsSection.isVisible ? 'animate-fade-in' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            {roomsLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-sm shadow-sm overflow-hidden">
                  <div className="relative h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              rooms.map((room, index) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.slug}`}
                  className="group bg-white rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <h3 className="text-[22px] sm:text-[28px] leading-[1.2] font-serif mb-3 text-gray-900 group-hover:text-sage-600 transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-[#873260]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-[14px] text-[#111111] font-light">{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4 text-[#873260]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-[14px] text-[#111111] font-light">{room.bedType}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1.5 font-medium">From</p>
                        <p className="text-[20px] text-[#111111] font-serif leading-none">€{Number(room.pricePerNight).toFixed(0)}<span className="text-[12px] text-[#666] font-light ml-1">/night</span></p>
                      </div>
                      <div className="text-sage-600 group-hover:translate-x-2 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/rooms"
              className="inline-block bg-[#111111] hover:bg-[#333333] text-white px-10 py-4 rounded-sm transition-all duration-300 text-[13px] font-medium tracking-[0.15em] uppercase"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* 4️⃣ AMENITIES / FACILITIES SECTION */}
      <section className="py-16 md:py-20 px-4 bg-white" ref={amenitiesSection.elementRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${amenitiesSection.isVisible ? 'animate-fade-in-up' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            <p className="text-[#873260] text-sm tracking-[0.2em] uppercase mb-4 font-medium">Hotel Amenities</p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.2] font-serif mb-6 text-[#111111]">
              Everything You Need
            </h2>
            <p className="text-[17px] text-[#32373c] max-w-2xl mx-auto leading-relaxed">
              Thoughtful amenities designed to make your experience effortless
            </p>
          </div>

          <div className={`flex flex-wrap justify-center gap-6 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-8 lg:gap-12 transition-all duration-700 ${amenitiesSection.isVisible ? 'animate-fade-in' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            {/* Amenity 1 */}
            <div className="text-center group w-[calc(50%-12px)] sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-[#873260]/10 rounded-full flex items-center justify-center group-hover:bg-[#873260] transition-colors duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#873260] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="font-medium text-[#111111] mb-2 text-[15px]">Free Wi-Fi</h3>
              <p className="text-[13px] text-[#32373c]/70">High-speed internet</p>
            </div>

            {/* Amenity 2 */}
            <div className="text-center group w-[calc(50%-12px)] sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-[#873260]/10 rounded-full flex items-center justify-center group-hover:bg-[#873260] transition-colors duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#873260] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#111111] mb-2 text-[15px]">Garden Space</h3>
              <p className="text-[13px] text-[#32373c]/70">Lush outdoor areas</p>
            </div>

            {/* Amenity 3 */}
            <div className="text-center group w-[calc(50%-12px)] sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-[#873260]/10 rounded-full flex items-center justify-center group-hover:bg-[#873260] transition-colors duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#873260] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="font-medium text-[#111111] mb-2 text-[15px]">Breakfast</h3>
              <p className="text-[13px] text-[#32373c]/70">Fresh daily selection</p>
            </div>

            {/* Amenity 4 */}
            <div className="text-center group w-[calc(50%-12px)] sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-[#873260]/10 rounded-full flex items-center justify-center group-hover:bg-[#873260] transition-colors duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#873260] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="font-medium text-[#111111] mb-2 text-[15px]">Parking</h3>
              <p className="text-[13px] text-[#32373c]/70">Free on-site parking</p>
            </div>

            {/* Amenity 5 */}
            <div className="text-center group w-[calc(50%-12px)] sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-[#873260]/10 rounded-full flex items-center justify-center group-hover:bg-[#873260] transition-colors duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#873260] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l9 9m0 0l9-9M12 12v9m-4 0h8" />
                </svg>
              </div>
              <h3 className="font-medium text-[#111111] mb-2 text-[15px]">Bar & Lounge</h3>
              <p className="text-[13px] text-[#32373c]/70">Indoor & outdoor drinks</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ TESTIMONIALS SECTION */}
      <section className="py-16 md:py-20 px-4 bg-white" ref={testimonialsSection.elementRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${testimonialsSection.isVisible ? 'animate-fade-in-up' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            <p className="text-[#873260] text-sm tracking-[0.2em] uppercase mb-4 font-medium">Testimonials</p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.2] font-serif mb-6 text-[#111111]">
              What Our Guests Say
            </h2>
            <p className="text-[17px] text-[#32373c] max-w-2xl mx-auto leading-relaxed">Hear from those who've experienced our hospitality</p>
          </div>

          <div className={`transition-all duration-700 ${testimonialsSection.isVisible ? 'animate-fade-in' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* 6️⃣ LOCATION / CONTACT PREVIEW */}
      <section className="py-16 md:py-20 px-4 bg-[#fafaf8]" ref={locationSection.elementRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Text Column */}
            <div className={`transition-all duration-700 ${locationSection.isVisible ? 'animate-slide-in-left' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
              <p className="text-[#873260] text-sm tracking-[0.2em] uppercase mb-4 font-medium">Location</p>
              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] leading-[1.2] font-serif mb-8 text-[#111111]">
                Find Us in the Heart of Elbasan
              </h2>
              <p className="text-[17px] text-[#32373c] mb-10 leading-[1.8]">
                Conveniently located in the center of Elbasan, Garden Boutique Hotel offers easy access to the city's historic sites, local restaurants, and cultural attractions—all while providing a peaceful garden sanctuary to return to at the end of the day.
              </p>
              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Address</p>
                    <p className="text-[#32373c] text-[15px]">Parku Rinia, Elbasan, Albania</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Phone</p>
                    <p className="text-[#32373c] text-[15px]">+355 69 966 2622</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Email</p>
                    <p className="text-[#32373c] text-[15px]">boutiquehotelgarden@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-block bg-[#32373c] hover:bg-[#111111] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-300 font-medium text-[14px] sm:text-[15px] tracking-wide text-center"
                >
                  Contact Us
                </Link>
                <a
                  href="https://www.google.com/maps/search/Garden+Boutique+Hotel+Elbasan+Albania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-[#32373c] text-[#32373c] hover:bg-[#32373c] hover:text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-300 font-medium text-[14px] sm:text-[15px] tracking-wide text-center"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Interactive Map */}
            <div className={`h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden transition-all duration-700 ${locationSection.isVisible ? 'animate-slide-in-right' : 'sm:opacity-0'}`} style={{ animationFillMode: 'forwards' }}>
              <Map
                latitude={41.116990}
                longitude={20.089142}
                hotelName="Garden Boutique Hotel"
                address="Parku Rinia, Elbasan, Albania"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button - Positioned between sections */}
      <div className="relative py-0">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#873260] hover:bg-[#6B2850] text-white p-5 rounded-full shadow-2xl transition-all hover:shadow-lg hover:scale-110"
            aria-label="Back to top"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
