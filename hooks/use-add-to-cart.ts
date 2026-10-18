"use client";

import type { MouseEvent } from "react";
import { useCart } from "@/lib/cart-context";
import { useInternationalRequest } from "@/lib/international-request-context";
import type { Product } from "@/lib/products";

export function useAddToCart(product: Product) {
  const { addToCart } = useCart();
  const { addItem } = useInternationalRequest();

  const isInternational = product.vendor_type === "international";

  const handleProductAction = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInternational) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        thumbnail: product.thumbnail,
        currency: product.currency,
        vendorName: product.vendor_name || "",
      });
      return;
    }

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

  return { handleProductAction, isInternational };
}
