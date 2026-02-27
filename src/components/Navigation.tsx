'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

interface NavigationProps {
  variant?: 'transparent' | 'solid';
  hideBookNow?: boolean;
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/my-booking', label: 'My Booking' },
];

export default function Navigation({ variant = 'transparent', hideBookNow = false }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (variant !== 'transparent') return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const isTransparent = variant === 'transparent' && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? '' : 'bg-white shadow-sm'}`}>
      <div className={`flex justify-between items-center ${isTransparent ? 'px-4 sm:px-6 md:px-10 py-6 sm:py-6 md:py-8' : 'px-4 sm:px-6 md:px-10 py-5 sm:py-5 min-h-[70px] sm:min-h-[90px]'}`}>
        {/* Left - Menu Button with Burger/X transition */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-5 hover:opacity-70 transition-opacity z-[60]"
          aria-label="Toggle menu"
        >
          <div className="relative w-8 h-6 flex flex-col justify-center">
            <span className={`block absolute w-8 h-[2px] transition-all duration-300 ease-in-out ${isTransparent ? 'bg-white' : 'bg-[#111111]'} ${menuOpen ? 'rotate-45 top-1/2 -translate-y-1/2 !bg-white' : 'top-0'}`}></span>
            <span className={`block absolute w-8 h-[2px] transition-all duration-300 ease-in-out ${isTransparent ? 'bg-white' : 'bg-[#111111]'} ${menuOpen ? '-rotate-45 top-1/2 -translate-y-1/2 !bg-white' : 'bottom-0'}`}></span>
          </div>
          <span className={`hidden sm:inline text-base tracking-[0.2em] font-medium transition-opacity duration-300 ${isTransparent ? 'text-white' : 'text-[#111111]'} ${menuOpen ? 'opacity-0' : 'opacity-100'}`}>MENU</span>
        </button>

        {/* Center - Logo (solid variant only) */}
        {!isTransparent && (
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/garden-logo.png"
              alt={APP_NAME}
              width={200}
              height={70}
              className="h-10 sm:h-14 w-auto object-contain brightness-0"
              priority
            />
          </Link>
        )}

        {/* Right - Book Now Button */}
        {!hideBookNow && (
          <Link
            href="/availability"
            className={isTransparent
              ? 'text-white text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-3 sm:px-6 py-2 sm:py-2.5 border border-white/50 hover:bg-white/15 hover:backdrop-blur-md transition-all duration-300'
              : 'text-[#111111] text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-3 sm:px-6 py-2 sm:py-2.5 border border-[#111111]/50 hover:bg-[#111111]/10 transition-all duration-300'
            }
          >
            BOOK NOW
          </Link>
        )}
      </div>

      {/* Slide-out Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/10 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full px-8 pt-24 sm:pt-20 pb-8">
          {/* Menu Links - evenly distributed to fill available space */}
          <nav className="flex-1 flex flex-col justify-evenly">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-[22px] sm:text-[18px] text-white hover:text-[#d4a3c3] transition-colors font-light tracking-wide border-b border-white/15 pb-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Menu Footer - transparent blur button */}
          <div className="mt-6">
            <Link
              href="/availability"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-white/5 backdrop-blur-lg hover:bg-white/15 text-white py-4 text-sm tracking-[0.15em] transition-all duration-300 border border-white/20"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
