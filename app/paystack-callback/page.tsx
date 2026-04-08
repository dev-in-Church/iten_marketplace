"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref"); // Paystack sometimes uses this

    const finalReference = reference || trxref;

    const verifyPayment = async () => {
      if (!finalReference) {
        router.push("/checkout?payment=failed");
        return;
      }

      try {
        // Get orderId from localStorage
        const orderId = localStorage.getItem("pending_order_id");

        if (!orderId) {
          router.push("/checkout?payment=failed");
          return;
        }

        const response = await api.get(
          `/api/payments/paystack-verify?reference=${finalReference}&orderId=${orderId}`,
        );

        if (response.data?.status) {
          // Clear stored data
          localStorage.removeItem("pending_order_id");
          localStorage.removeItem("cart");
          // Redirect to success
          router.push("/checkout?payment=success&reference=" + finalReference);
        } else {
          router.push("/checkout?payment=failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        router.push("/checkout?payment=failed");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Verifying your payment...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please do not close this page
        </p>
      </div>
    </div>
  );
}

export default function PaystackCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
