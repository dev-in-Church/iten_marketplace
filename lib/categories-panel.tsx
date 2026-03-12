import {
  Bike,
  CircleDot,
  Dribbble,
  Dumbbell,
  Footprints,
  Timer,
  Trophy,
  Waves,
} from "lucide-react";
import { ReactElement } from "react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: ReactElement;
  description?: string;
  image_url: string;
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Running",
    slug: "running",
    icon: <Footprints />,
    description: "Running shoes, apparel and accessories",
    image_url: "/images/placeholder.png",
  },
  {
    id: "2",
    name: "Football",
    slug: "football",
    icon: <Trophy />,
    description: "Football boots, balls and gear",
    image_url: "/images/placeholder.png",
  },
  {
    id: "3",
    name: "Basketball",
    slug: "basketball",
    icon: <Dribbble />,
    description: "Basketball shoes, jerseys and equipment",
    image_url: "/images/placeholder.png",
  },
  {
    id: "4",
    name: "Tennis",
    slug: "tennis",
    icon: <CircleDot />,
    description: "Tennis rackets, shoes and apparel",
    image_url: "/images/placeholder.png",
  },
  {
    id: "5",
    name: "Swimming",
    slug: "swimming",
    icon: <Waves />,
    description: "Swimwear, goggles and accessories",
    image_url: "/images/placeholder.png",
  },
  {
    id: "6",
    name: "Gym & Fitness",
    slug: "gym-fitness",
    icon: <Dumbbell />,
    description: "Gym equipment, weights and fitness gear",
    image_url: "/images/placeholder.png",
  },
  {
    id: "7",
    name: "Cycling",
    slug: "cycling",
    icon: <Bike />,
    description: "Bikes, helmets and cycling accessories",
    image_url: "/images/placeholder.png",
  },
  {
    id: "8",
    name: "Athletics",
    slug: "athletics",
    icon: <Timer />,
    description: "Track and field equipment and apparel",
    image_url: "/images/placeholder.png",
  },
];
