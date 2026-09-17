import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { HomeBanner } from '../types';

interface HeroSlide {
  id: number | string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  targetView: 'collection' | 'category' | 'home' | 'product';
  targetPayload: string;
  badge: string;
}

const HERO_SLIDES: HeroSlide[] = [];

interface HeroSliderProps {
  onNavigate: (view: 'home' | 'collection' | 'category' | 'product', payload?: string) => void;
  slides?: HomeBanner[];
}

export default function HeroSlider({ onNavigate, slides = [] }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter active custom banners, else fallback to defaults
  const activeSlides = slides.length > 0
    ? slides.filter(s => s.isActive)
    : HERO_SLIDES;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] bg-gray-900 overflow-hidden">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              onClick={() => onNavigate(slide.targetView, slide.targetPayload)}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Backing Image */}
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-[0.7] transform hover:scale-102 transition-transform duration-7000"
              />

              {/* Gradient overlays to ensure high-contrast text */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#100c18]/90 via-[#100c18]/50 to-transparent" />
              
              {/* Text / CTA Banner */}
              <div className="absolute inset-x-0 bottom-0 top-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white z-20">
                <div className="max-w-xl space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Badge */}
                  {slide.badge && (
                    <span className="inline-block px-3 py-1 bg-[#c5a880] text-black text-[10px] md:text-xs font-extrabold uppercase tracking-widest rounded-xs">
                      {slide.badge}
                    </span>
                  )}
                  
                  {/* Main Header */}
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md whitespace-pre-line">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg max-w-lg leading-relaxed font-light font-sans">
                    {slide.subtitle}
                  </p>

                  {/* CTA button */}
                  {slide.ctaText && (
                    <div className="pt-2">
                      <button
                        className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3.5 bg-transparent border-2 border-white hover:bg-white hover:text-black font-semibold uppercase tracking-wider text-xs rounded-xs transition-all shadow-md transform active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(slide.targetView, slide.targetPayload);
                        }}
                      >
                        <ShoppingBag size={15} />
                        {slide.ctaText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeSlides.length > 1 && (
        <>
          {/* Manual Navigator Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 text-white hover:bg-[#c5a880] hover:text-black transition-all cursor-pointer shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 text-white hover:bg-[#c5a880] hover:text-black transition-all cursor-pointer shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? 'w-8 bg-[#c5a880]' : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
