import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";
import { StoreSEOText } from "@/components/store-seo-text";
import { BrandSliders } from "@/components/brand-slider";
import { CategorySliders } from "@/components/category-slider";
import { MOCK_CATEGORIES } from "@/lib/categories-panel";
import { FEATURED_BRANDS } from "@/lib/delivery-data";

export default function HomePage() {
  return (
    <div className="bg-secondary/30 min-h-screen pb-12 antialiased lg:px-8">
      {/* Hero Section */}
      <section>
        <div className="max-w-7xl mx-auto p-1.5 md:p-4 overflow-x-hidden">
          <div className="grid grid-cols-1 w-full h-auto lg:max-h-[384px] lg:grid-cols-[1fr_3fr_1fr] gap-3">
            {/* Left Column - Categories */}
            <div className="hidden lg:block shrink-0">
              <div className="bg-white rounded-sm shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-green text-white px-4 py-2 font-semibold text-sm">
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
            <HeroSlider />

            {/* Right Column - Brands */}
            <div className="hidden lg:block shrink-0">
              <div className="bg-white rounded-sm shadow-sm shadow-ig-green-light overflow-hidden h-full">
                <div className="bg-ig-black text-white px-4 py-2 font-semibold text-sm">
                  Top Brands
                </div>
                <div className="py-1 px-2 grid grid-cols-3 gap-2">
                  {FEATURED_BRANDS.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${encodeURIComponent(brand.name)}`}
                      className="flex items-center justify-center px-1 shadow-sm shadow-ig-green-light rounded-sm hover:bg-ig-green-light transition-all group"
                    >
                      <img src={brand.logo} alt="" className="h-16" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Hubs — Adidas, Nike, Garmin, Asics, and any future brand
          added to the BRAND_SLIDERS config in brand-slider.tsx. Each
          slider fetches its own products, independent of the others. */}
      <BrandSliders />

      {/* Category Hubs — Supplements, Biking, Football, and any future
          category added to the CATEGORY_SLIDERS config in
          category-slider.tsx. */}
      <CategorySliders />

      <StoreSEOText />
    </div>
  );
}
