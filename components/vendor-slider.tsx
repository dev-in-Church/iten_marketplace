"use client";

import {
  SectionSlider,
  type SectionSliderConfig,
} from "@/components/section-slider";

// To add a new vendor hub, add one entry here. Unlike brand/category, the
// backend's vendor filter matches `vp.id = $1` (the vendor's UUID, exact
// match) — there's no name/slug to guess. Look vendor IDs up with:
//   SELECT id, store_name FROM vendor_profiles ORDER BY store_name;
const VENDOR_SLIDERS: SectionSliderConfig[] = [
  {
    title: "Official Stores",
    headerClassName: "bg-ig-green text-white",
    seeAllHref: "/products?vendor=9f58d954-205c-4b74-b4f3-e0f1f3cbb7d7",
    queryParams: { vendor: "9f58d954-205c-4b74-b4f3-e0f1f3cbb7d7" },
    emptyMessage: "No products from Official Stores available at the moment.",
    eager: true,
  },
  {
    // TODO: replace with the real vendor name + id from the query above.
    title: "ProPath Sports",
    headerClassName: "bg-purple-700 text-white",
    seeAllHref: "/products?vendor=5d309ec8-b007-41b1-8575-d474e1620135",
    queryParams: { vendor: "5d309ec8-b007-41b1-8575-d474e1620135" },
    emptyMessage: "No products from this vendor available at the moment.",
  },
];

export function VendorSliders() {
  return (
    <>
      {VENDOR_SLIDERS.map((config) => (
        <SectionSlider key={config.title} config={config} />
      ))}
    </>
  );
}
