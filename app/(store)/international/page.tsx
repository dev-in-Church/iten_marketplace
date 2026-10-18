"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  Minus,
  Plus,
  Send,
  Trash2,
  X,
  ClipboardList,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useInternationalRequest } from "@/lib/international-request-context";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import type { Product } from "@/lib/mock-data";

const SHIPPING_THRESHOLD = 10000;

export default function InternationalMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactCountry, setContactCountry] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [cooperationDetails, setCooperationDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingNotes, setShippingNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { items, subtotal, count, updateQuantity, removeItem, clear } =
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
    if (!user)
      return setError(
        "Please sign in before submitting an international order request.",
      );
    if (!items.length)
      return setError("Add at least one product to your request.");
    if (
      ![
        contactName,
        contactCountry,
        contactPhone,
        contactEmail,
        deliveryAddress,
        cooperationDetails,
      ].every((value) => value.trim())
    ) {
      return setError(
        "Please complete all required contact, address, and cooperation fields.",
      );
    }
    try {
      await api.post("/api/international-requests", {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        contactName,
        contactCountry,
        contactPhone,
        contactEmail,
        deliveryAddress,
        cooperationDetails,
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
    <div className="min-h-screen bg-background">
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
              Browse international products and submit any request size.
              RunnerMKT combines pending requests so admin can authorize
              consolidated shipping when the shared pool reaches $10,000.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700 px-4 py-2">
                Shared shipping threshold: $10,000
              </span>
              <span className="rounded-full border border-slate-700 px-4 py-2">
                No minimum per client
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
              <ProductCard
                key={product.id}
                product={{ ...product, currency: "USD" }}
              />
            ))}
          </div>
        )}
      </main>

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-slate-700"
        aria-label="Open sourcing request list"
      >
        <ClipboardList className="h-5 w-5" /> Request list{" "}
        {count > 0 && (
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs">
            {count}
          </span>
        )}
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/55"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="International sourcing request list"
            onClick={(event) => event.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-xl flex-col bg-background shadow-2xl"
          >
            <header className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  International sourcing
                </p>
                <h2 className="mt-1 text-2xl font-bold">Request list</h2>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close request list"
              >
                <X className="h-5 w-5" />
              </Button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p>Your request list is empty.</p>
                  <p className="mt-1 text-sm">
                    Add international products from the catalog.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 border-b pb-4"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.vendorName}
                        </p>
                        <p className="mt-1 font-medium">
                          USD {item.price.toLocaleString()}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 border-t pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Product subtotal
                  </span>
                  <span className="text-2xl font-bold">
                    USD {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  No minimum per client. Admin monitors the combined pending
                  pool; shipping authorization starts at USD{" "}
                  {SHIPPING_THRESHOLD.toLocaleString()}.
                </p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              {!submitted && (
                <div className="mt-6 space-y-3">
                  <input
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Name *"
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                  />
                  <input
                    required
                    value={contactCountry}
                    onChange={(e) => setContactCountry(e.target.value)}
                    placeholder="Country *"
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                  />
                  <input
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone *"
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                  />
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email *"
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                  />
                  <textarea
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Delivery address *"
                    className="min-h-20 w-full rounded-md border bg-background p-3 text-sm"
                  />
                  <textarea
                    required
                    value={cooperationDetails}
                    onChange={(e) => setCooperationDetails(e.target.value)}
                    placeholder="Cooperation details *"
                    className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                  />
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
                    disabled={!items.length}
                    className="w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    <Send className="h-4 w-4" /> Submit order request
                  </Button>
                </div>
              )}
              {submitted && (
                <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                  Request submitted. Admin will monitor the combined
                  international pool and contact you about shipping
                  authorization.
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
