import { Suspense } from "react";
import ProductsPageClient from "./products-page-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProductsPageClient />
    </Suspense>
  );
}
