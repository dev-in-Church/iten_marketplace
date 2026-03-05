"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

interface VendorOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  customer_name: string;
  created_at: string;
  item_count: number;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  confirmed: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  shipped: { icon: Truck, color: "text-ig-green", bg: "bg-ig-green-light" },
  delivered: { icon: CheckCircle, color: "text-ig-green", bg: "bg-ig-green-light" },
  cancelled: { icon: XCircle, color: "text-ig-red", bg: "bg-ig-red-light" },
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.get<{ orders: VendorOrder[] }>("/api/vendor/orders");
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/api/vendor/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } catch {
      // silent
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Orders</h1>

      {loading ? (
        <div className="bg-white border border-border rounded-lg p-8 text-center text-muted-foreground">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">No orders yet</p>
          <p className="text-sm text-muted-foreground">Orders will appear here once customers buy your products.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="bg-white border border-border rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Order #{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by {order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-KE")}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{order.item_count} items</p>
                  <p className="text-sm font-bold text-foreground">{formatPrice(order.total_amount, order.currency)}</p>
                </div>
                {(order.status === "pending" || order.status === "confirmed") && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {order.status === "pending" && (
                      <Button size="sm" onClick={() => updateStatus(order.id, "confirmed")} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        Confirm
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateStatus(order.id, "shipped")} className="bg-ig-green hover:bg-ig-green/90 text-white text-xs">
                        Mark Shipped
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, "cancelled")} className="text-ig-red border-ig-red hover:bg-ig-red-light text-xs">
                      Cancel
                    </Button>
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
