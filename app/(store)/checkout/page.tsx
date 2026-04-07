"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/mock-data";
import {
  ITEN_DELIVERY_AREAS,
  PAYMENT_OPTIONS,
  PICKUP_STATION,
  type DeliveryArea,
  type PaymentMethod,
} from "@/lib/delivery-data";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ShoppingBag,
  Phone,
  MapPin,
  Check,
  Loader2,
  CreditCard,
  Banknote,
  ChevronDown,
  Store,
  Home,
  Tent,
  Building,
  Shield,
  AlertCircle,
  RefreshCw,
  Lock,
  X,
} from "lucide-react";

type Step = "details" | "payment" | "processing" | "failed" | "success";

function getAreaIcon(type: DeliveryArea["type"]) {
  switch (type) {
    case "camp":
      return <Tent className="h-4 w-4" />;
    case "estate":
      return <Home className="h-4 w-4" />;
    case "center":
      return <Building className="h-4 w-4" />;
    case "pickup":
      return <Store className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<Step>("details");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [additionalAddress, setAdditionalAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(
    null,
  );
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [pollingCount, setPollingCount] = useState(0);
  const [error, setError] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || "");

  const selectedDeliveryArea = useMemo(
    () => ITEN_DELIVERY_AREAS.find((a) => a.id === selectedArea),
    [selectedArea],
  );

  const deliveryFee = useMemo(() => {
    if (!selectedDeliveryArea) return 300;
    if (subtotal >= 5000) return 0;
    return selectedDeliveryArea.fee;
  }, [selectedDeliveryArea, subtotal]);

  const total = subtotal + deliveryFee;

  const groupedAreas = useMemo(() => {
    const camps = ITEN_DELIVERY_AREAS.filter((a) => a.type === "camp");
    const estates = ITEN_DELIVERY_AREAS.filter((a) => a.type === "estate");
    const centers = ITEN_DELIVERY_AREAS.filter((a) => a.type === "center");
    const pickups = ITEN_DELIVERY_AREAS.filter((a) => a.type === "pickup");
    return { camps, estates, centers, pickups };
  }, []);

  // Check for payment callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatusParam = urlParams.get("payment");
    const reference = urlParams.get("reference");
    const orderIdParam = urlParams.get("orderId");

    if (paymentStatusParam === "success" && reference) {
      // Payment was successful
      clearCart();
      setStep("success");
      // Clean URL
      window.history.replaceState({}, "", "/checkout");
    } else if (paymentStatusParam === "failed") {
      setError("Payment failed. Please try again.");
      setStep("payment");
      // Clean URL
      window.history.replaceState({}, "", "/checkout");
    } else if (orderIdParam && reference) {
      // Verify payment when returning from Paystack
      const verifyPayment = async () => {
        setLoading(true);
        try {
          const verifyRes = await api.get(
            `/api/payments/paystack-verify?reference=${reference}&orderId=${orderIdParam}`,
          );

          if (verifyRes.data?.status) {
            clearCart();
            setStep("success");
          } else {
            setError("Payment verification failed. Please try again.");
            setStep("payment");
          }
        } catch (err) {
          console.error("Verification error:", err);
          setError("Payment verification failed. Please contact support.");
          setStep("payment");
        } finally {
          setLoading(false);
          // Clean URL
          window.history.replaceState({}, "", "/checkout");
        }
      };

      verifyPayment();
    }
  }, [clearCart]);

  // Poll for M-Pesa payment status
  const pollPaymentStatus = useCallback(async () => {
    if (!checkoutRequestId || paymentStatus !== "pending") return;

    try {
      const result = await api.get<{ status: string; orderStatus?: string }>(
        `/api/mpesa/status/${checkoutRequestId}`,
      );

      if (result.status === "completed") {
        setPaymentStatus("completed");
        clearCart();
        setStep("success");
        setLoading(false);
      } else if (result.status === "failed" || result.status === "cancelled") {
        setPaymentStatus("failed");
        setStep("failed");
        setLoading(false);
      } else {
        setPollingCount((prev) => prev + 1);
      }
    } catch {
      setPollingCount((prev) => prev + 1);
    }
  }, [checkoutRequestId, paymentStatus, clearCart]);

  useEffect(() => {
    if (
      step === "processing" &&
      paymentMethod === "mpesa" &&
      checkoutRequestId &&
      pollingCount < 12
    ) {
      const timer = setTimeout(pollPaymentStatus, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, paymentMethod, checkoutRequestId, pollingCount, pollPaymentStatus]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Please Sign In
        </h1>
        <p className="text-muted-foreground mb-4">
          You need to be signed in to checkout.
        </p>
        <Link href="/auth/login?redirect=/checkout">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (
    items.length === 0 &&
    step !== "success" &&
    step !== "failed" &&
    step !== "processing"
  ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          No Items to Checkout
        </h1>
        <p className="text-muted-foreground mb-4">
          Add some items to your cart first.
        </p>
        <Link href="/products">
          <Button className="bg-ig-green hover:bg-ig-green/90 text-white">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleContinueToPayment = () => {
    setError("");
    if (!selectedArea) {
      setError("Please select a delivery area");
      return;
    }
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    console.log("[v0] handlePayment called with paymentMethod:", paymentMethod);
    setError("");

    if (paymentMethod === "mpesa") {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        setError("Please enter a valid M-Pesa phone number");
        return;
      }
    } else if (paymentMethod === "card") {
      console.log("[v0] Card payment selected");
    } else if (paymentMethod === "cod") {
      if (total > 20000) {
        setError("Cash on Delivery is limited to orders under KES 20,000");
        return;
      }
    }

    setLoading(true);
    setPollingCount(0);
    setPaymentStatus("pending");

    try {
      const shippingAddress =
        selectedDeliveryArea?.type === "pickup"
          ? `Pickup: ${selectedDeliveryArea.name} - ${selectedDeliveryArea.description}`
          : `${selectedDeliveryArea?.name}${additionalAddress ? `, ${additionalAddress}` : ""}`;

      console.log("[v0] Creating order with paymentMethod:", paymentMethod);
      const orderData = await api.post<{
        order: { id: string; order_number: string };
      }>("/api/orders", {
        shippingAddress,
        shippingPhone: phone,
        paymentMethod,
        deliveryAreaId: selectedArea,
      });

      console.log("[v0] Order created:", orderData.order.order_number);
      setOrderId(orderData.order.id);
      setOrderNumber(orderData.order.order_number);
      setStep("processing");

      if (paymentMethod === "mpesa") {
        console.log("[v0] Processing M-Pesa payment");
        const mpesaData = await api.post<{ checkoutRequestId: string }>(
          "/api/mpesa/order-payment",
          {
            orderId: orderData.order.id,
            phone: mpesaPhone,
          },
        );

        setCheckoutRequestId(mpesaData.checkoutRequestId);
      } else if (paymentMethod === "card") {
        console.log("[v0] Initializing Paystack payment");
        const paystackData = await api.post<{
          status: boolean;
          data: {
            reference: string;
            authorizationUrl: string;
            accessCode: string;
          };
        }>("/api/payments/paystack-init", {
          orderId: orderData.order.id,
        });

        console.log("[v0] Paystack init response:", paystackData);

        if (paystackData.data?.authorizationUrl) {
          console.log("[v0] Redirecting to Paystack payment page");
          // Store order ID for callback
          localStorage.setItem("pending_order_id", orderData.order.id);
          // Redirect to Paystack
          window.location.href = paystackData.data.authorizationUrl;
        } else {
          console.error("[v0] Paystack init failed - missing authorizationUrl");
          throw new Error("Failed to initialize Paystack payment");
        }
      } else if (paymentMethod === "cod") {
        console.log("[v0] Processing COD order");
        setTimeout(() => {
          clearCart();
          setStep("success");
          setLoading(false);
        }, 1500);
      }
    } catch (err: unknown) {
      console.error("[v0] handlePayment error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process order. Please try again.",
      );
      setStep("payment");
      setLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!orderId) return;

    setError("");
    setLoading(true);
    setPollingCount(0);
    setPaymentStatus("pending");
    setStep("processing");

    try {
      const mpesaData = await api.post<{ checkoutRequestId: string }>(
        "/api/mpesa/retry-payment",
        {
          orderId,
          phone: mpesaPhone,
        },
      );

      setCheckoutRequestId(mpesaData.checkoutRequestId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to retry payment.");
      setStep("failed");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-ig-green-light mx-auto mb-6 flex items-center justify-center">
          <Check className="h-10 w-10 text-ig-green" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-2">
          Order #{orderNumber || orderId?.slice(0, 8)} has been confirmed.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {paymentMethod === "mpesa" && "Payment received via M-Pesa."}
          {paymentMethod === "card" &&
            "Your card has been charged successfully."}
          {paymentMethod === "cod" &&
            "Please have cash ready when your order arrives."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/account/orders">
            <Button className="bg-ig-green hover:bg-ig-green/90 text-white">
              View Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="text-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-ig-red-light mx-auto mb-6 flex items-center justify-center">
          <X className="h-10 w-10 text-ig-red" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Payment Failed
        </h1>
        <p className="text-muted-foreground mb-2">
          Your M-Pesa payment was not completed. This could be due to:
        </p>
        <ul className="text-sm text-muted-foreground mb-6 space-y-1">
          <li>Cancelled transaction</li>
          <li>Insufficient M-Pesa balance</li>
          <li>Wrong PIN entered</li>
          <li>Timeout</li>
        </ul>
        <div className="bg-secondary rounded-lg p-4 mb-6 max-w-sm mx-auto">
          <Label className="text-foreground text-sm">M-Pesa Phone Number</Label>
          <Input
            type="tel"
            placeholder="0700000000"
            value={mpesaPhone}
            onChange={(e) => setMpesaPhone(e.target.value)}
            className="mt-1.5"
          />
        </div>
        {error && <p className="text-ig-red text-sm mb-4">{error}</p>}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={handleRetryPayment}
            disabled={loading}
            className="bg-ig-green hover:bg-ig-green/90 text-white gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Retry Payment
          </Button>
          <Link href="/account/orders">
            <Button variant="outline" className="text-foreground">
              View Orders
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Your order has been saved. You can also pay later from your orders
          page.
        </p>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-16 w-16 text-ig-green mx-auto mb-6 animate-spin" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Processing Your Order
        </h1>
        {paymentMethod === "mpesa" && (
          <>
            <p className="text-muted-foreground mb-2">
              An M-Pesa prompt has been sent to {mpesaPhone}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your M-Pesa PIN to complete payment.
            </p>
            <div className="bg-ig-green-light rounded-lg p-4 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-2 text-ig-green">
                <Phone className="h-5 w-5" />
                <span className="font-medium">Check your phone</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Waiting for confirmation... ({Math.min(pollingCount * 5, 60)}s)
            </p>
          </>
        )}
        {paymentMethod === "card" && (
          <p className="text-muted-foreground">
            Redirecting to Paystack secure payment page...
          </p>
        )}
        {paymentMethod === "cod" && (
          <p className="text-muted-foreground">Confirming your order...</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-ig-green hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {step === "details" && (
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-ig-green" />
                  Delivery Location
                </h2>
                {error && (
                  <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="relative mb-4">
                  <Label className="text-foreground mb-1.5 block">
                    Select your area in Iten *
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowAreaDropdown(!showAreaDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-input rounded-lg text-left bg-background hover:bg-secondary/50 transition-colors"
                  >
                    {selectedDeliveryArea ? (
                      <span className="flex items-center gap-2">
                        {getAreaIcon(selectedDeliveryArea.type)}
                        <span className="text-foreground">
                          {selectedDeliveryArea.name}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Choose delivery area...
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${showAreaDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showAreaDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
                          Pickup Station (Free)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedArea(PICKUP_STATION.id);
                            setShowAreaDropdown(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3 rounded-md hover:bg-ig-green-light transition-colors text-left ${selectedArea === PICKUP_STATION.id ? "bg-ig-green-light" : ""}`}
                        >
                          <Store className="h-4 w-4 text-ig-green mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {PICKUP_STATION.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {PICKUP_STATION.description}
                            </p>
                            <span className="text-xs text-ig-green font-medium">
                              Free Pickup
                            </span>
                          </div>
                        </button>
                      </div>

                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
                          Town Center
                        </p>
                        {groupedAreas.centers.map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => {
                              setSelectedArea(area.id);
                              setShowAreaDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-secondary transition-colors ${selectedArea === area.id ? "bg-secondary" : ""}`}
                          >
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              {getAreaIcon(area.type)} {area.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              KES {area.fee}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
                          Training Camps
                        </p>
                        {groupedAreas.camps.map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => {
                              setSelectedArea(area.id);
                              setShowAreaDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-secondary transition-colors ${selectedArea === area.id ? "bg-secondary" : ""}`}
                          >
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              {getAreaIcon(area.type)} {area.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              KES {area.fee} - {area.estimatedDays}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="p-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">
                          Estates & Other Areas
                        </p>
                        {groupedAreas.estates.map((area) => (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => {
                              setSelectedArea(area.id);
                              setShowAreaDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-secondary transition-colors ${selectedArea === area.id ? "bg-secondary" : ""}`}
                          >
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              {getAreaIcon(area.type)} {area.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              KES {area.fee} - {area.estimatedDays}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedDeliveryArea &&
                  selectedDeliveryArea.type !== "pickup" && (
                    <div className="mb-4">
                      <Label className="text-foreground">
                        Additional Address Details (optional)
                      </Label>
                      <Input
                        placeholder="e.g., Room number, building name, landmark"
                        value={additionalAddress}
                        onChange={(e) => setAdditionalAddress(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  )}

                {selectedDeliveryArea && (
                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDeliveryArea.type === "pickup"
                            ? "Pickup Location"
                            : "Delivery to"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedDeliveryArea.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {subtotal >= 5000
                            ? "Free"
                            : deliveryFee === 0
                              ? "Free"
                              : `KES ${deliveryFee}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedDeliveryArea.estimatedDays}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-foreground">Phone Number *</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0700000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We will call this number for delivery coordination
                  </p>
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-ig-green hover:bg-ig-green/90 text-white font-semibold mt-6"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Select Payment Method
                </h2>
                {error && (
                  <div className="bg-ig-red-light text-ig-red text-sm p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {PAYMENT_OPTIONS.map((option) => {
                    const isDisabled =
                      option.maxOrder && total > option.maxOrder;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          !isDisabled && setPaymentMethod(option.id)
                        }
                        disabled={isDisabled}
                        className={`w-full flex items-center gap-4 p-4 border rounded-lg transition-all text-left ${
                          paymentMethod === option.id
                            ? "border-ig-green bg-ig-green-light"
                            : isDisabled
                              ? "border-border bg-secondary/50 opacity-50 cursor-not-allowed"
                              : "border-border hover:border-ig-green/50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === option.id ? "bg-ig-green text-white" : "bg-secondary text-foreground"}`}
                        >
                          {option.icon === "mpesa" && (
                            <span className="text-xs font-bold">M</span>
                          )}
                          {option.icon === "card" && (
                            <CreditCard className="h-5 w-5" />
                          )}
                          {option.icon === "cash" && (
                            <Banknote className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {option.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                          {isDisabled && (
                            <p className="text-xs text-ig-red mt-1">
                              Max order: {formatPrice(option.maxOrder!)}
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === option.id ? "border-ig-green bg-ig-green" : "border-muted-foreground"}`}
                        >
                          {paymentMethod === option.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="bg-ig-green-light rounded-lg p-4 mb-6">
                    <Label className="text-foreground">
                      M-Pesa Phone Number
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="0700000000"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      You will receive an M-Pesa prompt on this number
                    </p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Please have exact cash ready. Our delivery agent may
                          not have change.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-ig-green hover:bg-ig-green/90 text-white font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {paymentMethod === "cod"
                      ? "Place Order"
                      : `Pay ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white border border-border rounded-lg p-5 sticky top-24">
            <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={
                        item.thumbnail || "/images/products/running-shoes.jpg"
                      }
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-foreground">
                  {subtotal >= 5000 ? (
                    <span className="text-ig-green">Free</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              {subtotal < 5000 && (
                <p className="text-xs text-ig-green">
                  Add {formatPrice(5000 - subtotal)} more for free delivery
                </p>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-ig-green">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
