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
  const handleAddToCart = useAddToCart(product);

  return (
    <Button
      size="sm"
      className={`w-full bg-ig-green hover:bg-ig-green/90 text-white gap-1.5 ${className}`}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      Add to Cart
    </Button>
  );
}
