'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Navigation from '@/components/Navigation';
import Newsletter from '@/components/Newsletter';
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
  amenities: string[];
  images: string[];
  isActive: boolean;
  displayOrder: number;
}

// Amenity icon mapping
const getAmenityIcon = (amenity: string) => {
  const iconClass = "w-4 h-4 text-[#873260] flex-shrink-0";
  const lowerAmenity = amenity.toLowerCase();

  if (lowerAmenity.includes('balcony')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12v6a1 1 0 001 1h16a1 1 0 001-1v-6M3 12V6a1 1 0 011-1h16a1 1 0 011 1v6M7 19v2M17 19v2M12 5V3" />
      </svg>
    );
  }
  if (lowerAmenity.includes('garden')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    );
  }
  if (lowerAmenity.includes('air conditioning') || lowerAmenity.includes('air-conditioning')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('bathroom')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l1-3h14l1 3M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    );
  }
  if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('soundproof')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('wi-fi') || lowerAmenity.includes('wifi')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  }
  if (lowerAmenity.includes('toiletries')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('slippers')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('hairdryer') || lowerAmenity.includes('hair dryer')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('shower')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  }
  if (lowerAmenity.includes('bed')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('hardwood') || lowerAmenity.includes('floor')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    );
  }
  if (lowerAmenity.includes('elevator') || lowerAmenity.includes('lift')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  // Default icon for other amenities
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  );
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          const roomsArray = data.rooms || data;
          setRooms(roomsArray.filter((room: Room) => room.isActive).sort((a: Room, b: Room) => a.displayOrder - b.displayOrder));
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Auto-transition room photos every 4 seconds
  useEffect(() => {
    if (rooms.length === 0) return;
    const interval = setInterval(() => {
      setCardImageIndex(prev => {
        const next = { ...prev };
        rooms.forEach(room => {
          if (room.images.length > 1) {
            next[room.id] = ((prev[room.id] || 0) + 1) % room.images.length;
          }
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [rooms]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center mt-[70px] sm:mt-[90px] overflow-hidden">
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
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-[56px] md:text-[72px] leading-[0.95] font-serif text-white">
            Discover Your<br />Perfect Stay
          </h1>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[36px] font-serif mb-6 text-[#111111] leading-[1.3]">
            Start Your Perfect Stay
          </h2>
          <p className="text-[17px] text-[#32373c] leading-[1.8] font-light">
            Explore our refined accommodation options and find the perfect space for your stay. Garden Boutique Hotel offers {rooms.length} thoughtfully designed rooms, each with their own unique character, modern amenities, and a wide range of facilities, services and activities to enhance your experience in the heart of Elbasan.
          </p>
        </div>
      </section>

      {/* Rooms Listing */}
      <section className="pb-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="space-y-24">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  <div className="lg:col-span-3 relative h-[550px] bg-gray-200 animate-pulse"></div>
                  <div className="lg:col-span-2 space-y-6 py-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start border-b border-gray-200 pb-12 last:border-b-0"
                >
                  {/* Image Section with Carousel - Links to room detail */}
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="relative h-[350px] lg:h-[380px] overflow-hidden group rounded-sm block"
                  >
                    <Image
                      src={room.images[cardImageIndex[room.id] || 0] || room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
                      priority={index === 0}
                    />
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardImageIndex(prev => ({ ...prev, [room.id]: ((prev[room.id] || 0) - 1 + room.images.length) % room.images.length })); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                        >
                          <svg className="w-4 h-4 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardImageIndex(prev => ({ ...prev, [room.id]: ((prev[room.id] || 0) + 1) % room.images.length })); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                        >
                          <svg className="w-4 h-4 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {room.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === (cardImageIndex[room.id] || 0) ? 'bg-white w-3' : 'bg-white/50'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </Link>

                  {/* Content Section */}
                  <div className="space-y-5 flex flex-col">
                    <div>
                      <h2 className="text-[28px] md:text-[32px] leading-[1.2] font-serif mb-2 text-[#111111]">
                        {room.name}
                      </h2>
                      <p className="text-[13px] text-[#32373c] leading-[1.6] font-light mt-3">
                        {room.shortDescription || room.description.substring(0, 100) + '...'}
                      </p>
                    </div>

                    {/* Room Details Grid - Horizontal */}
                    <div className="flex justify-between py-4 border-y border-[#e5e5e5]">
                      <div>
                        <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1.5 font-medium">Guests</p>
                        <p className="text-[14px] text-[#111111] font-light">{room.capacity}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1.5 font-medium">Size</p>
                        <p className="text-[14px] text-[#111111] font-light">{room.size} m²</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-1.5 font-medium">Price</p>
                        <p className="text-[20px] text-[#111111] font-serif leading-none">€{Number(room.pricePerNight).toFixed(0)}<span className="text-[12px] text-[#666] font-light ml-1">/night</span></p>
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="pb-4">
                        <p className="text-[10px] text-[#873260] tracking-[0.2em] uppercase mb-4 font-medium">Key Amenities</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                          {room.amenities.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                              {getAmenityIcon(amenity)}
                              <span className="text-[13px] text-[#32373c] font-light">{amenity}</span>
                            </div>
                          ))}
                          {room.amenities.length > 4 && (
                            <Link
                              href={`/rooms/${room.slug}`}
                              className="flex items-center gap-2.5 text-[13px] text-[#873260] hover:text-[#6B2850] transition-colors font-light col-span-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>+ {room.amenities.length - 4} more amenities</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="block w-full text-center bg-[#111111] hover:bg-[#333333] text-white px-8 py-3.5 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
