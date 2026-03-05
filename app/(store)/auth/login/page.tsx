import { Suspense } from "react";
import LoginPageClient from "./login-page-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
