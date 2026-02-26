'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function LoadingScreen() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Start loading on pathname change
    setLoading(true);
    setShouldRender(true);

    // Minimum loading time for smooth UX (500ms)
    const minLoadTime = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Fade out animation time (300ms)
    const fadeOutTime = setTimeout(() => {
      setShouldRender(false);
    }, 800);

    return () => {
      clearTimeout(minLoadTime);
      clearTimeout(fadeOutTime);
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-sage-50 via-white to-sage-100 transition-opacity duration-300 ${
        loading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-[240px] h-[240px] animate-spin"
              style={{ animationDuration: '3s' }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="72 216"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#873260" />
                  <stop offset="100%" stopColor="#6d2850" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Logo Image */}
          <Image
            src="/garden-logo.png"
            alt="Garden Boutique Hotel"
            width={140}
            height={140}
            className="object-contain brightness-0 animate-pulse"
            priority
          />
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#873260] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#873260] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#873260] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
