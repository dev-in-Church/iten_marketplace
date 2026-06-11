"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

// Content dictionary matching your dropdown slugs exactly
const HELP_CONTENT: Record<
  string,
  { title: string; icon: any; sections: { q: string; a: string }[] }
> = {
  help: {
    title: "Help Center",
    icon: HelpCircle,
    sections: [
      {
        q: "What is RunnerMKT?",
        a: "RunnerMKT is Kenya's premier sports equipment marketplace connecting athletes with top-tier gear, vendors, and fitness tech.",
      },
      {
        q: "How do I contact customer care?",
        a: "You can reach us instantly via our Live Chat button in the header menu or drop us an email at support@runnermkt.com.",
      },
    ],
  },
  "place-order": {
    title: "Place Your Order",
    icon: ShoppingBag,
    sections: [
      {
        q: "How do I place an order?",
        a: "1. Browse or search for your product.\n2. Click 'Add to Cart'.\n3. Click on your Cart and proceed to Checkout.\n4. Enter your delivery address and choose your payment method.\n5. Click 'Confirm Order'.",
      },
      {
        q: "Can I change my delivery address after ordering?",
        a: "If your order has not been dispatched yet, you can quickly update your delivery details by contacting our live chat support agent immediately.",
      },
    ],
  },
  "payment-options": {
    title: "Payment Options",
    icon: CreditCard,
    sections: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Lipa na M-PESA (Paybill), major Credit/Debit Cards (Visa/Mastercard), and Cash on Delivery for select regions within Nairobi.",
      },
      {
        q: "Is it safe to use my card on RunnerMKT?",
        a: "Absolutely. All transactions are encrypted via secure SSL gateways, and we never store your raw banking or card credential details.",
      },
    ],
  },
  "track-order": {
    title: "Delivery Timelines & Tracking",
    icon: Truck,
    sections: [
      {
        q: "When will my order arrive?",
        a: "Nairobi deliveries take 1-2 business days. Orders outside Nairobi across Kenya arrive within 2-4 business days.",
      },
      {
        q: "How do I track my order status?",
        a: "Go to Account > Orders in your profile to view live fulfillment logs, or use the automated tracking code texted to your phone.",
      },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    icon: RotateCcw,
    sections: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy for unused, unopened sports gear in its original packaging with tags intact.",
      },
      {
        q: "How long do refunds take?",
        a: "M-PESA refunds are processed within 24 hours of return approval. Card reversals may take 3-5 business days depending on your bank network.",
      },
    ],
  },
  warranty: {
    title: "Warranty Guide",
    icon: ShieldCheck,
    sections: [
      {
        q: "Do items have a warranty?",
        a: "Electronic fitness goods like Smart Watches and gym machinery carry a 6-month to 1-year official manufacturer warranty.",
      },
      {
        q: "How do I claim a warranty?",
        a: "Keep your receipt and contact our help desk. We will arrange a pickup to assess the item or forward it to authorized repair hubs.",
      },
    ],
  },
};

interface PageProps {
  params: { slug: string }; // Changed from Promise to direct object
}

export default function HelpDetailPage({ params }: PageProps) {
  const slug = params.slug; // Access directly without use()
  const content = HELP_CONTENT[slug];
  const [openSection, setOpenSection] = useState<number | null>(0);

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <Link href="/help" className="text-ig-green hover:underline">
          Return to Help Center
        </Link>
      </div>
    );
  }

  const Icon = content.icon;

  return (
    <main className="min-h-screen bg-neutral-50 pt-36 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-ig-green">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/help" className="hover:text-ig-green">
            Help Center
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-medium">{content.title}</span>
        </div>

        {/* Content Card Layout */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
            <div className="p-2 bg-ig-green-light rounded-md text-ig-green">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{content.title}</h1>
          </div>

          {/* Accordion FAQ Component */}
          <div className="divide-y divide-neutral-100">
            {content.sections.map((sec, idx) => (
              <div key={idx} className="p-4 md:p-6">
                <button
                  className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-ig-green transition-colors text-base"
                  onClick={() =>
                    setOpenSection(openSection === idx ? null : idx)
                  }
                >
                  <span>{sec.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openSection === idx ? "rotate-90" : ""}`}
                  />
                </button>
                {openSection === idx && (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-neutral-50 p-4 rounded-md border border-neutral-100">
                    {sec.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Action Call to Action Footer */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-neutral-200 text-center shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">
            Still need assistance?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Our support agents are active right now to get you sorted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <Link
              href="/chat"
              className="bg-ig-green hover:bg-ig-green/90 text-white font-bold h-10 px-6 rounded-md flex items-center justify-center gap-2 text-sm shadow-sm transition-colors"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              Start Live Chat
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
