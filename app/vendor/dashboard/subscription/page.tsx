"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Phone, BadgeCheck, Clock, AlertCircle, Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string;
  amount: number;
  currency: string;
}

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: 2000,
    period: "month",
    features: ["Verified badge on store", "Priority listing in search", "Analytics dashboard", "Customer support"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 20000,
    period: "year",
    features: ["All Monthly features", "Save KES 4,000 vs monthly", "Featured store placement", "Dedicated account manager"],
    popular: true,
  },
];

export default function VendorSubscriptionPage() {
  const { vendor, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "pay" | "processing" | "success">("select");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSub() {
      try {
        const data = await api.get<{ subscription: Subscription | null }>("/api/vendor/subscription");
        setSubscription(data.subscription);
      } catch {
        // no sub
      } finally {
        setLoading(false);
      }
    }
    fetchSub();
  }, []);

  const handlePay = async () => {
    setError("");
    if (!mpesaPhone || mpesaPhone.length < 10) {
      setError("Enter a valid M-Pesa phone number");
      return;
    }
    setPaying(true);
    setPaymentStep("processing");
    try {
      await api.post("/api/mpesa/vendor-subscription", {
        planType: selectedPlan,
        phone: mpesaPhone,
      });
      // Simulate M-Pesa confirmation
      setTimeout(async () => {
        setPaymentStep("success");
        setPaying(false);
        await refreshUser();
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaymentStep("pay");
      setPaying(false);
    }
  };

  const isActive = subscription && subscription.status === "active" && new Date(subscription.end_date) > new Date();

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading subscription info...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Subscription</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Subscribe to verify your store and unlock premium features.
      </p>

      {/* Current subscription */}
      {isActive && subscription && (
        <div className="bg-ig-green-light border border-ig-green/20 rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="h-5 w-5 text-ig-green" />
            <p className="font-semibold text-ig-green">Active Subscription</p>
          </div>
          <p className="text-sm text-foreground">
            Plan: <strong>{subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Expires: {new Date(subscription.end_date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      )}

      {!isActive && subscription && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Subscription Expired</p>
            <p className="text-xs text-amber-700">Renew your subscription to maintain your verified status.</p>
          </div>
        </div>
      )}

      {paymentStep === "processing" && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-ig-green mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-bold text-foreground mb-2">Processing Payment</h2>
          <p className="text-sm text-muted-foreground">Check your phone for the M-Pesa prompt and enter your PIN.</p>
        </div>
      )}

      {paymentStep === "success" && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-ig-green-light mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-ig-green" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Subscription Activated!</h2>
          <p className="text-sm text-muted-foreground mb-4">Your store is now verified. Enjoy premium features.</p>
          <Button onClick={() => setPaymentStep("select")} className="bg-ig-green hover:bg-ig-green/90 text-white">
            Done
          </Button>
        </div>
      )}

      {paymentStep === "select" && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedPlan === plan.id ? "border-ig-green shadow-md" : "border-border"
              } ${plan.popular ? "ring-1 ring-ig-green" : ""}`}
              onClick={() => { setSelectedPlan(plan.id); setPaymentStep("pay"); }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ig-green text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-ig-black">{formatPrice(plan.price)}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-ig-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${selectedPlan === plan.id ? "bg-ig-green hover:bg-ig-green/90 text-white" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                <CreditCard className="h-4 w-4 mr-2" />
                Select Plan
              </Button>
            </div>
          ))}
        </div>
      )}

      {paymentStep === "pay" && (
        <div className="max-w-md mx-auto bg-white border border-border rounded-lg p-6">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-ig-green" />
            Pay with M-Pesa
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            You are subscribing to the {selectedPlan === "monthly" ? "Monthly" : "Yearly"} plan for{" "}
            <strong>{formatPrice(selectedPlan === "monthly" ? 2000 : 20000)}</strong>.
          </p>
          {error && <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>}
          <div className="bg-ig-green-light rounded-lg p-3 mb-4 flex items-center gap-3">
            <div className="bg-ig-green text-white font-bold text-sm px-3 py-1 rounded">M-PESA</div>
            <p className="text-sm text-foreground">Safaricom M-Pesa</p>
          </div>
          <div className="mb-4">
            <Label className="text-foreground">M-Pesa Phone Number</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="tel" placeholder="0700000000" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => { setPaymentStep("select"); setSelectedPlan(null); }} className="text-foreground">Back</Button>
            <Button onClick={handlePay} disabled={paying} className="flex-1 bg-ig-green hover:bg-ig-green/90 text-white font-semibold">
              {paying ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
