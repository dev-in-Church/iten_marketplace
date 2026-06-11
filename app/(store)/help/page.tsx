"use client";

import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const HELPDESK_CARDS = [
  {
    title: "Place your Order",
    desc: "Learn step-by-step how to check out your sports gear.",
    href: "/help/place-order",
    icon: ShoppingBag,
  },
  {
    title: "Payment Options",
    desc: "Details on M-PESA, cards, and secure checkout gateways.",
    href: "/help/payment-options",
    icon: CreditCard,
  },
  {
    title: "Delivery & Tracking",
    desc: "Timelines for Nairobi, upcountry packages, and updates.",
    href: "/help/track-order",
    icon: Truck,
  },
  {
    title: "Returns & Refunds",
    desc: "Easy instructions on our 7-day return policy conditions.",
    href: "/help/returns",
    icon: RotateCcw,
  },
  {
    title: "Warranty Guide",
    desc: "Coverage details for fitness technology and machinery.",
    href: "/help/warranty",
    icon: ShieldCheck,
  },
  {
    title: "General FAQ",
    desc: "Frequently asked profile and operational questions.",
    href: "/help/help",
    icon: HelpCircle,
  },
];

export default function HelpCenterDashboard() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-36 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-neutral-500 mt-2 text-sm md:text-base">
            Find answers fast regarding deliveries, payments, and product
            warranties.
          </p>
        </div>

        {/* Dashboard Grid Map */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HELPDESK_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 bg-ig-green-light text-ig-green rounded-md w-fit mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-ig-green transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-ig-green mt-4 gap-1">
                  Read Articles
                  <ChevronRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
