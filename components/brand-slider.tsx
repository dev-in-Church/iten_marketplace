"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  HomeProductCard,
  HomeProductCardSkeleton,
  type Product,
} from "@/components/home-product-card";
import api from "@/lib/api";

type BrandSliderConfig = {
  /** Sent as the `brand` query param and matched case-insensitively against product.brand. */
  brand: string;
  /** Human-readable brand name, used in links and the empty-state message. */
  label: string;
  title: string;
  headerClassName: string;
  seeAllClassName?: string;
  /** Render immediately instead of waiting to scroll into view. */
  eager?: boolean;
};

// To add a new brand hub, add one entry here — no new JSX, no new refs,
// no new state to wire up. Each slider fetches its own products, so this
// works correctly regardless of how many total products the catalog has.
const BRAND_SLIDERS: BrandSliderConfig[] = [
  {
    brand: "adidas",
    label: "Adidas",
    title: "Best Of Adidas",
    headerClassName: "bg-ig-black text-white",
    eager: true,
  },
  {
    brand: "nike",
    label: "Nike",
    title: "Official Nike Hub",
    headerClassName: "bg-neutral-900 text-white",
    seeAllClassName: "",
  },
  {
    brand: "garmin",
    label: "Garmin",
    title: "Official Garmin Hub",
    headerClassName: "bg-ig-black text-white",
  },
  {
    brand: "asics",
    label: "Asics",
    title: "Official Asics Hub",
    headerClassName: "bg-gradient-to-r from-blue-600 to-indigo-800 text-white",
  },
];

const PRODUCTS_PER_SLIDER = 9;

/**
 * One slider per brand. Each instance fetches its own products (scoped by
 * brand + limit) rather than slicing a single shared /api/products call —
 * that was the source of sliders showing only 1 item, or 0 for brands with
 * plenty of stock: they were all drawing from the same limited/paginated
 * page instead of querying their own brand directly.
 *
 * ASSUMPTION: /api/products accepts `?brand=<name>&limit=<n>`. Adjust the
 * query string below if your API uses different param names.
 */
function Slider({ config }: { config: BrandSliderConfig }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [inView, setInView] = useState(!!config.eager);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Only start fetching once the section is about to enter the viewport.
  useEffect(() => {
    if (config.eager || inView) return;
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
  }, [config.eager, inView]);

  // Fetch this brand's own products once the slider is in view.
  useEffect(() => {
    if (!inView) return;

    // Note: no AbortController here. @/lib/api's get() doesn't accept a
    // fetch-options second argument — passing one previously got stringified
    // straight onto the URL (?limit=9?signal=[object AbortSignal]), which
    // corrupted the `limit` param and made the backend's SQL query throw,
    // silently falling back to empty mock data. A plain `cancelled` flag
    // gives us the same "don't setState after unmount" protection without
    // needing api.get to support cancellation.
    let cancelled = false;
    let retryTimeout: NodeJS.Timeout;
    let isRetrying = false;

    const fetchBrandProducts = async () => {
      if (cancelled) return;

      try {
        const params = new URLSearchParams({
          brand: config.brand,
          limit: String(PRODUCTS_PER_SLIDER),
        });
        const data = await api.get<{ products: Product[] }>(
          `/api/products?${params.toString()}`,
        );

        if (!cancelled) {
          setProducts(data.products ?? []);
          setLoading(false);
        }
      } catch (error) {
        if (cancelled) return;
        console.error(`Failed to fetch ${config.label} products:`, error);

        if (!isRetrying) {
          isRetrying = true;
          retryTimeout = setTimeout(() => {
            isRetrying = false;
            if (!cancelled) fetchBrandProducts();
          }, 3000);
        }
      }
    };

    fetchBrandProducts();

    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [inView, config.brand, config.label]);

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
      <div className="relative shadow rounded-lg overflow-hidden">
        <div
          className={`flex items-center justify-between mb-2 px-2 ${config.headerClassName}`}
        >
          <h2 className="text-xl md:text-2xl font-bold">{config.title}</h2>
          <Link
            href={`/products?brand=${encodeURIComponent(config.label)}`}
            className={`hidden sm:flex text-sm font-medium hover:underline items-center gap-1 ${config.seeAllClassName ?? ""}`}
          >
            See All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative flex items-center px-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="group hidden lg:flex absolute left-5 -translate-x-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white border border-border shadow-md transition-all duration-200 hover:border-ig-green hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none disabled:scale-100"
          >
            <ChevronLeft className="h-4 w-4 text-foreground group-hover:text-ig-green transition-colors" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 py-1"
          >
            {showSkeleton ? (
              Array.from({ length: PRODUCTS_PER_SLIDER }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[200px] sm:min-w-[220px] snap-start"
                >
                  <HomeProductCardSkeleton />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="w-[160px] min-w-[160px] sm:min-w-[190px] md:min-w-[190px] rounded-md shadow-md overflow-hidden flex-shrink-0 hover:shadow-sm transition-all"
                >
                  <HomeProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 px-2">
                No {config.label} products available at the moment.
              </p>
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="group hidden lg:flex absolute right-5 translate-x-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white border border-border shadow-md transition-all duration-200 hover:border-ig-green hover:shadow-lg hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none disabled:scale-100"
          >
            <ChevronRight className="h-4 w-4 text-foreground group-hover:text-ig-green transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function BrandSliders() {
  return (
    <>
      {BRAND_SLIDERS.map((config) => (
        <Slider key={config.brand} config={config} />
      ))}
    </>
  );
}
