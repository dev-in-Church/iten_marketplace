"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import {
  HomeProductCard,
  HomeProductCardSkeleton,
} from "@/components/home-product-card";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS, type Product } from "@/lib/mock-data";
import { MOCK_CATEGORIES } from "@/lib/categories-panel";
import { FEATURED_BRANDS } from "@/lib/delivery-data";
import api from "@/lib/api";
import {
  ArrowRight,
  Truck,
  Shield,
  RefreshCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SellOnRunnerMKT } from "@/components/vendor-consent";

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

  const [canScrollLeft, setCanScrollLeft] = useState<Record<string, boolean>>(
    {},
  );
  const [canScrollRight, setCanScrollRight] = useState<Record<string, boolean>>(
    {},
  );

  // FIX 3: Only update scroll button state when value actually changes
  // to avoid unnecessary re-renders that cause image repaints
  const updateScrollButtons = (key: string, el: HTMLDivElement) => {
    const newLeft = el.scrollLeft > 0;
    const newRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
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
    ];

    const listeners: {
      el: HTMLDivElement;
      onScroll: () => void;
      onResize: () => void;
    }[] = [];

    sliders.forEach(({ key, ref }) => {
      const el = ref.current;
      if (!el) return;
      updateScrollButtons(key, el);
      const onScroll = () => updateScrollButtons(key, el);
      const onResize = () => updateScrollButtons(key, el);
      el.addEventListener("scroll", onScroll);
      window.addEventListener("resize", onResize);
      listeners.push({ el, onScroll, onResize });
    });

    return () => {
      listeners.forEach(({ el, onScroll, onResize }) => {
        el.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      });
    };
  }, [loading]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get<{ products: Product[] }>("/api/products");
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
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
  // console.log(adidasProducts);
  console.log(products.length); // Is this less than your total product count?

  return (
    <div className="bg-secondary/30">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto p-1.5 md:p-4">
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
            <div className="hidden lg:block w-70 shrink-0">
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
                className="flex-shrink-0 flex  items-center gap-2 group"
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
        <div className="">
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
                      className="min-w-[200px] sm:min-w-[220px] snap-start"
                    >
                      <HomeProductCard product={product} />
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
        <div className="grid grid-cols-7 gap-6 bg-ig-green-light rounded-md py-3">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div
                className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-border
          group-hover:ring-ig-green transition-all shadow-md
          group-hover:scale-105
          will-change-transform [transform:translateZ(0)]"
              >
                {" "}
                {/* ← ADD THIS */}
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-foreground">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Adidas Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
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
                  className="min-w-[200px] sm:min-w-[220px] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4">
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
      </section>

      {/* Promo Banner - GIF */}
      <section className="hidden lg:block max-w-7xl mx-auto px-4 py-2">
        <Link href="/products?category=running">
          <div className="relative rounded-sm h-[260px] overflow-hidden w-full border aspect-[3/1] bg-gray-100">
            <Image
              src="/images/banner.gif"
              alt="Promotional offer"
              fill
              unoptimized
              className="object-fit"
            />
          </div>
        </Link>
      </section>

      {/* New Arrivals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
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
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
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
      </section>

      {/* Adidas Deals Slider */}
      <section className="max-w-7xl mx-auto px-1 lg:px-4 py-2">
        <div className="flex items-center justify-between mb-2 bg-ig-green text-white px-2 rounded-t-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Best Of Nike</h2>
          </div>
          <Link
            href="/products?brand=Nike"
            className="hidden sm:flex text-sm font-medium hover:underline items-center gap-1"
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
              <p className="text-sm text-muted-foreground py-4">
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
      </section>

      {/* Trust Bar */}
      {/* <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light shrink-0">
                <Truck className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Free Delivery
                </p>
                <p className="text-xs text-muted-foreground">
                  Orders over KES 5,000
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light shrink-0">
                <Shield className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Secure Payments
                </p>
                <p className="text-xs text-muted-foreground">M-Pesa & Card</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light shrink-0">
                <RefreshCcw className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Easy Returns
                </p>
                <p className="text-xs text-muted-foreground">
                  7-day return policy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light shrink-0">
                <Headphones className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  24/7 Support
                </p>
                <p className="text-xs text-muted-foreground">
                  Dedicated help center
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Vendor CTA */}
      {/* <section className="bg-ig-black">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
            Start Selling on RunnerMKT Today
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-pretty text-sm md:text-base">
            Join hundreds of vendors selling sports equipment to customers
            across Kenya. Get verified and reach more buyers.
          </p>
          <Link href="https://vendorcenter.sporttechies.com/">
            <Button
              size="lg"
              className="bg-ig-green hover:bg-ig-green/90 text-white font-semibold gap-2"
            >
              Become a Vendor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section> */}
      {/* <SellOnRunnerMKT /> */}
    </div>
  );
}
