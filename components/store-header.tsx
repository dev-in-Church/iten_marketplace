"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const CATEGORIES = [
  { name: "Tees", slug: "running" },
  { name: "Hats & Beanies", slug: "football" },
  { name: "Water Bottles", slug: "basketball" },
  { name: "Pants", slug: "tennis" },
  { name: "Smart Watches", slug: "swimming" },
  { name: "Gym & Fitness", slug: "gym-fitness" },
  { name: "Hiking", slug: "cycling" },
  { name: "Jackets", slug: "athletics" },
];

export function StoreHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelpMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed right-0 left-0 top-0 z-40">
      {/* Top bar */}
      <div className="bg-ig-green-light text-ig-green text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <p>Free delivery Within Iten (Home of Champions)</p>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="https://vendorcenter.sporttechies.com/"
              className="hover:text-ig-green transition-colors"
            >
              Sell on RunnerMKT
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 bg-amber-400">
          <div className="flex items-center justify-between">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="RunnerMKT - Sports Equipment Marketplace"
                width={140}
                height={48}
                className="w-32 md:w-40 h-auto"
                priority
              />
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-xl flex items-center bg-[#F1F1F2] rounded-full p-1 pl-4 border border-transparent focus-within:border-gray-300">
                <Search className="h-5 w-5 text-gray-700 flex-shrink-0" />

                <Input
                  type="search"
                  placeholder="Search products, brands and categories"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus-visible:ring-0 shadow-none focus-visible:ring-offset-0 placeholder:text-gray-500 text-gray-800 h-10 pl-2 pr-24"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />

                <Button
                  size="sm"
                  className="absolute right-1 top-1 bottom-1 rounded-full bg-ig-green hover:bg-ig-green/90 text-white font-bold px-6 shadow-none h-auto"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 md:gap-3 ml-auto">
              {/* 1. Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 text-foreground font-medium select-none hover:bg-[#EEEEEE] h-9 px-3 rounded-md transition-colors ${accountMenuOpen ? "bg-[#EEEEEE]" : ""}`}
                  onClick={() => {
                    setAccountMenuOpen(!accountMenuOpen);
                    setHelpMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5 stroke-[2]" />
                  <span className="hidden md:inline text-[15px]">
                    {user ? user.firstName : "Account"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 hidden md:block transition-transform duration-200 ${accountMenuOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-foreground z-50 shadow-xl border border-gray-100 rounded-md py-1 flex flex-col">
                    {user ? (
                      <>
                        <Link
                          href="/account"
                          className="gap-2 cursor-pointer w-full flex items-center px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="gap-2 cursor-pointer w-full flex items-center px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="gap-2 cursor-pointer w-full flex items-center px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="gap-2 cursor-pointer text-ig-red w-full flex items-center px-4 py-2.5 text-sm hover:bg-neutral-100 text-left transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="cursor-pointer font-medium w-full block px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/register"
                          className="cursor-pointer w-full block px-4 py-2.5 text-sm hover:bg-neutral-100 transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Help Dropdown */}
              <div className="relative" ref={helpRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 text-foreground font-medium select-none hover:bg-[#EEEEEE] h-9 px-3 rounded-md transition-colors ${helpMenuOpen ? "bg-[#EEEEEE]" : ""}`}
                  onClick={() => {
                    setHelpMenuOpen(!helpMenuOpen);
                    setAccountMenuOpen(false);
                  }}
                >
                  <HelpCircle className="h-5 w-5 stroke-[2]" />
                  <span className="hidden md:inline text-[15px]">Help</span>
                  <ChevronDown
                    className={`h-4 w-4 hidden md:block transition-transform duration-200 ${helpMenuOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {helpMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 z-50 shadow-2xl border border-gray-100 rounded-md py-2 flex flex-col">
                    <Link
                      href="/help"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/help/place-order"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Place your Order
                    </Link>
                    <Link
                      href="/help/payment-options"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Payment Options
                    </Link>
                    <Link
                      href="/help/track-order"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Delivery Timelines & Track your Order
                    </Link>
                    <Link
                      href="/help/returns"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Returns & Refunds
                    </Link>
                    <Link
                      href="/help/warranty"
                      className="w-full px-4 py-2 text-[14px] hover:bg-neutral-50 transition-colors mb-2"
                      onClick={() => setHelpMenuOpen(false)}
                    >
                      Warranty
                    </Link>

                    <hr className="mx-4 my-1 border-gray-100" />

                    <div className="p-3 pt-2 space-y-2">
                      <Link
                        href="/chat"
                        className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-bold h-10 rounded flex items-center justify-center gap-2 text-sm transition-colors shadow-sm"
                        onClick={() => setHelpMenuOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4 fill-white" />
                        Live Chat
                      </Link>
                      <Link
                        href="https://wa.me/yournumber"
                        target="_blank"
                        className="w-full bg-white hover:bg-neutral-50 text-[#25D366] font-bold h-10 rounded border border-[#25D366] flex items-center justify-center gap-2 text-sm transition-colors"
                        onClick={() => setHelpMenuOpen(false)}
                      >
                        <svg
                          className="h-5 w-5 fill-[#25D366]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.966 0c3.179.001 6.169 1.24 8.413 3.488 2.245 2.248 3.481 5.239 3.481 8.42 0 6.607-5.337 11.954-11.966 11.954-2.001-.001-3.973-.5-5.74-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.892-1.84-1.842-4.29-2.856-6.891-2.858-5.44 0-9.863 4.37-9.867 9.743-.001 1.73.475 3.42 1.378 4.917l-.983 3.591 3.724-.969z" />
                        </svg>
                        WhatsApp
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative gap-1.5 text-foreground font-medium hover:bg-[#EEEEEE] h-9 px-3 rounded-md transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 stroke-[2]" />
                  <span className="hidden md:inline text-[15px]">Cart</span>
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-ig-green text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-3 px-1">
            <div className="relative w-full flex items-center bg-[#F1F1F2] rounded-full p-1 border border-neutral-200/60 focus-within:ring-1 focus-within:ring-ig-green/90 focus-within:border-ig-green transition-all">
              {/* Search Icon on the Left */}
              <Search className="absolute left-4 h-4 w-4 text-neutral-400 pointer-events-none" />

              {/* Capsule Input Field */}
              <Input
                type="search"
                placeholder="Search products, brands and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 bg-transparent border-none shadow-none h-8 text-xs text-foreground placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />

              {/* pill Button on the Right */}
              <Button
                size="sm"
                onClick={() => {
                  if (searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="absolute right-1 top-1 bottom-1 rounded-full bg-ig-green hover:bg-ig-green/90 text-white font-bold text-xs px-4 shadow-sm transition-colors"
              >
                Search
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
                    className="block px-3 py-1.5 text-sm font-medium rounded-sm bg-ig-green-light text-ig-green hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Slide-out Mobile Sidebar Drawer Container */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Dark Backdrop Tint */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-out White Drawer panel */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Top Header Row */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <span className="font-bold text-gray-900 text-lg">Menu</span>
            <button
              className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Drawer Scrollable Content Layout */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Categories
            </p>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-ig-green-light transition-colors text-foreground font-medium"
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
      </div>
    </header>
  );
}
