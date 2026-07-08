"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "resend"
  >("loading");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "No verification token provided. Please check your email link.",
      );
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.post<{
          success: boolean;
          message: string;
        }>("/api/verification/verify-email", {
          token,
        });

        setStatus("success");
        setMessage(
          response.message ??
            "Email verified successfully! Redirecting to login...",
        );

        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Verification failed";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleResendEmail = async () => {
    setResendLoading(true);

    try {
      await api.post("/api/verification/resend-verification", {});

      setStatus("resend");
      setMessage("Verification email sent! Check your inbox.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend email";

      setMessage(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>

              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Verifying Email
              </h1>

              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>

              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Email Verified!
              </h1>

              <p className="text-muted-foreground mb-6">{message}</p>

              <p className="text-sm text-muted-foreground">
                Redirecting to login...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>

              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Verification Failed
              </h1>

              <p className="text-muted-foreground mb-6">{message}</p>

              <Button
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/auth/login")}
                className="w-full mt-2"
              >
                Back to Login
              </Button>
            </>
          )}

          {status === "resend" && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>

              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Email Sent
              </h1>

              <p className="text-muted-foreground mb-6">{message}</p>

              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already verified?{" "}
          <a
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}
