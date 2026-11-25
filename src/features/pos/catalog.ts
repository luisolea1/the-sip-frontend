import type { PackageId } from "./packaging";

export const productCategories = ["Café", "Bebidas", "Alimentos"] as const;

export type Product = {
  id: string;
  name: string;
  size: string;
  category: (typeof productCategories)[number];
  illustration: "latte" | "americano" | "chai" | "muffin";
  price: number;
  packageId: PackageId;
};

export const products: Product[] = [
  { id: "small-latte", name: "Latte", size: "Chico · 12 oz", category: "Café", illustration: "latte", price: 6500, packageId: "smallCup" },
  { id: "large-latte", name: "Latte", size: "Grande · 16 oz", category: "Café", illustration: "latte", price: 7500, packageId: "largeCup" },
  { id: "americano", name: "Americano", size: "Regular", category: "Café", illustration: "americano", price: 4500, packageId: "smallCup" },
  { id: "chai", name: "Chai latte", size: "Regular", category: "Bebidas", illustration: "chai", price: 6800, packageId: "smallCup" },
  { id: "muffin", name: "Muffin de chocolate", size: "Pieza", category: "Alimentos", illustration: "muffin", price: 4200, packageId: "tray" },
];

export type TicketLine = { product: Product; quantity: number; takeaway: number };
