"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  CreditCard,
  BadgeCheck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/users", icon: Users, label: "Customers" },
  { href: "/admin/dashboard/vendors", icon: Store, label: "Vendors" },
  { href: "/admin/dashboard/products", icon: Package, label: "Products" },
  { href: "/admin/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/dashboard/verification", icon: BadgeCheck, label: "Verification" },
  { href: "/admin/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ig-black">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-ig-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ig-black text-white transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and admin badge */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="ItenGear" width={100} height={32} className="h-7 w-auto brightness-0 invert" />
              <span className="bg-ig-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ADMIN</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-white bg-ig-red/20 border-r-2 border-ig-red"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => {
                logout();
                router.push("/admin");
              }}
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
        <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-ig-red" />
            <span className="text-sm font-semibold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ig-red text-white flex items-center justify-center text-xs font-bold">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground hidden md:block">{user.firstName}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
