"use client";

import {
  SectionSlider,
  type SectionSliderConfig,
} from "@/components/section-slider";

// To add a new category hub, add one entry here.
//
// ASSUMPTION: your controller filters categories by exact slug
// (`c.slug = $1`, no case-folding — unlike the brand filter, which does
// LOWER() on both sides). The `category` values below are my best guess
// at your real slugs, slugified from the names you gave me. If a slider
// below comes up empty, check the actual slug with:
//   SELECT id, name, slug FROM categories;
// and correct the `category` value in the matching entry — "biking" in
// particular may actually be stored as "cycling".
const CATEGORY_SLIDERS: SectionSliderConfig[] = [
  {
    title: "Supplements",
    headerClassName: "bg-emerald-700 text-white",
    seeAllHref: "/products?category=supplements",
    queryParams: { category: "supplements" },
    emptyMessage: "No supplement products available at the moment.",
  },
  {
    title: "Biking Gear",
    headerClassName: "bg-amber-600 text-white",
    seeAllHref: "/products?category=biking",
    queryParams: { category: "biking" },
    emptyMessage: "No biking products available at the moment.",
  },
  {
    title: "Football Essentials",
    headerClassName: "bg-red-700 text-white",
    seeAllHref: "/products?category=football",
    queryParams: { category: "football" },
    emptyMessage: "No football products available at the moment.",
  },
];

export function CategorySliders() {
  return (
    <>
      {CATEGORY_SLIDERS.map((config) => (
        <SectionSlider key={config.title} config={config} />
      ))}
    </>
  );
}
