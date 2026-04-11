"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MOCK_PRODUCTS,
  formatPrice,
  getDiscountPercent,
  type Product,
} from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Star,
  BadgeCheck,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ product: Product }>(
          `/api/products/${slug}`,
        );
        setProduct(data.product);
      } catch {
        const found = MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
        setProduct(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.compare_price,
      thumbnail: product.thumbnail,
      currency: product.currency,
      vendorName: product.vendor_name,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
            <div className="h-12 bg-muted rounded w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Product Not Found
        </h1>
        <p className="text-muted-foreground mb-4">
          The product you are looking for does not exist.
        </p>
        <Link href="/products">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.compare_price);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-ig-green">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ig-green">
          Products
        </Link>
        <span>/</span>
        {product.category_slug && (
          <>
            <Link
              href={`/products?category=${product.category_slug}`}
              className="hover:text-ig-green"
            >
              {product.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium truncate">
          {product.name}
        </span>
      </nav>

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-ig-green hover:underline mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 bg-ig-green-light text-ig-green text-sm font-bold px-3 py-1 rounded">
              {`-${discount}%`}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Vendor */}
          {product.vendor_name && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm text-muted-foreground">
                {product.vendor_name}
              </span>
              {product.vendor_verified && (
                <BadgeCheck className="h-4 w-4 text-ig-green" />
              )}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.total_reviews} reviews)
            </span>
            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm text-ig-green">
              {product.total_sold} sold
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
            <span className="text-3xl font-bold text-ig-black">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compare_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_price, product.currency)}
              </span>
            )}
            {discount && (
              <span className="bg-ig-red-light text-ig-red text-sm font-semibold px-2 py-0.5 rounded">{`Save ${discount}%`}</span>
            )}
          </div>

          {/* Description */}
          {product.short_description && (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-secondary transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-secondary transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className={`flex-1 gap-2 text-white font-semibold ${added ? "bg-green-600 hover:bg-green-600" : "bg-ig-green hover:bg-ig-green/90"}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {added ? "Added!" : "Add to Cart"}
            </Button>
          </div>

          {/* Info */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-ig-green" />
              <span>Free delivery on orders above KES 5,000</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-ig-green" />
              <span>Secure payment via M-Pesa</span>
            </div>
          </div>

          {/* Category/Brand */}
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            {product.category_name && (
              <p className="text-sm">
                <span className="text-muted-foreground">Category: </span>
                <Link
                  href={`/products?category=${product.category_slug}`}
                  className="text-ig-green hover:underline"
                >
                  {product.category_name}
                </Link>
              </p>
            )}
            Music{product.brand && (
              <p className="text-sm">
                <span className="text-muted-foreground">Brand: </span>
                <span className="text-foreground font-medium">
                  {product.brand}
                </span>
              </p>
            )}
          </div>
        </diMusicv>
      </div>
    </div>
  );
}
