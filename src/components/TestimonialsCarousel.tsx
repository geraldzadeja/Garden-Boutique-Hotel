'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "A truly peaceful escape. The garden is stunning, the room was spotless, and the staff made us feel like family. We can't wait to return.",
    name: "Maria Schmidt",
    country: "Germany"
  },
  {
    id: 2,
    quote: "The perfect blend of comfort and elegance. Every detail was thoughtful, from the beautiful decor to the delicious breakfast.",
    name: "John & Sarah Williams",
    country: "United Kingdom"
  },
  {
    id: 3,
    quote: "Felt like a home away from home. The tranquil atmosphere and warm hospitality made our stay unforgettable. Highly recommended!",
    name: "Alessandro Rossi",
    country: "Italy"
  },
  {
    id: 4,
    quote: "The garden is absolutely breathtaking! Waking up to birdsong and fresh air was exactly what we needed. The staff went above and beyond.",
    name: "Sophie Dubois",
    country: "France"
  },
  {
    id: 5,
    quote: "Exceptional service and a beautiful property. The rooms are spacious and immaculate. This is our third visit and it won't be our last!",
    name: "Michael Anderson",
    country: "United States"
  },
  {
    id: 6,
    quote: "A hidden gem in Elbasan. The peaceful setting, combined with modern amenities, made for a perfect getaway. The breakfast was delicious!",
    name: "Ana Petrović",
    country: "Serbia"
  },
  {
    id: 7,
    quote: "We celebrated our anniversary here and it was magical. The attention to detail and personalized service made us feel so special.",
    name: "Carlos & Elena Martínez",
    country: "Spain"
  },
  {
    id: 8,
    quote: "The most relaxing hotel stay I've ever had. The garden provides such a serene escape from the city. Highly recommend for anyone seeking peace.",
    name: "Yuki Tanaka",
    country: "Japan"
  },
  {
    id: 9,
    quote: "Charming boutique hotel with incredible hospitality. The staff remembered our names and preferences. It truly felt like staying with friends.",
    name: "Emma van der Berg",
    country: "Netherlands"
  },
  {
    id: 10,
    quote: "Beautiful location, wonderful service, and the most comfortable beds! We extended our stay by two nights because we didn't want to leave.",
    name: "Dmitri Volkov",
    country: "Russia"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 3;
  const maxIndex = testimonials.length - itemsPerView;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(autoScrollInterval);
  }, [maxIndex]);

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-sage-50 transition-colors"
        aria-label="Previous testimonials"
      >
        <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-sage-50 transition-colors"
        aria-label="Next testimonials"
      >
        <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full md:w-1/3 flex-shrink-0 px-4"
            >
              <div className="bg-beige-50 rounded-2xl p-8 h-full flex flex-col">
                <div className="mb-6">
                  <svg className="w-10 h-10 text-sage-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-beige-200 pt-4">
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-sage-600 w-8' : 'bg-beige-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
