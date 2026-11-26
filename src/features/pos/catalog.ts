export const productCategories = ["Café", "Bebidas", "Alimentos"] as const;
export type Category = (typeof productCategories)[number];
export type RecipeLine = { supplyId: string; quantity: number };
export type Presentation = { id: string; size: string; price: number; packageId: string; recipe: RecipeLine[] };
export type MenuItem = {
  id: string; name: string; category: Category; visible: boolean;
  illustration: "latte" | "americano" | "chai" | "muffin"; variants: Presentation[];
};
export type Product = Presentation & Pick<MenuItem, "name" | "category" | "illustration"> & { itemId: string };
export type TicketLine = { product: Product; quantity: number; takeaway: number };

const coffee = { supplyId: "coffee", quantity: 18 };
export const initialMenu: MenuItem[] = [
  { id: "latte", name: "Latte", category: "Café", visible: true, illustration: "latte", variants: [
    { id: "small-latte", size: "Chico · 12 oz", price: 6500, packageId: "smallCup", recipe: [coffee, { supplyId: "milk", quantity: 180 }] },
    { id: "large-latte", size: "Grande · 16 oz", price: 7500, packageId: "largeCup", recipe: [coffee, { supplyId: "milk", quantity: 240 }] },
  ] },
  { id: "americano", name: "Americano", category: "Café", visible: true, illustration: "americano", variants: [
    { id: "americano", size: "Regular", price: 4500, packageId: "smallCup", recipe: [coffee] },
  ] },
  { id: "chai", name: "Chai latte", category: "Bebidas", visible: true, illustration: "chai", variants: [
    { id: "chai", size: "Regular", price: 6800, packageId: "smallCup", recipe: [{ supplyId: "chai", quantity: 35 }, { supplyId: "milk", quantity: 200 }] },
  ] },
  { id: "muffin", name: "Muffin de chocolate", category: "Alimentos", visible: true, illustration: "muffin", variants: [
    { id: "muffin", size: "Pieza", price: 4200, packageId: "tray", recipe: [{ supplyId: "muffin", quantity: 1 }] },
  ] },
];

export function saleProducts(menu: MenuItem[]): Product[] {
  return menu.filter(item => item.visible).flatMap(item => item.variants.map(variant => ({
    ...variant, itemId: item.id, name: item.name, category: item.category, illustration: item.illustration,
  })));
}
