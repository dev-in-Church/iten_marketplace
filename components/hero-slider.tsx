"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    cta: "Shop Now",
    ctaLink: "reebok",
    image: "/images/reebok.gif",
  },
  {
    id: 2,
    cta: "Explore Running",
    ctaLink: "asics",
    image: "/images/asics.gif",
  },
  {
    id: 3,
    cta: "Start Selling",
    ctaLink: "adidas",
    image: "/images/adidas.gif",
  },
];

export function HeroSlider() {
  const [heroIdx, setHeroIdx] = useState(0);

  const nextSlide = useCallback(() => {
    setHeroIdx((p) => (p + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setHeroIdx((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative bg-[url('/banners/slider.jpg')] overflow-hidden h-full rounded-sm shadow-md">
      <div
        className="flex transition-none duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${heroIdx * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} className="w-full h-full shrink-0">
            <Link href={`/products?brand=${encodeURIComponent(slide.ctaLink)}`}>
              <img
                src={slide.image}
                alt={slide.cta}
                className="h-full w-full"
                loading="lazy"
              />
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-full text-white transition-all duration-200
        bg-white/20 hover:bg-white/40
        opacity-0 group-[[data-side='left']]:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-full text-white transition-all duration-200
        bg-white/20 hover:bg-white/40
        opacity-0 group-[[data-side='right']]:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setHeroIdx(i)}
            className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-6 bg-black" : "w-2 bg-ig-black"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
