"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import type { Product } from "@/lib/products";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { handleProductAction, isInternational } = useAddToCart(product);

  return (
    <Button
      size="sm"
      className="w-full text-white gap-1.5 bg-ig-green hover:bg-ig-green/90"
      onClick={handleProductAction}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      {isInternational ? "Add to Request" : "Add to Cart"}
    </Button>
  );
}
