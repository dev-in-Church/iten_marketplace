"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, type Product } from "@/lib/mock-data";
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

const HERO_SLIDES = [
  {
    title: "Gear Up for Greatness",
    subtitle: "Premium sports equipment from top vendors across Kenya",
    cta: "Shop Now",
    ctaLink: "/products",
    bg: "bg-ig-green",
  },
  {
    title: "Running Season is Here",
    subtitle: "Up to 30% off on running shoes and accessories from verified sellers",
    cta: "Explore Running",
    ctaLink: "/products?category=running",
    bg: "bg-ig-red",
  },
  {
    title: "Become a Vendor",
    subtitle: "Reach thousands of sports enthusiasts. Start selling today.",
    cta: "Start Selling",
    ctaLink: "/vendor",
    bg: "bg-ig-black",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.get<{ products: Product[] }>("/api/products", { limit: "12", featured: "true" });
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

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8);
  const allProducts = products.slice(0, 12);

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div className={`${HERO_SLIDES[heroIdx].bg} text-white transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="flex items-center justify-between">
              <div className="max-w-lg">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
                  {HERO_SLIDES[heroIdx].title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-6 text-pretty">
                  {HERO_SLIDES[heroIdx].subtitle}
                </p>
                <Link href={HERO_SLIDES[heroIdx].ctaLink}>
                  <Button size="lg" className="bg-white text-ig-black hover:bg-white/90 font-semibold gap-2">
                    {HERO_SLIDES[heroIdx].cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative w-[280px] h-[200px]">
                <Image
                  src="/images/hero-banner.jpg"
                  alt="Sports equipment"
                  width={280}
                  height={200}
                  className="rounded-lg opacity-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
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
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light">
                <Truck className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Orders over KES 5,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light">
                <Shield className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Secure Payments</p>
                <p className="text-xs text-muted-foreground">M-Pesa protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light">
                <RefreshCcw className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-ig-green-light">
                <Headphones className="h-5 w-5 text-ig-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">24/7 Support</p>
                <p className="text-xs text-muted-foreground">Dedicated help center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Shop by Category</h2>
          <Link href="/products" className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group bg-white border border-border rounded-lg p-4 text-center hover:border-ig-green hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-ig-green-light mx-auto mb-3 flex items-center justify-center group-hover:bg-ig-green transition-colors">
                <span className="text-ig-green group-hover:text-white font-bold text-sm transition-colors">
                  {cat.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
              {cat.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{cat.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Products</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Handpicked by our team</p>
            </div>
            <Link href="/products?featured=true" className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1">
              See All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-ig-red rounded-xl overflow-hidden">
          <div className="px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Limited Offer
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2 text-balance">
                Up to 30% Off on Running Gear
              </h2>
              <p className="text-white/70">Shop the best running shoes, apparel and accessories at discounted prices.</p>
            </div>
            <Link href="/products?category=running">
              <Button size="lg" className="bg-white text-ig-red hover:bg-white/90 font-semibold shrink-0">
                Shop Running
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">New Arrivals</h2>
          <Link href="/products" className="text-sm text-ig-green font-medium hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-ig-black">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-balance">
            Start Selling on ItenGear Today
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-pretty">
            Join hundreds of vendors selling sports equipment to customers across Kenya. Get verified and reach more buyers.
          </p>
          <Link href="/vendor">
            <Button size="lg" className="bg-ig-green hover:bg-ig-green/90 text-white font-semibold gap-2">
              Become a Vendor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
