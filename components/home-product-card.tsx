"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { ProductBadges } from "@/components/product/product-badges";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { formatPrice, getDiscountPercent, type Product } from "@/lib/products";

export type { Product };

/**
 * Lightweight card used on the homepage sliders. Deliberately shows less
 * than the full ProductCard — just image, name, price, and the discount,
 * plus a small floating add-to-cart button — so browsing stays fast and
 * scannable; vendor/rating live on the full product page and the listing
 * page's ProductCard instead.
 */
export function HomeProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product.price, product.compare_price);
  const handleAddToCart = useAddToCart(product);

  return (
    <Link href={`/products/${product.slug}`} className="block">
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="h-full w-full object-contain bg-gray-100 transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        <ProductBadges discount={discount} featured={false} />

        <button
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-2 right-2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md border border-border text-ig-green transition-all duration-200 hover:bg-ig-green hover:text-white hover:scale-110 active:scale-95"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Content: name + price only */}
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-gray-800 mb-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-start gap-1">
          <p className="text-gray-600 text-sm sm:text-md font-bold">
            {formatPrice(product.price)}
          </p>
          {product.compare_price && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function HomeProductCardSkeleton() {
  return (
    <div
      className="bg-white border border-border rounded-sm overflow-hidden animate-pulse h-full flex flex-col"
      aria-hidden
    >
      <div className="relative aspect-square bg-muted flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            className="object-contain opacity-30 grayscale-100"
          />
        </div>
        <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white/70 border border-border" />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="min-h-[40px] space-y-1.5">
          <div className="h-3.5 bg-muted rounded w-full" />
          <div className="h-3.5 bg-muted rounded w-3/4" />
        </div>
        <div className="mt-auto h-5 bg-muted rounded w-24" />
      </div>
    </div>
  );
}
