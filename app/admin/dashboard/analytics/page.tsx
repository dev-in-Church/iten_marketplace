"use client";

import { formatPrice } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, BarChart3 } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Sep", orders: 280, revenue: 3200000, customers: 95 },
  { month: "Oct", orders: 320, revenue: 3800000, customers: 112 },
  { month: "Nov", orders: 410, revenue: 4600000, customers: 135 },
  { month: "Dec", orders: 520, revenue: 6100000, customers: 180 },
  { month: "Jan", orders: 380, revenue: 4300000, customers: 148 },
  { month: "Feb", orders: 440, revenue: 5200000, customers: 162 },
  { month: "Mar", orders: 290, revenue: 3400000, customers: 108 },
];

const TOP_PRODUCTS = [
  { name: "Nike Air Zoom Pegasus 40", sales: 340, revenue: 4250000 },
  { name: "Asics Gel-Kayano 30", sales: 305, revenue: 5947500 },
  { name: "Reebok Nano X3 Training", sales: 267, revenue: 3738000 },
  { name: "Adidas Predator Edge", sales: 215, revenue: 3870000 },
  { name: "Nike Zoom Rival Sprint", sales: 180, revenue: 1710000 },
];

const TOP_VENDORS = [
  { name: "Nike Store KE", orders: 520, revenue: 8900000 },
  { name: "Adidas Official", orders: 310, revenue: 7200000 },
  { name: "FitGear KE", orders: 452, revenue: 5400000 },
  { name: "Run Kenya", orders: 195, revenue: 3800000 },
  { name: "Wilson Sports", orders: 89, revenue: 3115000 },
];

const KPIs = [
  { title: "Avg. Order Value", value: "KES 11,800", change: +5.2, icon: DollarSign },
  { title: "Conversion Rate", value: "3.2%", change: +0.4, icon: TrendingUp },
  { title: "Customer Retention", value: "68%", change: -2.1, icon: Users },
  { title: "Products Sold/Day", value: "47", change: +8.3, icon: Package },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-ig-green" />
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIs.map((kpi) => (
          <div key={kpi.title} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{kpi.title}</p>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground mb-1">{kpi.value}</p>
            <div className={`flex items-center gap-1 text-xs ${kpi.change > 0 ? "text-ig-green" : "text-ig-red"}`}>
              {kpi.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {kpi.change > 0 ? "+" : ""}{kpi.change}% vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart (simple bar) */}
      <div className="bg-white border border-border rounded-xl p-6 mb-8">
        <h2 className="font-bold text-foreground mb-1">Monthly Revenue</h2>
        <p className="text-xs text-muted-foreground mb-6">Revenue trends over the last 7 months</p>
        <div className="flex items-end gap-3 h-48">
          {MONTHLY_DATA.map((d) => {
            const height = (d.revenue / maxRevenue) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[10px] font-medium text-foreground">{formatPrice(d.revenue / 1000000)}M</p>
                <div className="w-full rounded-t-md bg-ig-green/80 hover:bg-ig-green transition-colors" style={{ height: `${height}%` }} />
                <p className="text-xs text-muted-foreground">{d.month}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top products & vendors */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-ig-green h-1.5 rounded-full" style={{ width: `${(p.sales / TOP_PRODUCTS[0].sales) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{p.sales} sold</p>
                  <p className="text-[10px] text-muted-foreground">{formatPrice(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="font-bold text-foreground mb-4">Top Vendors by Revenue</h2>
          <div className="space-y-3">
            {TOP_VENDORS.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{v.name}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-ig-red h-1.5 rounded-full" style={{ width: `${(v.revenue / TOP_VENDORS[0].revenue) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{formatPrice(v.revenue)}</p>
                  <p className="text-[10px] text-muted-foreground">{v.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white border border-border rounded-xl p-6 mt-6">
        <h2 className="font-bold text-foreground mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Month</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Orders</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">Revenue</th>
                <th className="text-right px-4 py-2 font-medium text-muted-foreground">New Customers</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map((d) => (
                <tr key={d.month} className="border-t border-border">
                  <td className="px-4 py-2 font-medium text-foreground">{d.month} 2026</td>
                  <td className="px-4 py-2 text-right text-foreground">{d.orders}</td>
                  <td className="px-4 py-2 text-right font-semibold text-foreground">{formatPrice(d.revenue)}</td>
                  <td className="px-4 py-2 text-right text-foreground">{d.customers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
