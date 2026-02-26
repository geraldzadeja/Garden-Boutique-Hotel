'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    alt: 'Luxury Hotel Exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
    alt: 'Elegant Hotel Lobby'
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',
    alt: 'Hotel Pool and Gardens'
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
    alt: 'Premium Hotel Room'
  },
  {
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2071',
    alt: 'Beautiful Garden View'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
