"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/mock-data";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingBag, Phone, MapPin, Check, Loader2 } from "lucide-react";

type Step = "details" | "payment" | "processing" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<Step>("details");
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: user?.phone || "",
  });
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const deliveryFee = subtotal >= 5000 ? 0 : 300;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Please Sign In</h1>
        <p className="text-muted-foreground mb-4">You need to be signed in to checkout.</p>
        <Link href="/auth/login?redirect=/checkout">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">No Items to Checkout</h1>
        <p className="text-muted-foreground mb-4">Add some items to your cart first.</p>
        <Link href="/products">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError("");
    if (!shipping.address || !shipping.city || !shipping.phone) {
      setError("Please fill in all required shipping details");
      return;
    }
    setStep("payment");
  };

  const handleMpesaPayment = async () => {
    setError("");
    if (!mpesaPhone || mpesaPhone.length < 10) {
      setError("Please enter a valid M-Pesa phone number");
      return;
    }

    setLoading(true);
    setStep("processing");
    try {
      // Create order
      const orderData = await api.post<{ order: { id: string } }>("/api/orders", {
        shippingAddress: `${shipping.address}, ${shipping.city} ${shipping.postalCode}`,
        shippingPhone: shipping.phone,
      });

      setOrderId(orderData.order.id);

      // Initiate M-Pesa payment
      await api.post("/api/mpesa/order-payment", {
        orderId: orderData.order.id,
        phone: mpesaPhone,
      });

      // Simulate wait for M-Pesa confirmation
      setTimeout(() => {
        clearCart();
        setStep("success");
        setLoading(false);
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setStep("payment");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-ig-green-light mx-auto mb-6 flex items-center justify-center">
          <Check className="h-10 w-10 text-ig-green" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-2">
          {orderId ? `Order #${orderId.slice(0, 8)}...` : "Your order"} has been confirmed.
        </p>
        <p className="text-sm text-muted-foreground mb-6">You will receive an M-Pesa confirmation and order updates.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/account/orders">
            <Button className="bg-ig-green hover:bg-ig-green/90 text-white">View Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="text-foreground">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-16 w-16 text-ig-green mx-auto mb-6 animate-spin" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Processing Payment</h1>
        <p className="text-muted-foreground mb-2">An M-Pesa push notification has been sent to your phone.</p>
        <p className="text-sm text-muted-foreground">Enter your M-Pesa PIN to complete the payment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-ig-green hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Forms */}
        <div className="flex-1">
          {step === "details" && (
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ig-green" />
                Shipping Details
              </h2>
              {error && <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>}
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Delivery Address *</Label>
                  <Input
                    placeholder="e.g. 123 Kenyatta Avenue, Apt 4B"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">City *</Label>
                    <Input
                      placeholder="Nairobi"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Postal Code</Label>
                    <Input
                      placeholder="00100"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">Phone Number *</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0700000000"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handlePlaceOrder} className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold mt-4">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Pay with M-Pesa</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your M-Pesa registered phone number. You will receive a push notification to authorize the payment.
              </p>
              {error && <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">{error}</div>}
              <div className="bg-ig-green-light rounded-lg p-4 mb-4 flex items-center gap-3">
                <div className="bg-ig-green text-white font-bold text-sm px-3 py-1.5 rounded">M-PESA</div>
                <p className="text-sm text-foreground">Safaricom M-Pesa - Lipa na M-Pesa</p>
              </div>
              <div>
                <Label className="text-foreground">M-Pesa Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="0700000000"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep("details")} className="text-foreground">Back</Button>
                <Button
                  onClick={handleMpesaPayment}
                  disabled={loading}
                  className="flex-1 bg-ig-green hover:bg-ig-green/90 text-white font-semibold"
                >
                  {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-lg p-6 sticky top-32">
            <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 bg-secondary rounded overflow-hidden shrink-0">
                    {item.thumbnail && (
                      <Image src={item.thumbnail} alt={item.name} fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-medium text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryFee === 0 ? "text-ig-green" : "text-foreground"}>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-ig-black">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
