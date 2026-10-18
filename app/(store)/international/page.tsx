"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe2, Minus, Plus, Send, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useInternationalRequest } from "@/lib/international-request-context";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import type { Product } from "@/lib/mock-data";

const MINIMUM_SUBTOTAL = 10000;

export default function InternationalMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [shippingNotes, setShippingNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { items, subtotal, updateQuantity, removeItem, clear } =
    useInternationalRequest();

  useEffect(() => {
    api
      .get<{ products: Product[] }>(
        "/api/products?vendorType=international&limit=50",
      )
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const submitRequest = async () => {
    setError("");
    if (!user) {
      setError(
        "Please sign in before submitting an international order request.",
      );
      return;
    }
    if (subtotal < MINIMUM_SUBTOTAL) {
      setError(
        `Add at least $${MINIMUM_SUBTOTAL.toLocaleString()} of products to submit a request.`,
      );
      return;
    }
    try {
      await api.post("/api/international-requests", {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerNotes: notes,
        shippingNotes,
      });
      clear();
      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your request.",
      );
    }
  };

  return (
    <div className="bg-background">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-emerald-300">
              <Globe2 className="h-5 w-5" /> International sourcing
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Source globally. Ship together.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300">
              Browse products from our international partners and build one
              consolidated shipping request. No instant checkout, no fragmented
              freight costs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700 px-4 py-2">
                Minimum request: $10,000
              </span>
              <span className="rounded-full border border-slate-700 px-4 py-2">
                Consolidated shipping
              </span>
              <span className="rounded-full border border-slate-700 px-4 py-2">
                Vendor quotation first
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-700">
              Global catalog
            </p>
            <h2 className="mt-2 text-3xl font-bold">International products</h2>
          </div>
          <Link
            href="/orders/international"
            className="hidden items-center gap-2 text-sm font-medium text-emerald-700 md:flex"
          >
            My requests <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            Loading international products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            International products will appear here once an international vendor
            is approved.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <section
          className="mt-16 grid gap-8 lg:grid-cols-[1fr_380px]"
          id="request"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-700">
              Your sourcing list
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Build an international request
            </h2>
            <p className="mt-3 text-muted-foreground">
              Add products above, reach the $10,000 minimum, and tell us how you
              want the shipment consolidated.
            </p>
            <div className="mt-6 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  Your request list is empty.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.vendorName} · ${item.price.toLocaleString()} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="h-fit rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Product subtotal</span>
              <span className="text-2xl font-bold">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{
                  width: `${Math.min(100, (subtotal / MINIMUM_SUBTOTAL) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {subtotal < MINIMUM_SUBTOTAL
                ? `$${(MINIMUM_SUBTOTAL - subtotal).toLocaleString()} more needed`
                : "Minimum reached"}
            </p>
            {submitted ? (
              <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                Request submitted. Our sourcing team will review it and contact
                you with next steps.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Product or packaging notes"
                  className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                />
                <textarea
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  placeholder="Shipping and consolidation notes"
                  className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  onClick={submitRequest}
                  disabled={items.length === 0}
                  className="w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <Send className="h-4 w-4" /> Submit order request
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
