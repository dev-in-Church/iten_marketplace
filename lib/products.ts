export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  thumbnail: string | null;
  currency: string;
  vendor_name: string;
  vendorName: string | null;
  vendor_verified: boolean;
  vendor_type?: "local" | "international";
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  category_slug?: string;
  brand?: string | null;
  total_sold?: number;
};

export function formatPrice(
  amount: number | string | null | undefined,
  currency = "KES",
): string {
  const numericAmount = Number.parseFloat(String(amount ?? 0));
  const normalizedCurrency =
    String(currency || "KES").toUpperCase() === "USD" ? "USD" : "KES";
  return normalizedCurrency === "USD"
    ? `USD ${numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `KES ${numericAmount.toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
}

export function getDiscountPercent(price: number, comparePrice: number | null) {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
