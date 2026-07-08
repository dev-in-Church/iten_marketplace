import { Suspense } from "react";
import VerifyEmailClient from "./verify-email-client-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
