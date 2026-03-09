"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
  item_count: number;
}

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  confirmed: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  shipped: { icon: Truck, color: "text-ig-green", bg: "bg-ig-green-light" },
  delivered: {
    icon: CheckCircle,
    color: "text-ig-green",
    bg: "bg-ig-green-light",
  },
  cancelled: { icon: XCircle, color: "text-ig-red", bg: "bg-ig-red-light" },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
            return (
              <div
                key={order.id}
                className="bg-white border border-border rounded-lg p-5 hover:shadow-sm transition-shadow"
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
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(Number(order.total), order.currency)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
