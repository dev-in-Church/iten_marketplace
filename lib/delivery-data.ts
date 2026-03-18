// Iten delivery areas - training camps and known locations
export interface DeliveryArea {
  id: string;
  name: string;
  type: "camp" | "estate" | "center" | "pickup";
  fee: number;
  estimatedDays: string;
  description?: string;
}

export const ITEN_DELIVERY_AREAS: DeliveryArea[] = [
  // Training Camps
  {
    id: "lornah-kiplagat",
    name: "Lornah Kiplagat High Altitude Training Camp",
    type: "camp",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "kerio-view",
    name: "Kerio View Training Camp",
    type: "camp",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "global-sports",
    name: "Global Sports Communication Camp",
    type: "camp",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "st-patricks",
    name: "St. Patrick's High School Area",
    type: "camp",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "kechei",
    name: "Kechei Centre",
    type: "camp",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "runix",
    name: "RUN'IX",
    type: "camp",
    fee: 150,
    estimatedDays: "Same day",
  },
  {
    id: "kiprun",
    name: "Kiprun Camp",
    type: "camp",
    fee: 200,
    estimatedDays: "1-2 days",
  },
  {
    id: "jc",
    name: "JC Iten Guest House",
    type: "camp",
    fee: 200,
    estimatedDays: "1-2 days",
  },

  // Estates and Residential Areas
  {
    id: "iten-town",
    name: "Iten Town Center",
    type: "center",
    fee: 50,
    estimatedDays: "Same day",
  },
  {
    id: "fairview",
    name: "Fairview Estate",
    type: "estate",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "kessup",
    name: "Kessup Area",
    type: "estate",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "mindililwo",
    name: "Mindililwo",
    type: "estate",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "flax",
    name: "Flax Area",
    type: "estate",
    fee: 100,
    estimatedDays: "Same day",
  },
  {
    id: "kiptabach",
    name: "Kiptabach",
    type: "estate",
    fee: 150,
    estimatedDays: "Same day",
  },
  {
    id: "sergoit",
    name: "Sergoit",
    type: "estate",
    fee: 150,
    estimatedDays: "1-2 days",
  },
  {
    id: "chebiemit",
    name: "Chebiemit",
    type: "estate",
    fee: 200,
    estimatedDays: "1-2 days",
  },

  // Main Pickup Station
  {
    id: "sporttechies-pickup",
    name: "SportTechies Innovations Pickup Station",
    type: "pickup",
    fee: 0,
    estimatedDays: "Same day",
    description: "Opp. Iten Police Station, Next to Tirop's Angels",
  },
];

export const PICKUP_STATION = ITEN_DELIVERY_AREAS.find(
  (a) => a.id === "sporttechies-pickup",
)!;

export function getDeliveryFee(areaId: string, subtotal: number): number {
  const area = ITEN_DELIVERY_AREAS.find((a) => a.id === areaId);
  if (!area) return 300; // Default delivery fee
  if (subtotal >= 5000) return 0; // Free delivery for orders over 5000
  return area.fee;
}

// Payment methods
export type PaymentMethod = "mpesa" | "card" | "cod";

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  minOrder?: number;
  maxOrder?: number;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Pay instantly via Safaricom M-Pesa",
    icon: "mpesa",
    available: true,
  },
  {
    id: "card",
    name: "Card Payment",
    description: "Visa, Mastercard, AMEX accepted",
    icon: "card",
    available: true,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: "cash",
    available: true,
    maxOrder: 20000, // COD limit
  },
];

// Sports brands for homepage
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export const FEATURED_BRANDS: Brand[] = [
  {
    id: "adidas",
    name: "Adidas",
    slug: "adidas",
    logo: "/images/brands/adidas.svg",
  },
  { id: "nike", name: "Nike", slug: "nike", logo: "/images/brands/nike.svg" },

  { id: "puma", name: "Puma", slug: "puma", logo: "/images/brands/puma.svg" },
  {
    id: "under-armour",
    name: "Under Armour",
    slug: "under-armour",
    logo: "/images/brands/ua.svg",
  },
  {
    id: "asics",
    name: "Asics",
    slug: "asics",
    logo: "/images/brands/asics.svg",
  },
  {
    id: "reebok",
    name: "Reebok",
    slug: "reebok",
    logo: "/images/brands/reebok.svg",
  },
  {
    id: "new-balance",
    name: "New Balance",
    slug: "new-balance",
    logo: "/images/brands/nb.svg",
  },
  {
    id: "brooks",
    name: "Brooks",
    slug: "brooks",
    logo: "/images/brands/brooks.svg",
  },
  {
    id: "air-jordan",
    name: "Air Jordan",
    slug: "air-jordan",
    logo: "/images/brands/jordan.svg",
  },
  {
    id: "fila",
    name: "Fila",
    slug: "fila",
    logo: "/images/brands/fila.svg",
  },
  {
    id: "garmin",
    name: "Garmin",
    slug: "garmin",
    logo: "/images/brands/garmin.svg",
  },
  {
    id: "enda",
    name: "Enda",
    slug: "fila",
    logo: "/images/brands/enda.png",
  },
];
