import {
  Baby,
  Bike,
  Box,
  CircleDot,
  Dribbble,
  Dumbbell,
  Footprints,
  Shirt,
  Timer,
  Trophy,
  Watch,
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
    name: "Shoes",
    slug: "shoes",
    icon: <Footprints />,
    description: "Running shoes, apparel and accessories",
    image_url: "/images/categories/shoes.jpg",
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    icon: <Shirt />,
    description: "Football boots, balls and gear",
    image_url: "/images/categories/clothing.jpg",
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    icon: <Dribbble />,
    description: "Basketball shoes, jerseys and equipment",
    image_url: "/images/categories/accessories.jpg",
  },
  // {
  //   id: "4",
  //   name: "Men",
  //   slug: "men",
  //   icon: <Box />,
  //   description: "Tennis rackets, shoes and apparel",
  //   image_url: "/images/categories/men.jpg",
  // },
  {
    id: "5",
    name: "Kids",
    slug: "kids",
    icon: <Baby />,
    description: "Swimwear, goggles and accessories",
    image_url: "/images/categories/kids.jpg",
  },
  {
    id: "6",
    name: "Fitness",
    slug: "gym-fitness",
    icon: <Dumbbell />,
    description: "Gym equipment, weights and fitness gear",
    image_url: "/images/categories/fitness.jpg",
  },
  {
    id: "7",
    name: "Women",
    slug: "women",
    icon: <Box />,
    description: "Bikes, helmets and cycling accessories",
    image_url: "/images/categories/women.jpg",
  },
  {
    id: "8",
    name: "Wearables",
    slug: "wearables",
    icon: <Watch />,
    description: "Track and field equipment and apparel",
    image_url: "/images/categories/wearables.jpg",
  },
];
