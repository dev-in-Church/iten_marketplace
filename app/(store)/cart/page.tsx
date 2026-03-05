"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, count, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Browse our products and find something you love.</p>
        <Link href="/products">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white gap-2">
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-ig-green">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart ({count} items)</span>
      </nav>

      <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-t border-border items-center">
                {/* Product */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                  <div className="relative h-16 w-16 md:h-20 md:w-20 bg-secondary rounded overflow-hidden shrink-0">
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/products/${item.slug}`} className="text-sm font-medium text-foreground hover:text-ig-green line-clamp-2">
                      {item.name}
                    </Link>
                    {item.vendorName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.vendorName}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="text-sm font-medium text-foreground">{formatPrice(item.price, item.currency)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-secondary transition-colors"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Total + Remove */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity, item.currency)}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-muted-foreground hover:text-ig-red transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link href="/products">
              <Button variant="outline" size="sm" className="gap-1.5 text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={clearCart} className="text-ig-red border-ig-red hover:bg-ig-red-light hover:text-ig-red">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-lg p-6 sticky top-32">
            <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({count} items)</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-ig-green font-medium">{subtotal >= 5000 ? "Free" : formatPrice(300)}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-ig-black">{formatPrice(subtotal + (subtotal >= 5000 ? 0 : 300))}</span>
              </div>
            </div>

            {user ? (
              <Link href="/checkout" className="block">
                <Button className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login?redirect=/checkout" className="block">
                  <Button className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
                    Sign In to Checkout
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  {"Don't have an account? "}
                  <Link href="/auth/register" className="text-ig-green hover:underline">Register</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
