"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  monthlyGrowth: number;
  activeSubscriptions: number;
}

const FALLBACK_STATS: DashboardStats = {
  totalCustomers: 1245,
  totalVendors: 48,
  totalProducts: 620,
  totalOrders: 3560,
  totalRevenue: 4850000,
  pendingVerifications: 5,
  monthlyGrowth: 12.5,
  activeSubscriptions: 32,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get<{ stats: DashboardStats }>("/api/admin/stats");
        setStats(data.stats);
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Customers", value: stats.totalCustomers.toLocaleString(), icon: Users, color: "bg-blue-500", lightBg: "bg-blue-50" },
    { title: "Total Vendors", value: stats.totalVendors.toLocaleString(), icon: Store, color: "bg-ig-green", lightBg: "bg-ig-green-light" },
    { title: "Total Products", value: stats.totalProducts.toLocaleString(), icon: Package, color: "bg-amber-500", lightBg: "bg-amber-50" },
    { title: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, color: "bg-ig-red", lightBg: "bg-ig-red-light" },
    { title: "Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "bg-ig-green", lightBg: "bg-ig-green-light" },
    { title: "Monthly Growth", value: `+${stats.monthlyGrowth}%`, icon: TrendingUp, color: "bg-emerald-500", lightBg: "bg-emerald-50" },
    { title: "Pending Verifications", value: stats.pendingVerifications.toString(), icon: AlertCircle, color: "bg-amber-500", lightBg: "bg-amber-50" },
    { title: "Active Subscriptions", value: stats.activeSubscriptions.toString(), icon: BadgeCheck, color: "bg-ig-green", lightBg: "bg-ig-green-light" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-border animate-pulse">
              <div className="h-4 w-24 bg-muted rounded mb-3" />
              <div className="h-7 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-5 border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className={`w-9 h-9 rounded-lg ${card.lightBg} flex items-center justify-center`}>
                  <card.icon className={`h-4 w-4 ${card.color === "bg-ig-green" ? "text-ig-green" : card.color === "bg-ig-red" ? "text-ig-red" : card.color === "bg-amber-500" ? "text-amber-500" : card.color === "bg-blue-500" ? "text-blue-500" : "text-emerald-500"}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[
              { id: "#ORD-3560", customer: "John Kamau", amount: 12500, status: "Processing" },
              { id: "#ORD-3559", customer: "Mary Njeri", amount: 28000, status: "Delivered" },
              { id: "#ORD-3558", customer: "Peter Ochieng", amount: 9500, status: "Shipped" },
              { id: "#ORD-3557", customer: "Susan Wambui", amount: 35000, status: "Processing" },
              { id: "#ORD-3556", customer: "James Mwangi", amount: 16000, status: "Delivered" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatPrice(order.amount)}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    order.status === "Delivered" ? "bg-ig-green-light text-ig-green" :
                    order.status === "Shipped" ? "bg-blue-50 text-blue-600" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground mb-4">Pending Vendor Verifications</h2>
          <div className="space-y-3">
            {[
              { store: "Sprint Shoes KE", date: "Mar 1, 2026", docs: true },
              { store: "Ball Masters", date: "Feb 28, 2026", docs: true },
              { store: "GymTech Kenya", date: "Feb 27, 2026", docs: false },
              { store: "Cycle Pro", date: "Feb 25, 2026", docs: true },
              { store: "SwimGear Africa", date: "Feb 24, 2026", docs: false },
            ].map((v) => (
              <div key={v.store} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{v.store}</p>
                  <p className="text-xs text-muted-foreground">Applied {v.date}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  v.docs ? "bg-ig-green-light text-ig-green" : "bg-amber-50 text-amber-600"
                }`}>
                  {v.docs ? "Docs Complete" : "Docs Missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
