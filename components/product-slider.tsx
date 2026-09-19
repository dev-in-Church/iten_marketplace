"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardSkeleton, type Product } from "@/components/product-card";

export function ProductSlider({
  title,
  headerClassName = "bg-ig-red text-white",
  seeAllHref,
  seeAllClassName = "",
  loading,
  products,
  skeletonCount = 10,
  renderSkeleton,
  renderCard,
  emptyMessage,
  eager = false,
}: {
  title: string;
  headerClassName?: string;
  seeAllHref?: string;
  seeAllClassName?: string;
  loading: boolean;
  products: Product[];
  skeletonCount?: number;
  /** Defaults to ProductCardSkeleton — override only if renderCard uses a differently-shaped card. */
  renderSkeleton?: () => ReactNode;
  renderCard: (product: Product) => ReactNode;
  emptyMessage?: string;
  /** Set true only for the first, above-the-fold slider so it renders immediately. */
  eager?: boolean;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [inView, setInView] = useState(eager);

  // Only start doing work (rendering real cards / images) once the
  // section is about to enter the viewport.
  useEffect(() => {
    if (eager || inView) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, inView]);

  const updateScrollButtons = useCallback((el: HTMLDivElement) => {
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const el = sliderRef.current;
    if (!el) return;

    const timeoutId = setTimeout(() => updateScrollButtons(el), 100);

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollButtons(el);
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = () => updateScrollButtons(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // Re-run once loading finishes so we measure real (not skeleton) width.
  }, [inView, loading, updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  const showSkeleton = loading || !inView;

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
      <div className="border-b">
        <div
          className={`flex items-center justify-between mb-2 px-2 rounded-t-sm ${headerClassName}`}
        >
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className={`hidden sm:flex text-sm font-medium hover:underline items-center gap-1 ${seeAllClassName}`}
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left")}
            className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
              canScrollLeft ? "flex" : "hidden"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
          >
            {showSkeleton
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    {renderSkeleton ? (
                      renderSkeleton()
                    ) : (
                      <ProductCardSkeleton />
                    )}
                  </div>
                ))
              : products.length > 0
                ? products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[200px] sm:w-[220px] shrink-0 snap-start"
                    >
                      {renderCard(product)}
                    </div>
                  ))
                : emptyMessage && (
                    <p className="text-sm text-muted-foreground py-4 px-2">
                      {emptyMessage}
                    </p>
                  )}
          </div>

          <button
            onClick={() => scroll("right")}
            className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
              canScrollRight ? "flex" : "hidden"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
