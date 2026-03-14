"use client";

import { useState, useEffect } from "react";
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
      // Already consented before — unblock the sell popup immediately
      onDismiss?.();
    }
  }, []);

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ig-black text-white p-4 md:p-6 shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">We value your privacy</h3>
          <p className="text-sm text-white/70">
            RunnerMKT uses cookies to enhance your shopping experience, remember
            your cart, and keep you logged in. We do not sell your personal
            data.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={decline}
            className="bg-white text-ig-red hover:bg-white/10 hover:text-white"
          >
            Decline
          </Button>
          <Button
            onClick={accept}
            className="bg-ig-green hover:bg-ig-green/90 text-white"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
