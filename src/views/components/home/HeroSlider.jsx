// src/views/components/home/HeroSlider.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../../models/store.data';

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[700px] bg-black overflow-hidden select-none">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Carga responsiva estricta de imágenes WebP */}
            <picture className="absolute inset-0 w-full h-full">
              <source media="(max-width: 768px)" srcSet={slide.imageMobile} type="image/webp" />
              <img
                src={slide.imageDesktop}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                className={`w-full h-full object-cover object-center brightness-90 transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </picture>

            {/* Degradado sobre la imagen para legibilidad de textos */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

            {/* Contenido Textual */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-end md:justify-center items-start pb-16 md:pb-0 text-white">
              <span className="inline-block bg-[var(--color-pulso-lime)] text-black text-[11px] sm:text-xs font-black tracking-widest px-3 py-1 uppercase rounded-sm mb-3">
                {slide.tag}
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase max-w-2xl leading-none">
                {slide.title}
              </h1>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-neutral-300 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <a
                href={slide.ctaLink}
                className="mt-6 inline-flex items-center gap-2.5 bg-white hover:bg-[var(--color-pulso-lime)] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition-all group shadow-lg"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        );
      })}

      {/* Flechas de navegación (Desktop) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full transition-all border border-neutral-700/50"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/80 text-white p-3 rounded-full transition-all border border-neutral-700/50"
        aria-label="Siguiente slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Indicadores / Paginadores inferiores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all rounded-full ${
              i === current ? 'w-8 bg-[var(--color-pulso-lime)]' : 'w-2 bg-white/40'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};