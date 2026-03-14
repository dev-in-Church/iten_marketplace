"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, Store } from "lucide-react";

interface SellOnRunnerMKTProps {
  canShow?: boolean;
}

export function SellOnRunnerMKT({ canShow = false }: SellOnRunnerMKTProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!canShow) return;
    if (sessionStorage.getItem("sell-popup-dismissed")) return;
    const timer = setTimeout(() => setVisible(true), 1000); // short delay after cookie clears
    return () => clearTimeout(timer);
  }, [canShow]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("sell-popup-dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-8 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-border shadow-2xl rounded-xl px-4 py-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-2 sm:right-6 md:right-12 p-1.5 rounded-full hover:bg-secondary transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4 pr-6">
          <div className="p-2.5 sm:p-3 rounded-full bg-ig-green-light shrink-0">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 text-ig-green" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-foreground">
              Sell on RunnerMKT
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Do you own a sports shop in{" "}
              <span className="text-ig-green font-medium">Iten, Eldoret</span>{" "}
              or anywhere in Kenya?
            </p>
          </div>
          <Link
            href="https://vendorcenter.sporttechies.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="shrink-0 flex items-center gap-1.5 bg-ig-green text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-ig-green/90 transition-colors whitespace-nowrap"
          >
            Start Selling
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
