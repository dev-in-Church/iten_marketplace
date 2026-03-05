"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function VendorDashboardPage() {
  const { user, vendor } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get<{ stats: DashboardStats }>("/api/vendor/stats");
        setStats(data.stats);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-ig-green-light", iconColor: "text-ig-green" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "bg-ig-green-light", iconColor: "text-ig-green" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: TrendingUp, color: "bg-amber-50", iconColor: "text-amber-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      {!vendor?.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Store Not Verified</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your store is not yet verified. Subscribe to a plan or request admin verification to unlock all features and build trust with buyers.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{loading ? "-" : card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href="/vendor/dashboard/products" className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center">
            <Package className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Manage Products</p>
          </a>
          <a href="/vendor/dashboard/orders" className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center">
            <ShoppingCart className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">View Orders</p>
          </a>
          <a href="/vendor/dashboard/subscription" className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center">
            <DollarSign className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Subscription</p>
          </a>
        </div>
      </div>
    </div>
  );
}
