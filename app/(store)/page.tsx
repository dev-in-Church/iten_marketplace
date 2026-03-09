"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
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
  BikeIcon,
  Bike,
} from "lucide-react";

const HERO_SLIDES = [
  {
    title: "Gear Up for Greatness",
    subtitle: "Premium sports equipment from top vendors across Kenya",
    cta: "Shop Now",
    ctaLink: "/products",
    bg: "from-ig-green to-ig-green/80",
    image: "/images/hero-banner.jpg",
  },
  {
    title: "Running Season is Here",
    subtitle:
      "Up to 30% off on running shoes and accessories from verified sellers",
    cta: "Explore Running",
    ctaLink: "/products?category=running",
    bg: "from-ig-red to-ig-red/80",
    image: "/images/products/running-shoes.jpg",
  },
  {
    title: "Become a Vendor",
    subtitle: "Reach thousands of sports enthusiasts. Start selling today.",
    cta: "Start Selling",
    ctaLink: "/vendor",
    bg: "from-ig-black to-ig-black/80",
    image: "/images/products/jersey.jpg",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const productSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get<{ products: Product[] }>("/api/products", {
          limit: "12",
          featured: "true",
        });
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

  const scrollProducts = (direction: "left" | "right") => {
    if (productSliderRef.current) {
      const scrollAmount = 300;
      productSliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8);
  const allProducts = products.slice(0, 12);

  return (
    <div>
      {/* Hero Section - 3 Column Layout on Desktop */}
      <section className="bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            {/* Left Column - Categories (hidden on mobile) */}
            <div className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-lg shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-green text-white px-4 py-3 font-semibold text-sm">
                  Categories
                </div>
                <nav className="py-2 px-4">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center px-4 py-2.5 text-sm text-foreground rounded-md hover:bg-ig-green-light hover:text-ig-green transition-colors"
                    >
                      <span className="w-5 h-5  flex items-center justify-center mr-3">
                        {/* {cat.name.charAt(0)} */}
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
              <div className="relative overflow-hidden rounded-lg h-[280px] md:h-full">
                {/* Slides */}
                <div
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${heroIdx * 100}%)` }}
                >
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`min-w-full h-full bg-gradient-to-r ${slide.bg} relative`}
                    >
                      {/* Background Image with Overlay */}
                      <div className="absolute inset-0">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover opacity-20"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority={idx === 0}
                        />
                      </div>
                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-center px-6 md:px-10 text-white">
                        <h2 className="text-2xl md:text-4xl font-bold mb-3 text-balance max-w-md">
                          {slide.title}
                        </h2>
                        <p className="text-sm md:text-base text-white/80 mb-5 max-w-sm text-pretty">
                          {slide.subtitle}
                        </p>
                        <Link href={slide.ctaLink}>
                          <Button className="bg-white text-ig-black hover:bg-white/90 font-semibold gap-2 w-fit">
                            {slide.cta}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {HERO_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Brands (hidden on mobile) */}
            <div className="hidden lg:block w-44 shrink-0">
              <div className="bg-white rounded-lg shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-black text-white px-4 py-3 font-semibold text-sm">
                  Top Brands
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                  {FEATURED_BRANDS.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${brand.slug}`}
                      className="flex items-center justify-center px-1 shadow-sm shadow-ig-green-light rounded-sm hover:bg-ig-green-light transition-all group"
                    >
                      {/* <span className="text-sm font-bold text-muted-foreground group-hover:text-ig-green transition-colors">
                        {brand.name}
                      </span> */}
                      <img src={`${brand.logo}`} alt="" className="h-16" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-border">
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
      </section>

      {/* Categories - Mobile Only */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 py-6">
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
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center p-3 bg-white border border-border rounded-lg hover:border-ig-green transition-colors min-w-[80px]"
            >
              <div className="w-10 h-10 rounded-full bg-ig-green-light flex items-center justify-center mb-2">
                <span className="text-ig-green font-bold text-sm">
                  {cat.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-medium text-foreground text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Handpicked by our team
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollProducts("left")}
                className="p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
              <button
                onClick={() => scrollProducts("right")}
                className="p-2 rounded-full bg-white border border-border hover:border-ig-green transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
              <Link
                href="/products?featured=true"
                className="hidden sm:flex text-sm text-ig-green font-medium hover:underline items-center gap-1 ml-2"
              >
                See All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          <div
            ref={productSliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[200px] sm:min-w-[220px] snap-start"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-ig-red rounded-xl overflow-hidden">
          <div className="px-6 md:px-10 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Limited Offer
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2 text-balance">
                Up to 30% Off on Running Gear
              </h2>
              <p className="text-white/70 text-sm md:text-base">
                Shop the best running shoes, apparel and accessories at
                discounted prices.
              </p>
            </div>
            <Link href="/products?category=running">
              <Button
                size="lg"
                className="bg-white text-ig-red hover:bg-white/90 font-semibold shrink-0"
              >
                Shop Running
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid - Desktop */}
      <section className="hidden lg:block max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">
            Browse Categories
          </h2>
          <Link
            href="/products"
            className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group bg-white border border-border rounded-lg p-5 text-center hover:border-ig-green hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-ig-green-light mx-auto mb-3 flex items-center justify-center group-hover:bg-ig-green transition-colors">
                <span className="text-ig-green group-hover:text-white font-bold text-lg transition-colors">
                  {cat.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            New Arrivals
          </h2>
          <Link
            href="/products"
            className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Brands Bar - Mobile */}
      <section className="lg:hidden bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
            Shop by Brand
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="px-4 py-2 border border-border rounded-full text-sm font-medium text-muted-foreground hover:border-ig-green hover:text-ig-green transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-ig-black">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
            Start Selling on ItenGear Today
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-pretty text-sm md:text-base">
            Join hundreds of vendors selling sports equipment to customers
            across Kenya. Get verified and reach more buyers.
          </p>
          <Link href="/vendor">
            <Button
              size="lg"
              className="bg-ig-green hover:bg-ig-green/90 text-white font-semibold gap-2"
            >
              Become a Vendor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
