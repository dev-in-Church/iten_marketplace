export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  thumbnail: string | null;
  currency: string;
  vendor_name: string | null;
  vendorName: string | null;
  vendor_verified: boolean;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  category_slug?: string;
  brand?: string | null;
  total_sold?: number;
};

export const formatPrice = (
  price: number | string | null | undefined,
): string => {
  const numericPrice = Number.parseFloat(String(price ?? 0));

  return `KSh${numericPrice.toLocaleString("en-KE")}`;
};

export function getDiscountPercent(price: number, comparePrice: number | null) {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
