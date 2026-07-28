"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
    title: "Worldwide Study & Visit Visa Guides",
    desc: "Personalized direction for Schengen, UK, US, and Canada pathways.",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    title: "Smooth Travel Planning & Strategy",
    desc: "From profile review to mock interviews, we help you prepare confidence.",
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
    title: "Real Client Arrival Stories",
    desc: "Helping students and families land safely in their dream destinations.",
  }
];

export function TravelCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-3xl border border-slate-200 shadow-lg group">
      {/* Slide Images */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={slide.url} alt={slide.title} className="w-full h-full object-cover brightness-[0.7]" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/85 via-black/40 to-transparent p-8 text-white space-y-2">
            <span className="text-xs font-bold text-npontu-gold uppercase tracking-widest">Featured Destination Guide</span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{slide.title}</h3>
            <p className="text-sm md:text-base text-slate-200 max-w-xl">{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === index ? "bg-npontu-gold w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
