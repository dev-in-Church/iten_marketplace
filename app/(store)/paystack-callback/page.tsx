"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");
        if (!reference) {
          setStatus("failed");
          setError("No payment reference found");
          return;
        }

        // Verify payment with backend
        const result = await api.get<{
          status: boolean;
          message: string;
          order?: { order_number: string; id: string };
        }>("/api/payments/paystack-verify", { reference });

        if (result.status) {
          // Clear cart and redirect to success
          sessionStorage.removeItem("pendingOrderId");
          sessionStorage.removeItem("paystackReference");
          setStatus("success");

          // Redirect to orders page after 2 seconds
          setTimeout(() => {
            router.push("/account/orders");
          }, 2000);
        } else {
          setStatus("failed");
          setError(result.message || "Payment verification failed");
        }
      } catch (err: unknown) {
        setStatus("failed");
        setError(
          err instanceof Error ? err.message : "Payment verification failed",
        );
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {status === "verifying" && (
        <>
          <Loader2 className="h-12 w-12 text-ig-green mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verifying Payment
          </h1>
          <p className="text-muted-foreground">
            Please wait while we verify your payment...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 rounded-full bg-ig-green-light mx-auto mb-6 flex items-center justify-center">
            <Check className="h-10 w-10 text-ig-green" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed and is being processed.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to your orders...
          </p>
          <Button
            onClick={() => router.push("/account/orders")}
            className="bg-ig-green hover:bg-ig-green/90 text-white"
          >
            View Orders
          </Button>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-20 h-20 rounded-full bg-ig-red-light mx-auto mb-6 flex items-center justify-center">
            <X className="h-10 w-10 text-ig-red" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-muted-foreground mb-2">
            {error || "Your payment could not be verified."}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Please try again or contact support if the problem persists.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => router.push("/checkout")}
              className="bg-ig-green hover:bg-ig-green/90 text-white"
            >
              Retry Payment
            </Button>
            <Button
              onClick={() => router.push("/account/orders")}
              variant="outline"
              className="text-foreground"
            >
              View Orders
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
