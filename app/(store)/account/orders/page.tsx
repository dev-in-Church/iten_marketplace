"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Phone,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items?: { id: string }[];
}

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Pending",
  },
  pending_payment: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Awaiting Payment",
  },
  payment_failed: {
    icon: AlertCircle,
    color: "text-ig-red",
    bg: "bg-ig-red-light",
    label: "Payment Failed",
  },
  confirmed: {
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Confirmed",
  },
  processing: {
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Processing",
  },
  shipped: {
    icon: Truck,
    color: "text-ig-green",
    bg: "bg-ig-green-light",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "text-ig-green",
    bg: "bg-ig-green-light",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "text-ig-red",
    bg: "bg-ig-red-light",
    label: "Cancelled",
  },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingOrder, setRetryingOrder] = useState<string | null>(null);
  const [retryPhone, setRetryPhone] = useState("");
  const [retryError, setRetryError] = useState("");

  useEffect(() => {
    if (!authLoading && !user)
      router.push("/auth/login?redirect=/account/orders");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      try {
        const data = await api.get<{ orders: Order[] }>("/api/orders");
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleRetryPayment = async (orderId: string) => {
    if (!retryPhone || retryPhone.length < 10) {
      setRetryError("Please enter a valid M-Pesa phone number");
      return;
    }

    setRetryError("");
    setRetryingOrder(orderId);

    try {
      await api.post("/api/mpesa/retry-payment", {
        orderId,
        phone: retryPhone,
      });

      // Redirect to a processing page or show success
      router.push(`/checkout?retry=${orderId}`);
    } catch (err: unknown) {
      setRetryError(
        err instanceof Error ? err.message : "Failed to retry payment",
      );
      setRetryingOrder(null);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-ig-green hover:underline mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Account
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground mb-4">
            When you place your first order, it will appear here.
          </p>
          <Link href="/products">
            <button className="bg-ig-green hover:bg-ig-green/90 text-white px-6 py-2 rounded-lg font-medium">
              Shop Now
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const canRetryPayment =
              order.status === "payment_failed" &&
              order.payment_method === "mpesa";
            const itemCount = order.items?.length || 0;

            return (
              <div
                key={order.id}
                className="bg-white border border-border rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Order #{order.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(order.total)}
                  </p>
                </div>

                {/* Payment Failed - Retry Option */}
                {canRetryPayment && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="bg-ig-red-light rounded-lg p-4 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-ig-red shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-ig-red">
                            Payment Failed
                          </p>
                          <p className="text-xs text-foreground mt-0.5">
                            Your M-Pesa payment was not completed. You can retry
                            the payment below.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="M-Pesa Phone (0700000000)"
                          value={retryPhone}
                          onChange={(e) => setRetryPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        onClick={() => handleRetryPayment(order.id)}
                        disabled={retryingOrder === order.id}
                        className="bg-ig-green hover:bg-ig-green/90 text-white gap-2"
                      >
                        {retryingOrder === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Retry Payment
                      </Button>
                    </div>

                    {retryError && (
                      <p className="text-xs text-ig-red mt-2">{retryError}</p>
                    )}
                  </div>
                )}

                {/* Pending Payment Info */}
                {order.status === "pending_payment" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="bg-amber-50 rounded-lg p-4 flex items-start gap-2">
                      <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Awaiting Payment
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Check your phone for the M-Pesa prompt and enter your
                          PIN to complete payment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
