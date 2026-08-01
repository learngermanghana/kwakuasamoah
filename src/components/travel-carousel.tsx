"use client";

import { useState, useEffect } from "react";

type SlideItem = {
  url: string;
  caption?: string;
  alt?: string;
};

const defaultSlides = [
  {
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
    caption: "Worldwide Study & Visit Visa Guides",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    caption: "Smooth Travel Planning & Strategy",
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
    caption: "Real Client Arrival Stories",
  }
];

export function TravelCarousel({ slides = [] }: { slides?: SlideItem[] }) {
  const [index, setIndex] = useState(0);
  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-3xl border border-slate-200 shadow-lg group">
      {/* Slide Images */}
      {activeSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={slide.url} alt={slide.caption || "Travel image"} className="w-full h-full object-cover brightness-[0.7]" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/85 via-black/40 to-transparent p-8 text-white space-y-2">
            <span className="text-xs font-bold text-npontu-gold uppercase tracking-widest">Travel & Relocation Gallery</span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{slide.caption || " Kwaku Lotteryy Travel Showcase"}</h3>
          </div>
        </div>
      ))}

      {/* Slide Navigation Buttons */}
      {activeSlides.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 right-8 z-20 flex gap-2">
          {activeSlides.map((_, idx) => (
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
      )}
    </div>
  );
}
