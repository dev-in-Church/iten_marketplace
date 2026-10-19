"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  src: string; // put files in /public/banners
  alt: string;
  href?: string; // optional click-through
};

const BANNERS: Banner[] = [
  { src: "/banners/banner2.jpg", alt: "Banner 1", href: "/products" },
  { src: "/banners/banner2.jpg", alt: "Banner 2", href: "/products" },
  { src: "/banners/banner2.jpg", alt: "Banner 3" },
  { src: "/banners/banner2.jpg", alt: "Banner 4" },
];

const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = BANNERS.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured banners"
      className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        className="group relative aspect-[2/1] overflow-hidden rounded-2xl bg-slate-200 sm:aspect-[3/1] md:aspect-[7/2]"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {BANNERS.map((b, i) => {
            const img = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.src}
                alt={b.alt}
                draggable={false}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            );
            return (
              <div
                key={b.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
                className="h-full w-full shrink-0"
              >
                {b.href ? (
                  <Link
                    href={b.href}
                    tabIndex={i === index ? 0 : -1}
                    className="block h-full w-full"
                  >
                    {img}
                  </Link>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/30 px-3 py-2 backdrop-blur-sm">
              {BANNERS.map((b, i) => (
                <button
                  key={b.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none ${
                    i === index ? "w-7" : "w-2 opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
