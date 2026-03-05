"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/store-footer";
import { CookieConsent } from "@/components/cookie-consent";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <StoreHeader />
          <main className="flex-1">{children}</main>
          <StoreFooter />
          <CookieConsent />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
