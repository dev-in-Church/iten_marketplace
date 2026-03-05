"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/mock-data";
import { formatPrice, getDiscountPercent } from "@/lib/mock-data";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = getDiscountPercent(product.price, product.compare_price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.compare_price,
      thumbnail: product.thumbnail,
      currency: product.currency,
      vendorName: product.vendor_name,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {discount && (
            <span className="absolute top-2 left-2 bg-ig-red text-white text-xs font-bold px-2 py-1 rounded">
              {`-${discount}%`}
            </span>
          )}
          {product.is_featured && (
            <span className="absolute top-2 right-2 bg-ig-green text-white text-[10px] font-bold px-2 py-0.5 rounded">
              FEATURED
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Vendor */}
          {product.vendor_name && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[11px] text-muted-foreground truncate">{product.vendor_name}</span>
              {product.vendor_verified && (
                <BadgeCheck className="h-3.5 w-3.5 text-ig-green shrink-0" />
              )}
            </div>
          )}

          {/* Name */}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-ig-green transition-colors mb-1.5 flex-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({product.total_reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-ig-black">{formatPrice(product.price, product.currency)}</span>
            {product.compare_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_price, product.currency)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <Button
            size="sm"
            className="w-full bg-ig-green hover:bg-ig-green/90 text-white gap-1.5"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-5 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
