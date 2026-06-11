"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ProductCard,
  ProductCardSkeleton,
  type Product,
} from "@/components/product-card";
import {
  HomeProductCard,
  HomeProductCardSkeleton,
} from "@/components/home-product-card";
import { MOCK_CATEGORIES } from "@/lib/categories-panel";
import { FEATURED_BRANDS } from "@/lib/delivery-data";
import api from "@/lib/api";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    title: "Gear Up for Greatness",
    subtitle: "Premium sports equipment from top vendors across Kenya",
    cta: "Shop Now",
    ctaLink: "/products",
    bg: "from-ig-green to-ig-green/80",
    image: "/images/reebok.gif",
  },
  {
    title: "Running Season is Here",
    subtitle:
      "Up to 30% off on running shoes and accessories from verified sellers",
    cta: "Explore Running",
    ctaLink: "/products?category=running",
    bg: "from-ig-red to-ig-red/80",
    image: "/images/asics.gif",
  },
  {
    title: "Become a Vendor",
    subtitle: "Reach thousands of sports enthusiasts. Start selling today.",
    cta: "Start Selling",
    ctaLink: "https://vendorcenter.sporttechies.com/",
    bg: "from-ig-black to-ig-black/80",
    image: "/images/adidas.gif",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  const productSliderRef = useRef<HTMLDivElement>(null);
  const newArrivalsSliderRef = useRef<HTMLDivElement>(null);
  const adidasSliderRef = useRef<HTMLDivElement>(null);
  const nikeSliderRef = useRef<HTMLDivElement>(null);
  const garminSliderRef = useRef<HTMLDivElement>(null);
  const asicsSliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<Record<string, boolean>>(
    {},
  );
  const [canScrollRight, setCanScrollRight] = useState<Record<string, boolean>>(
    {},
  );

  const updateScrollButtons = (key: string, el: HTMLDivElement) => {
    const newLeft = el.scrollLeft > 2;
    const newRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
    setCanScrollLeft((prev) =>
      prev[key] === newLeft ? prev : { ...prev, [key]: newLeft },
    );
    setCanScrollRight((prev) =>
      prev[key] === newRight ? prev : { ...prev, [key]: newRight },
    );
  };

  useEffect(() => {
    const sliders = [
      { key: "featured", ref: productSliderRef },
      { key: "newArrivals", ref: newArrivalsSliderRef },
      { key: "adidas", ref: adidasSliderRef },
      { key: "nike", ref: nikeSliderRef },
      { key: "garmin", ref: garminSliderRef },
      { key: "asics", ref: asicsSliderRef },
    ];

    const listeners: {
      el: HTMLDivElement;
      onScroll: () => void;
      onResize: () => void;
    }[] = [];

    const timeoutId = setTimeout(() => {
      sliders.forEach(({ key, ref }) => {
        const el = ref.current;
        if (!el) return;
        updateScrollButtons(key, el);

        let ticking = false;
        const onScroll = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              updateScrollButtons(key, el);
              ticking = false;
            });
            ticking = true;
          }
        };
        const onResize = () => updateScrollButtons(key, el);

        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        listeners.push({ el, onScroll, onResize });
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      listeners.forEach(({ el, onScroll, onResize }) => {
        el.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      });
    };
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;
    let isRetrying = false;

    const fetchProducts = async () => {
      if (!mounted) return;

      try {
        const data = await api.get<{ products: Product[] }>("/api/products");

        if (mounted && data.products && data.products.length > 0) {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);

        if (mounted && !isRetrying) {
          isRetrying = true;
          retryTimeout = setTimeout(() => {
            isRetrying = false;
            if (mounted) {
              fetchProducts();
            }
          }, 3000);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

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

  const scrollSlider = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8);
  const allProducts = products.slice(0, 12);
  const adidasProducts = products
    .filter((p) => p.brand?.toLowerCase() === "adidas")
    .slice(0, 9);
  const nikeProducts = products
    .filter((p) => p.brand?.toLowerCase() === "nike")
    .slice(0, 9);
  const garminProducts = products
    .filter((p) => p.brand?.toLowerCase() === "garmin")
    .slice(0, 9);
  const asicsProducts = products
    .filter((p) => p.brand?.toLowerCase() === "asics")
    .slice(0, 9);

  return (
    <div className="bg-secondary/30 min-h-screen pb-12 antialiased">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto p-1.5 md:p-4 overflow-x-hidden">
          <div className="flex gap-2">
            {/* Left Column - Categories */}
            <div className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-sm shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-green text-white px-4 py-3 font-semibold text-sm">
                  Top Categories
                </div>
                <nav className="py-1 px-4">
                  {MOCK_CATEGORIES.slice(0, 7).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center px-4 py-2 text-sm text-foreground rounded-sm hover:bg-ig-green-light hover:text-ig-green transition-colors"
                    >
                      <span className="w-4 h-4 flex items-center justify-center mr-3">
                        {cat.icon}
                      </span>
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-ig-green hover:bg-ig-green-light transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-3" />
                    View All
                  </Link>
                </nav>
              </div>
            </div>

            {/* Center Column - Banner Slider */}
            <div className="flex-1 min-w-0">
              <div
                className="relative overflow-hidden rounded-sm h-[198px] lg:h-[348px] lg:w-[712px]  group"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const mid = rect.width / 2;
                  e.currentTarget.dataset.side = x < mid ? "left" : "right";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.dataset.side = "";
                }}
              >
                <div
                  className="flex transition-none duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${heroIdx * 100}%)` }}
                >
                  {HERO_SLIDES.map((slide, idx) => (
                    <div key={idx} className="min-w-full h-full relative">
                      <div className="absolute inset-0 bg-gray-100">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          unoptimized
                          className="object-fill"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority={idx === 0}
                        />
                      </div>
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
            </div>

            {/* Right Column - Brands */}
            <div className="hidden lg:block w-68 shrink-0">
              <div className="bg-white rounded-sm shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-black text-white px-4 py-3 font-semibold text-sm">
                  Top Brands
                </div>
                <div className="py-2 px-4 grid grid-cols-3 gap-2">
                  {FEATURED_BRANDS.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${encodeURIComponent(brand.name)}`}
                      className="flex items-center justify-center px-1 shadow-sm shadow-ig-green-light rounded-sm hover:bg-ig-green-light transition-all group"
                    >
                      <img src={`${brand.logo}`} alt="" className="h-16" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Bar - Mobile */}
      <section className="lg:hidden">
        <div className="max-w-7xl mx-auto px-1 py-2">
          <h3 className="text-xl font-semibold bg-ig-black text-white mb-4 text-center rounded-t-sm">
            Top Brands
          </h3>
          <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="flex-shrink-0 flex items-center gap-2 group"
              >
                <div className="w-16 h-16 p-2 rounded-sm overflow-hidden shadow-sm transition-all group-hover:scale-105">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-ig-red text-white px-2 rounded-t-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1"
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(productSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["featured"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={productSliderRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[200px] sm:min-w-[220px] snap-start"
                    >
                      <HomeProductCardSkeleton />
                    </div>
                  ))
                : featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-[200px] sm:w-[220px] h-full shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>

            <button
              onClick={() => scrollSlider(productSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["featured"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories - Mobile: Horizontal Slider */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-ig-green transition-all shadow-sm group-hover:scale-105">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-foreground text-center w-16 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid - Desktop */}
      <section className="hidden lg:block max-w-7xl mx-auto px-1 lg:px-4 my-2">
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 bg-ig-green-light rounded-md py-4 shadow-sm border border-neutral-100">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-neutral-200 group-hover:ring-ig-green transition-all duration-200 ease-out shadow-sm group-hover:scale-105 bg-white relative">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover p-0.5 rounded-full"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xs font-bold text-neutral-700 group-hover:text-ig-green transition-colors truncate max-w-[110px]">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Adidas Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-ig-black text-white px-2 rounded-t-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Best Of Adidas</h2>
            </div>
            <Link
              href="/products?brand=Adidas"
              className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1"
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(adidasSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["adidas"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={adidasSliderRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : adidasProducts.length > 0 ? (
                adidasProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[200px] sm:w-[220px] shrink-0 snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 px-2">
                  No Adidas products available at the moment.
                </p>
              )}
            </div>

            <button
              onClick={() => scrollSlider(adidasSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["adidas"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Nike Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-neutral-900 text-white px-2 rounded-t-sm border-l-4 border-orange-500">
            <div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-neutral-100">
                Official Nike Hub
              </h2>
            </div>
            <Link
              href="/products?brand=Nike"
              className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1 text-orange-400"
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(nikeSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["nike"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={nikeSliderRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : nikeProducts.length > 0 ? (
                nikeProducts.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 px-2">
                  No Nike products available at the moment.
                </p>
              )}
            </div>

            <button
              onClick={() => scrollSlider(nikeSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["nike"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Garmin Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-blue-700 text-white px-2 rounded-t-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Official Garmin Hub
              </h2>
            </div>
            <Link
              href="/products?brand=Garmin"
              className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1"
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(garminSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["garmin"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={garminSliderRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : garminProducts.length > 0 ? (
                garminProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[200px] sm:w-[220px] shrink-0 snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 px-2">
                  No Garmin products available at the moment.
                </p>
              )}
            </div>

            <button
              onClick={() => scrollSlider(adidasSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["adidas"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Asics Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-gradient-to-r from-blue-600 to-indigo-800 text-white px-2 rounded-t-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Official Asics Hub
              </h2>
            </div>
            <Link
              href="/products?brand=Asics"
              className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1"
            >
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(asicsSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["asics"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={asicsSliderRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : asicsProducts.length > 0 ? (
                asicsProducts.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 px-2">
                  No Asics products available at the moment.
                </p>
              )}
            </div>

            <button
              onClick={() => scrollSlider(asicsSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["asics"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Jumia Double-Sided Promo Banners */}
      <section className="hidden md:grid grid-cols-2 max-w-7xl mx-auto px-4 gap-4 py-4">
        <Link
          href="/products?category=running"
          className="relative h-[160px] overflow-hidden rounded-sm border border-neutral-200 shadow-sm bg-gray-100 group transition-opacity hover:opacity-95"
        >
          <Image
            src="/images/banner.gif"
            alt="Running Deals Banner"
            fill
            unoptimized
            className="object-cover"
          />
        </Link>
        <Link
          href="/products?featured=true"
          className="relative h-[160px] overflow-hidden rounded-sm border border-neutral-200 shadow-sm bg-gray-100 group transition-opacity hover:opacity-95"
        >
          <Image
            src="/images/banner.gif"
            alt="Premium Tech Gear Banner"
            fill
            unoptimized
            className="object-cover"
          />
        </Link>
      </section>

      {/* New Arrivals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="border-b">
          <div className="flex items-center justify-between mb-2 bg-ig-green text-white px-2 rounded-t-sm">
            <h2 className="text-xl md:text-2xl font-bold">New Arrivals</h2>
            <Link
              href="/products"
              className="text-sm font-medium hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={() => scrollSlider(newArrivalsSliderRef, "left")}
              className={`hidden lg:absolute left-0 -translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollLeft["newArrivals"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            <div
              ref={newArrivalsSliderRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[200px] sm:min-w-[220px] snap-start"
                    >
                      <ProductCardSkeleton />
                    </div>
                  ))
                : allProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-[200px] sm:w-[220px] shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>

            <button
              onClick={() => scrollSlider(newArrivalsSliderRef, "right")}
              className={`hidden lg:absolute right-0 translate-x-1/2 z-10 p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors shadow-sm ${
                canScrollRight["newArrivals"] ? "flex" : "hidden"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/*Marketplace Context SEO Panel */}
      <StoreSEOText />
    </div>
  );
}

function StoreSEOText() {
  return (
    <section className="bg-white border-t border-neutral-200 mt-12 py-10 text-neutral-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="space-y-6 max-w-none prose prose-sm prose-neutral">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
              RunnerMKT - Kenya's Leading Online Sports & Fitness Marketplace
            </h1>
            <h2 className="text-sm md:text-base font-semibold text-neutral-800 mb-2">
              Welcome to the ultimate destination for sports gear and apparel!
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Our e-commerce platform is built to revolutionize your athletic
              shopping experience across Kenya. Whether you are on the hunt for
              high-end fitness tracking technology, professional running shoes,
              or essential strength equipment, we've got you covered. Skip the
              stress of navigating crowded local malls—enjoy premium shopping
              convenience from Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and
              all across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs md:text-sm text-neutral-600">
            <div>
              <h3 className="font-bold text-neutral-800 text-sm md:text-base mb-1">
                Best Prices, Authentic Brands & Diverse Categories
              </h3>
              <p className="leading-relaxed">
                We bridge the gap between verified local vendors and athletes,
                ensuring you get maximum value for your money. Explore deep
                catalogs featuring functional fitness tech, lightweight training
                tees, durable water bottles, and protective gym accessories.
                Shop directly from world-renowned brands such as{" "}
                <Link
                  href="/products?brand=Adidas"
                  className="text-ig-green hover:underline font-medium"
                >
                  Adidas
                </Link>
                ,{" "}
                <Link
                  href="/products?brand=Nike"
                  className="text-ig-green hover:underline font-medium"
                >
                  Nike
                </Link>
                ,{" "}
                <Link
                  href="/products?brand=Asics"
                  className="text-ig-green hover:underline font-medium"
                >
                  Asics
                </Link>
                , and{" "}
                <Link
                  href="/products?brand=Garmin"
                  className="text-ig-green hover:underline font-medium"
                >
                  Garmin
                </Link>{" "}
                with guaranteed quality assurance.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 text-sm md:text-base mb-1">
                Exceptional Delivery & Support Systems
              </h3>
              <p className="leading-relaxed">
                Get premium items delivered securely to your doorstep. We
                coordinate with fast logistics channels to guarantee quick
                timelines. Purchases above KES 5,000 enjoy free shipping! Need
                assistance tracking a package, checking item warranties, or
                managing custom team orders? Contact our live support system or
                drop us a message instantly via WhatsApp using our header help
                links.
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 my-6" />

          <div>
            <h3 className="text-sm md:text-base font-bold text-neutral-900 mb-4">
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="space-y-4 text-xs md:text-sm">
              <div>
                <p className="font-semibold text-neutral-800">
                  1. How do I place an order?
                </p>
                <p className="text-neutral-600">
                  Finding and ordering gear is simple: search or browse
                  categories, add your favorite products to your shopping cart,
                  and follow checkout prompts to complete your secure delivery
                  details.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  2. What payment methods do you support?
                </p>
                <p className="text-neutral-600">
                  We accept Lipa na M-PESA Paybill transactions, verified
                  Credit/Debit Cards (Visa/Mastercard), and traditional secure
                  checkout integrations tailored for regional Kenyan customers.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  3. How long does shipping take?
                </p>
                <p className="text-neutral-600">
                  Standard deliveries within Iten & Eldoret take 3 to 12 working
                  hours. Upcountry orders across other major cities and towns
                  take between 2 to 4 business days depending on localized
                  vendor dispatch configurations.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  4. Can I sell items on RunnerMKT?
                </p>
                <p className="text-neutral-600">
                  Yes! If you are an authorized distributor, independent gym
                  equipment supplier, or fitness merchant in Kenya, click 'Sell
                  on RunnerMKT' at the top bar to set up your store vendor
                  portal profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
