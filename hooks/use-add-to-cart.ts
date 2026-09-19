"use client";

import type { MouseEvent } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export function useAddToCart(product: Product) {
  const { addToCart } = useCart();

  return function handleAddToCart(e: MouseEvent) {
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
}
