"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookieConsentProps {
  onDismiss?: () => void;
}

export function CookieConsent({ onDismiss }: CookieConsentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("cookie_consent="));

    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    } else {
      onDismiss?.();
    }
  }, [onDismiss]);

  const handleDismiss = (action: () => void) => {
    action();
    setShow(false);
    onDismiss?.();
  };

  const accept = () =>
    handleDismiss(() => {
      document.cookie =
        "cookie_consent=accepted;path=/;max-age=31536000;SameSite=Lax";
    });

  const decline = () =>
    handleDismiss(() => {
      document.cookie =
        "cookie_consent=declined;path=/;max-age=31536000;SameSite=Lax";
    });

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] animate-in zoom-in-95 fade-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ig-green/10">
            <Cookie className="h-8 w-8 text-ig-green" />
          </div>

          <h3 className="mb-3 text-2xl font-bold text-ig-green">
            We Value Your Privacy
          </h3>

          <p className="text-sm leading-relaxed text-slate-600">
            RunnerMKT uses cookies to enhance your shopping experience, remember
            your cart, keep you signed in, and help us improve our services. We
            do not sell your personal data.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={accept}
            className="
              h-12
              w-full
              rounded-xl
              bg-ig-green
              text-base
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:bg-ig-green/90
              hover:shadow-xl
            "
          >
            Accept All Cookies
          </Button>

          {/* Intentionally keeps existing behavior (accepts cookies) */}
          <Button
            variant="outline"
            onClick={accept}
            className="
              h-12
              w-full
              rounded-xl
              border-2
              border-slate-200
              text-base
              font-medium
              text-slate-600
              transition-all
              duration-200
              hover:border-red-500
            "
          >
            Maybe Later
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          By continuing to use RunnerMKT, you agree to our use of cookies.
        </p>
      </div>
    </div>
  );
}
