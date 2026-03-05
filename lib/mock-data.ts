export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  currency: string;
  thumbnail: string | null;
  images: string[];
  category_name?: string;
  category_slug?: string;
  vendor_name?: string;
  vendor_verified?: boolean;
  rating: number;
  total_reviews: number;
  total_sold: number;
  is_featured: boolean;
  quantity: number;
  short_description?: string;
  description?: string;
  brand?: string;
  tags?: string[];
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: "mock-1", name: "Nike Air Zoom Pegasus 40", slug: "nike-air-zoom-pegasus-40", price: 12500, compare_price: 15000, currency: "KES", thumbnail: "/images/products/running-shoes.jpg", images: [], category_name: "Running", category_slug: "running", vendor_name: "Nike Store", vendor_verified: true, rating: 4.5, total_reviews: 128, total_sold: 340, is_featured: true, quantity: 50, short_description: "Premium running shoes for everyday athletes", brand: "Nike" },
  { id: "mock-2", name: "Adidas Predator Edge", slug: "adidas-predator-edge", price: 18000, compare_price: 22000, currency: "KES", thumbnail: "/images/products/football.jpg", images: [], category_name: "Football", category_slug: "football", vendor_name: "Adidas Official", vendor_verified: true, rating: 4.7, total_reviews: 95, total_sold: 215, is_featured: true, quantity: 30, short_description: "Professional football boots with advanced grip", brand: "Adidas" },
  { id: "mock-3", name: "Under Armour Curry 11", slug: "under-armour-curry-11", price: 22000, compare_price: 25000, currency: "KES", thumbnail: "/images/products/jersey.jpg", images: [], category_name: "Basketball", category_slug: "basketball", vendor_name: "UA Sports", vendor_verified: true, rating: 4.8, total_reviews: 72, total_sold: 156, is_featured: true, quantity: 25, short_description: "Signature basketball shoe with responsive cushioning", brand: "Under Armour" },
  { id: "mock-4", name: "Wilson Pro Staff Tennis Racket", slug: "wilson-pro-staff-tennis", price: 35000, compare_price: 40000, currency: "KES", thumbnail: "/images/products/gym-bag.jpg", images: [], category_name: "Tennis", category_slug: "tennis", vendor_name: "Wilson Sports", vendor_verified: true, rating: 4.6, total_reviews: 45, total_sold: 89, is_featured: true, quantity: 15, short_description: "Professional-grade tennis racket", brand: "Wilson" },
  { id: "mock-5", name: "Speedo FastSkin Goggles", slug: "speedo-fastskin-goggles", price: 4500, compare_price: 5500, currency: "KES", thumbnail: "/images/products/water-bottle.jpg", images: [], category_name: "Swimming", category_slug: "swimming", vendor_name: "Speedo Kenya", vendor_verified: false, rating: 4.3, total_reviews: 63, total_sold: 420, is_featured: false, quantity: 100, short_description: "Competition swimming goggles", brand: "Speedo" },
  { id: "mock-6", name: "PowerBlock Adjustable Dumbbells", slug: "powerblock-adjustable-dumbbells", price: 28000, compare_price: 32000, currency: "KES", thumbnail: "/images/products/dumbbells.jpg", images: [], category_name: "Gym & Fitness", category_slug: "gym-fitness", vendor_name: "FitGear KE", vendor_verified: true, rating: 4.9, total_reviews: 38, total_sold: 95, is_featured: true, quantity: 20, short_description: "Space-saving adjustable dumbbells 5-50lbs", brand: "PowerBlock" },
  { id: "mock-7", name: "Giant Defy Road Bike", slug: "giant-defy-road-bike", price: 85000, compare_price: 95000, currency: "KES", thumbnail: "/images/products/fitness-tracker.jpg", images: [], category_name: "Cycling", category_slug: "cycling", vendor_name: "Bike Hub KE", vendor_verified: true, rating: 4.7, total_reviews: 22, total_sold: 34, is_featured: true, quantity: 8, short_description: "Endurance road bike for long-distance riding", brand: "Giant" },
  { id: "mock-8", name: "Nike Zoom Rival Sprint Spikes", slug: "nike-zoom-rival-sprint", price: 9500, compare_price: 11000, currency: "KES", thumbnail: "/images/products/running-shoes.jpg", images: [], category_name: "Athletics", category_slug: "athletics", vendor_name: "Nike Store", vendor_verified: true, rating: 4.4, total_reviews: 56, total_sold: 180, is_featured: false, quantity: 40, short_description: "Track spikes for sprint events", brand: "Nike" },
  { id: "mock-9", name: "Puma Future Ultimate FG", slug: "puma-future-ultimate", price: 16000, compare_price: 19000, currency: "KES", thumbnail: "/images/products/football.jpg", images: [], category_name: "Football", category_slug: "football", vendor_name: "Puma Sports", vendor_verified: false, rating: 4.5, total_reviews: 67, total_sold: 198, is_featured: false, quantity: 35, short_description: "Agility football boots with dynamic fit", brand: "Puma" },
  { id: "mock-10", name: "Reebok Nano X3 Training", slug: "reebok-nano-x3", price: 14000, compare_price: 16500, currency: "KES", thumbnail: "/images/products/jersey.jpg", images: [], category_name: "Gym & Fitness", category_slug: "gym-fitness", vendor_name: "FitGear KE", vendor_verified: true, rating: 4.6, total_reviews: 84, total_sold: 267, is_featured: true, quantity: 45, short_description: "Versatile cross-training shoe", brand: "Reebok" },
  { id: "mock-11", name: "Asics Gel-Kayano 30", slug: "asics-gel-kayano-30", price: 19500, compare_price: 23000, currency: "KES", thumbnail: "/images/products/running-shoes.jpg", images: [], category_name: "Running", category_slug: "running", vendor_name: "Run Kenya", vendor_verified: true, rating: 4.8, total_reviews: 112, total_sold: 305, is_featured: true, quantity: 28, short_description: "Maximum support running shoe", brand: "Asics" },
  { id: "mock-12", name: "Yoga Mat Premium 6mm", slug: "yoga-mat-premium-6mm", price: 3500, compare_price: 4500, currency: "KES", thumbnail: "/images/products/yoga-mat.jpg", images: [], category_name: "Gym & Fitness", category_slug: "gym-fitness", vendor_name: "FitGear KE", vendor_verified: false, rating: 4.2, total_reviews: 156, total_sold: 890, is_featured: false, quantity: 200, short_description: "Non-slip premium yoga mat", brand: "Generic" },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Running", slug: "running", description: "Running shoes, apparel and accessories" },
  { id: "2", name: "Football", slug: "football", description: "Football boots, balls and gear" },
  { id: "3", name: "Basketball", slug: "basketball", description: "Basketball shoes, jerseys and equipment" },
  { id: "4", name: "Tennis", slug: "tennis", description: "Tennis rackets, shoes and apparel" },
  { id: "5", name: "Swimming", slug: "swimming", description: "Swimwear, goggles and accessories" },
  { id: "6", name: "Gym & Fitness", slug: "gym-fitness", description: "Gym equipment, weights and fitness gear" },
  { id: "7", name: "Cycling", slug: "cycling", description: "Bikes, helmets and cycling accessories" },
  { id: "8", name: "Athletics", slug: "athletics", description: "Track and field equipment and apparel" },
];

export function formatPrice(amount: number, currency = "KES"): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function getDiscountPercent(price: number, comparePrice?: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
