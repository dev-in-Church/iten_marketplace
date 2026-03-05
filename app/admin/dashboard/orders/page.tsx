"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  items_count: number;
  created_at: string;
}

const MOCK_ORDERS: Order[] = [
  { id: "1", order_number: "ORD-3560", customer_name: "John Kamau", total_amount: 12500, status: "processing", payment_status: "paid", items_count: 2, created_at: "2026-03-04" },
  { id: "2", order_number: "ORD-3559", customer_name: "Mary Njeri", total_amount: 28000, status: "delivered", payment_status: "paid", items_count: 1, created_at: "2026-03-03" },
  { id: "3", order_number: "ORD-3558", customer_name: "Peter Ochieng", total_amount: 9500, status: "shipped", payment_status: "paid", items_count: 3, created_at: "2026-03-02" },
  { id: "4", order_number: "ORD-3557", customer_name: "Susan Wambui", total_amount: 35000, status: "processing", payment_status: "pending", items_count: 1, created_at: "2026-03-01" },
  { id: "5", order_number: "ORD-3556", customer_name: "James Mwangi", total_amount: 16000, status: "cancelled", payment_status: "refunded", items_count: 2, created_at: "2026-02-28" },
];

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  processing: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  shipped: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  delivered: { icon: CheckCircle2, color: "text-ig-green", bg: "bg-ig-green-light" },
  cancelled: { icon: XCircle, color: "text-ig-red", bg: "bg-ig-red-light" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.get<{ orders: Order[] }>(`/api/admin/orders?page=${page}&search=${search}&status=${statusFilter}`);
        if (data.orders?.length) setOrders(data.orders);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [page, search, statusFilter]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch {
      // failed
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = `${o.order_number} ${o.customer_name}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Customer</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Payment</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3" colSpan={6}><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                filtered.map((o) => {
                  const sc = STATUS_CONFIG[o.status] || STATUS_CONFIG.processing;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">#{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-KE")} | {o.items_count} item(s)</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-foreground">{o.customer_name}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{formatPrice(o.total_amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          o.payment_status === "paid" ? "bg-ig-green-light text-ig-green" :
                          o.payment_status === "refunded" ? "bg-blue-50 text-blue-600" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {o.status !== "delivered" && o.status !== "cancelled" && (
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="h-7 rounded border border-input bg-background px-2 text-xs text-foreground"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{filtered.length} order(s)</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm text-foreground">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
