export type Product = {
  id: string;
  name: string;
  size: string;
  category: "Bebidas" | "Panadería";
  illustration: "latte" | "americano" | "chai" | "muffin";
  price: number;
};

export const products: Product[] = [
  { id: "small-latte", name: "Latte", size: "Chico · 12 oz", category: "Bebidas", illustration: "latte", price: 6500 },
  { id: "large-latte", name: "Latte", size: "Grande · 16 oz", category: "Bebidas", illustration: "latte", price: 7500 },
  { id: "americano", name: "Americano", size: "Regular", category: "Bebidas", illustration: "americano", price: 4500 },
  { id: "chai", name: "Chai latte", size: "Regular", category: "Bebidas", illustration: "chai", price: 6800 },
  { id: "muffin", name: "Muffin de chocolate", size: "Pieza", category: "Panadería", illustration: "muffin", price: 4200 },
];

export type TicketLine = { product: Product; quantity: number };
