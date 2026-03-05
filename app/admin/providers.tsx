"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { CookieConsent } from "@/components/cookie-consent";

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <CookieConsent />
    </AuthProvider>
  );
}
