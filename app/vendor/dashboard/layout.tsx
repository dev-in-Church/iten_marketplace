"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  BadgeCheck,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vendor/dashboard/products", icon: Package, label: "Products" },
  { href: "/vendor/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/vendor/dashboard/subscription", icon: CreditCard, label: "Subscription" },
  { href: "/vendor/dashboard/verification", icon: BadgeCheck, label: "Verification" },
  { href: "/vendor/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
  const { user, vendor, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "vendor")) {
      router.push("/vendor");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-ig-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-ig-black text-white transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/vendor/dashboard">
              <Image src="/images/logo.png" alt="ItenGear" width={120} height={40} className="h-9 w-auto brightness-0 invert" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Store info */}
          <div className="p-4 border-b border-white/10">
            <p className="text-sm font-semibold truncate">{vendor?.store_name || "My Store"}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {vendor?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-ig-green">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              ) : (
                <span className="text-[10px] text-amber-400">Not Verified</span>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => { logout(); router.push("/vendor"); }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ig-green text-white flex items-center justify-center text-xs font-bold">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground hidden md:block">{user.firstName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
