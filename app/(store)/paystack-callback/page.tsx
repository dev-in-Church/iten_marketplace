import { Suspense } from "react";
import PaystackCallbackClient from "./PaystackCallbackClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Processing payment...</div>}>
      <PaystackCallbackClient />
    </Suspense>
  );
}
