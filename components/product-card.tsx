"use client";

import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/product/rating-stars";
import { ProductBadges } from "@/components/product/product-badges";
import { VendorRow } from "@/components/product/vendor-row";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { formatPrice, getDiscountPercent, type Product } from "@/lib/products";

export type { Product };

export function ProductCard({ product }: { product: Product }) {
  const discount = getDiscountPercent(product.price, product.compare_price);

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white border border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
          <ProductBadges discount={discount} featured={product.is_featured} />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1 min-h-0">
          {/* Vendor */}
          <div className="h-5 mb-1">
            {product.vendor_name && (
              <VendorRow
                name={product.vendor_name}
                verified={product.vendor_verified}
              />
            )}
          </div>

          {/* Name */}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[40px] group-hover:text-ig-green transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="h-5 mt-2">
            <RatingStars
              rating={product.rating}
              totalReviews={product.total_reviews}
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <p className="text-gray-600 text-sm font-bold">
              {formatPrice(product.price)}
            </p>
            {product.compare_price && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          <AddToCartButton product={product} className="mt-3" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Mirrors ProductCard's exact box model (h-[420px] card, h-[220px] image,
 * h-5 / min-h-[40px] / h-5 / min-h-[28px] content rows) so swapping from
 * skeleton to real data never shifts layout or "pops" — a real card and
 * its skeleton should always occupy identical space.
 */
export function ProductCardSkeleton() {
  return (
    <div
      className="bg-white border border-border rounded-sm overflow-hidden animate-pulse h-[420px] flex flex-col"
      aria-hidden
    >
      <div className="relative w-full h-[220px] bg-muted flex items-center justify-center shrink-0">
        <div className="w-16 h-16 relative">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            className="object-contain opacity-30 grayscale-100"
          />
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 min-h-0">
        <div className="h-5 mb-1">
          <div className="h-3 bg-muted rounded w-16" />
        </div>

        <div className="min-h-[40px] space-y-1.5">
          <div className="h-3.5 bg-muted rounded w-full" />
          <div className="h-3.5 bg-muted rounded w-3/4" />
        </div>

        <div className="h-5 mt-2 flex items-center">
          <div className="h-3 bg-muted rounded w-20" />
        </div>

        <div className="min-h-[28px] mt-2 flex items-center">
          <div className="h-5 bg-muted rounded w-24" />
        </div>

        <div className="flex-1" />

        <div className="h-8 bg-muted rounded w-full mt-3" />
      </div>
    </div>
  );
}
