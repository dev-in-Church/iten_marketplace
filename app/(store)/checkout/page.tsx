"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
} from "lucide-react";

type Step = "details" | "payment" | "processing" | "success";

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
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<Step>("details");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [additionalAddress, setAdditionalAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || "");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

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

  // Group delivery areas by type
  const groupedAreas = useMemo(() => {
    const camps = ITEN_DELIVERY_AREAS.filter((a) => a.type === "camp");
    const estates = ITEN_DELIVERY_AREAS.filter((a) => a.type === "estate");
    const centers = ITEN_DELIVERY_AREAS.filter((a) => a.type === "center");
    const pickups = ITEN_DELIVERY_AREAS.filter((a) => a.type === "pickup");
    return { camps, estates, centers, pickups };
  }, []);

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

  if (items.length === 0 && step !== "success") {
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
    setError("");

    // Validate based on payment method
    if (paymentMethod === "mpesa") {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        setError("Please enter a valid M-Pesa phone number");
        return;
      }
    } else if (paymentMethod === "card") {
      if (
        !cardDetails.number ||
        !cardDetails.expiry ||
        !cardDetails.cvc ||
        !cardDetails.name
      ) {
        setError("Please fill in all card details");
        return;
      }
    } else if (paymentMethod === "cod") {
      if (total > 20000) {
        setError(
          "Cash on Delivery is only available for orders under KES 20,000",
        );
        return;
      }
    }

    setLoading(true);
    setStep("processing");

    try {
      const shippingAddress =
        selectedDeliveryArea?.type === "pickup"
          ? `Pickup: ${selectedDeliveryArea.name} - ${selectedDeliveryArea.description}`
          : `${selectedDeliveryArea?.name}${additionalAddress ? `, ${additionalAddress}` : ""}`;

      // Create order
      const orderData = await api.post<{ order: { id: string } }>(
        "/api/orders",
        {
          shippingAddress,
          shippingPhone: phone,
          paymentMethod,
          deliveryAreaId: selectedArea,
        },
      );

      setOrderId(orderData.order.id);

      if (paymentMethod === "mpesa") {
        // Initiate M-Pesa payment
        await api.post("/api/mpesa/order", {
          orderId: orderData.order.id,
          phoneNumber: mpesaPhone,
        });
      } else if (paymentMethod === "card") {
        // Process card payment (simulated)
        await api.post("/api/payments/card", {
          orderId: orderData.order.id,
          cardLast4: cardDetails.number.slice(-4),
        });
      }
      // COD doesn't need payment processing

      setTimeout(
        () => {
          clearCart();
          setStep("success");
          setLoading(false);
        },
        paymentMethod === "cod" ? 1000 : 3000,
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
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
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-2">
          {orderId ? `Order #${orderId.slice(0, 8)}...` : "Your order"} has been
          confirmed.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {paymentMethod === "mpesa" &&
            "You will receive an M-Pesa confirmation shortly."}
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
              An M-Pesa push notification has been sent to your phone.
            </p>
            <p className="text-sm text-muted-foreground">
              Enter your M-Pesa PIN to complete the payment.
            </p>
          </>
        )}
        {paymentMethod === "card" && (
          <p className="text-muted-foreground">
            Processing your card payment...
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
        {/* Forms */}
        <div className="flex-1">
          {step === "details" && (
            <div className="space-y-6">
              {/* Delivery Area Selection */}
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

                {/* Delivery Area Dropdown */}
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
                      {/* Pickup Station - Always at top */}
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

                      {/* Town Center */}
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

                      {/* Training Camps */}
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

                      {/* Estates */}
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

                {/* Additional Address Details (for non-pickup) */}
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

                {/* Delivery Info */}
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

                {/* Phone Number */}
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
              {/* Payment Method Selection */}
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
                          {isDisabled && option.maxOrder && (
                            <p className="text-xs text-ig-red mt-1">
                              Available for orders under KES{" "}
                              {option.maxOrder.toLocaleString()}
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

                {/* M-Pesa Details */}
                {paymentMethod === "mpesa" && (
                  <div className="border-t border-border pt-6">
                    <div className="bg-ig-green-light rounded-lg p-4 mb-4 flex items-center gap-3">
                      <div className="bg-ig-green text-white font-bold text-sm px-3 py-1.5 rounded">
                        M-PESA
                      </div>
                      <p className="text-sm text-foreground">
                        Safaricom M-Pesa - Lipa na M-Pesa
                      </p>
                    </div>
                    <div>
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
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        You will receive an STK push to authorize payment
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="border-t border-border pt-6 space-y-4">
                    <div>
                      <Label className="text-foreground">Cardholder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            name: e.target.value,
                          })
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Card Number</Label>
                      <div className="relative mt-1.5">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="4242 4242 4242 4242"
                          value={cardDetails.number}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              number: e.target.value
                                .replace(/\s/g, "")
                                .replace(/(\d{4})/g, "$1 ")
                                .trim(),
                            })
                          }
                          maxLength={19}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground">Expiry Date</Label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          maxLength={5}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label className="text-foreground">CVC</Label>
                        <Input
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvc: e.target.value,
                            })
                          }
                          maxLength={4}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Your payment is secured with SSL encryption</span>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Info */}
                {paymentMethod === "cod" && (
                  <div className="border-t border-border pt-6">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-foreground font-medium mb-2">
                        Cash on Delivery Instructions
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>
                          Have the exact amount ready: {formatPrice(total)}
                        </li>
                        <li>Payment is required before opening the package</li>
                        <li>Available for orders up to KES 20,000</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="text-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-ig-green hover:bg-ig-green/90 text-white font-semibold"
                  >
                    {loading
                      ? "Processing..."
                      : paymentMethod === "cod"
                        ? `Place Order (${formatPrice(total)})`
                        : `Pay ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-lg p-6 sticky top-32">
            <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 bg-secondary rounded overflow-hidden shrink-0">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
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
                <span
                  className={
                    deliveryFee === 0 ? "text-ig-green" : "text-foreground"
                  }
                >
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </span>
              </div>
              {selectedDeliveryArea && (
                <p className="text-xs text-muted-foreground">
                  {selectedDeliveryArea.type === "pickup"
                    ? "Pickup at"
                    : "Deliver to"}
                  : {selectedDeliveryArea.name}
                </p>
              )}
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-ig-black">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
