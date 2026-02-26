'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  amenities: string[];
  images: string[];
  isActive: boolean;
}

const getAmenityIcon = (amenity: string) => {
  const iconClass = "w-5 h-5 text-[#873260] flex-shrink-0";
  const lowerAmenity = amenity.toLowerCase();

  if (lowerAmenity.includes('balcony')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12v6a1 1 0 001 1h16a1 1 0 001-1v-6M3 12V6a1 1 0 011-1h16a1 1 0 011 1v6M7 19v2M17 19v2M12 5V3" /></svg>);
  }
  if (lowerAmenity.includes('garden')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>);
  }
  if (lowerAmenity.includes('air conditioning') || lowerAmenity.includes('air-conditioning')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
  }
  if (lowerAmenity.includes('bathroom')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l1-3h14l1 3M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>);
  }
  if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
  }
  if (lowerAmenity.includes('soundproof')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>);
  }
  if (lowerAmenity.includes('wi-fi') || lowerAmenity.includes('wifi')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>);
  }
  if (lowerAmenity.includes('toiletries')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>);
  }
  if (lowerAmenity.includes('slippers')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
  }
  if (lowerAmenity.includes('hairdryer') || lowerAmenity.includes('hair dryer')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
  }
  if (lowerAmenity.includes('shower')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);
  }
  if (lowerAmenity.includes('bed')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);
  }
  if (lowerAmenity.includes('hardwood') || lowerAmenity.includes('floor')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>);
  }
  if (lowerAmenity.includes('elevator') || lowerAmenity.includes('lift')) {
    return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>);
  }
  return (<svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>);
};

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          const roomsArray = data.rooms || data;
          const found = roomsArray.find((r: Room) => r.slug === slug);
          setRoom(found || null);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation variant="solid" />
        <div className="mt-[90px] flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#873260]"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation variant="solid" />
        <div className="mt-[90px] flex flex-col items-center justify-center h-[60vh] px-4">
          <h1 className="text-[36px] font-serif text-[#111111] mb-4">Room Not Found</h1>
          <p className="text-[15px] text-[#32373c] font-light mb-8">The room you are looking for does not exist.</p>
          <Link href="/rooms" className="inline-block bg-[#111111] hover:bg-[#333333] text-white px-8 py-3.5 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Hero Image Gallery */}
      <section className="relative h-[55vh] md:h-[70vh] mt-[90px] overflow-hidden group">
        <Image
          src={room.images[imageIndex] || room.images[0]}
          alt={room.name}
          fill
          className="object-cover transition-all duration-700 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Navigation Arrows */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={() => setImageIndex((imageIndex - 1 + room.images.length) % room.images.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setImageIndex((imageIndex + 1) % room.images.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase mb-3 font-medium">{room.bedType}</p>
            <h1 className="text-[42px] md:text-[60px] leading-[0.95] font-serif text-white mb-4">{room.name}</h1>
            {room.images.length > 1 && (
              <div className="flex gap-2 mt-6">
                {room.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`h-1 rounded-full transition-all ${i === imageIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-10 py-8 border-y border-[#e5e5e5] mb-12">
            <div className="text-center">
              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">Guests</p>
              <p className="text-[22px] text-[#111111] font-serif">{room.capacity}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">Size</p>
              <p className="text-[22px] text-[#111111] font-serif">{room.size} m²</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">Bed Type</p>
              <p className="text-[22px] text-[#111111] font-serif">{room.bedType}</p>
            </div>
            <div className="text-center hidden md:block">
              <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">From</p>
              <p className="text-[26px] text-[#111111] font-serif">€{Number(room.pricePerNight).toFixed(0)}<span className="text-[13px] text-[#666] font-light ml-1">/night</span></p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mb-16">
            <h2 className="text-[28px] font-serif text-[#111111] mb-6">About This Room</h2>
            <p className="text-[16px] text-[#32373c] leading-[1.9] font-light">
              {room.description}
            </p>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-16">
              <h2 className="text-[28px] font-serif text-[#111111] mb-8">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2">
                    {getAmenityIcon(amenity)}
                    <span className="text-[15px] text-[#32373c] font-light">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery Thumbnails */}
          {room.images.length > 1 && (
            <div className="mb-16">
              <h2 className="text-[28px] font-serif text-[#111111] mb-8">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-3">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                    className={`relative h-[140px] md:h-[200px] overflow-hidden rounded-sm transition-all cursor-pointer ${i === imageIndex ? 'ring-2 ring-[#873260]' : 'hover:opacity-80'}`}
                  >
                    <Image src={img} alt={`${room.name} - Photo ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Price + CTA */}
          <div className="md:hidden mb-8 text-center">
            <p className="text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">From</p>
            <p className="text-[32px] text-[#111111] font-serif mb-6">€{Number(room.pricePerNight).toFixed(0)}<span className="text-[14px] text-[#666] font-light ml-1">/night</span></p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/availability"
              className="flex-1 text-center bg-[#111111] hover:bg-[#333333] text-white py-4 rounded-sm transition-colors text-[13px] font-medium tracking-[0.15em] uppercase"
            >
              Check Availability
            </Link>
            <Link
              href="/rooms"
              className="flex-1 text-center border border-[#111111]/30 hover:bg-[#111111]/5 text-[#111111] py-4 rounded-sm transition-colors text-[13px] font-medium tracking-[0.15em] uppercase"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Lightbox */}
      {lightboxOpen && room && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-7 left-6 text-white/60 text-[14px] font-light z-10">
            {lightboxIndex + 1} / {room.images.length}
          </div>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center px-20" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-5xl h-[80vh]">
              <Image
                src={room.images[lightboxIndex] || room.images[0]}
                alt={`${room.name} - Photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Arrows */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + room.images.length) % room.images.length); }}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % room.images.length); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
