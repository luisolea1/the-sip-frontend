import type { PackageId } from "./packaging";

export type Product = {
  id: string;
  name: string;
  size: string;
  category: "Bebidas" | "Panadería";
  illustration: "latte" | "americano" | "chai" | "muffin";
  price: number;
  packageId: PackageId;
};

export const products: Product[] = [
  { id: "small-latte", name: "Latte", size: "Chico · 12 oz", category: "Bebidas", illustration: "latte", price: 6500, packageId: "smallCup" },
  { id: "large-latte", name: "Latte", size: "Grande · 16 oz", category: "Bebidas", illustration: "latte", price: 7500, packageId: "largeCup" },
  { id: "americano", name: "Americano", size: "Regular", category: "Bebidas", illustration: "americano", price: 4500, packageId: "smallCup" },
  { id: "chai", name: "Chai latte", size: "Regular", category: "Bebidas", illustration: "chai", price: 6800, packageId: "smallCup" },
  { id: "muffin", name: "Muffin de chocolate", size: "Pieza", category: "Panadería", illustration: "muffin", price: 4200, packageId: "tray" },
];

export type TicketLine = { product: Product; quantity: number; takeaway: number };
