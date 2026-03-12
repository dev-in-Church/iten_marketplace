"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Heart,
} from "lucide-react";

const CATEGORIES = [
  { name: "Running", slug: "running" },
  { name: "Football", slug: "football" },
  { name: "Basketball", slug: "basketball" },
  { name: "Tennis", slug: "tennis" },
  { name: "Swimming", slug: "swimming" },
  { name: "Gym & Fitness", slug: "gym-fitness" },
  { name: "Cycling", slug: "cycling" },
  { name: "Athletics", slug: "athletics" },
];

export function StoreHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-ig-black text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <p>Free delivery on orders above KES 5,000</p>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://vendorcenter.sporttechies.com/"
              className="hover:text-ig-green transition-colors"
            >
              Sell on RunnerMKT
            </Link>
            <Link
              href="/help"
              className="hover:text-ig-green transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 border-b border-ig-green-light">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="RunnerMKT - Sports Equipment Marketplace"
                width={140}
                height={48}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search for sports gear, shoes, equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 bg-secondary border-border focus:border-ig-green focus:ring-ig-green"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="absolute right-0 top-0 h-full rounded-l-none bg-ig-green hover:bg-ig-green/90 text-white"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-foreground"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline text-sm">
                      {user ? user.firstName : "Account"}
                    </span>
                    <ChevronDown className="h-3 w-3 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white text-foreground"
                >
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/orders"
                          className="gap-2 cursor-pointer"
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/wishlist"
                          className="gap-2 cursor-pointer"
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="gap-2 cursor-pointer text-ig-red"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/login"
                          className="cursor-pointer font-medium"
                        >
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/register" className="cursor-pointer">
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 relative text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden md:inline text-sm">Cart</span>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-ig-red text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 bg-secondary border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full rounded-l-none bg-ig-green hover:bg-ig-green/90 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:block text-ig-green py-1">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-3 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-sm font-medium rounded-md bg-ig-green-light text-ig-green hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Categories
            </p>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-ig-green-light transition-colors text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-border mt-4 pt-4 space-y-1">
              <Link
                href="https://vendorcenter.sporttechies.com/"
                className="block px-3 py-2 rounded-md text-sm font-medium text-ig-green hover:bg-ig-green-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell on RunnerMKT
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
