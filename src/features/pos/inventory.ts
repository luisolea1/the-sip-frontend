import type { TicketLine } from "./catalog";

export type Supply = {
  id: string; name: string; kind: "Ingrediente" | "Empaque" | "Producto terminado";
  unit: "g" | "ml" | "pzas."; stock: number; minimum: number;
};
export type StockMovement = { id: string; supplyId: string; kind: "Compra" | "Merma" | "Conteo"; quantity: number; reason: string };
export const initialInventory: Supply[] = [
  { id: "coffee", name: "Café en grano", kind: "Ingrediente", unit: "g", stock: 1500, minimum: 2000 },
  { id: "milk", name: "Leche entera", kind: "Ingrediente", unit: "ml", stock: 4000, minimum: 4000 },
  { id: "chai", name: "Concentrado de chai", kind: "Ingrediente", unit: "ml", stock: 1500, minimum: 500 },
  { id: "muffin", name: "Muffins", kind: "Producto terminado", unit: "pzas.", stock: 24, minimum: 6 },
  { id: "smallCup", name: "Vasos de 12 oz", kind: "Empaque", unit: "pzas.", stock: 85, minimum: 50 },
  { id: "largeCup", name: "Vasos de 16 oz", kind: "Empaque", unit: "pzas.", stock: 60, minimum: 30 },
  { id: "tray", name: "Charolas", kind: "Empaque", unit: "pzas.", stock: 36, minimum: 15 },
];

export const needsRestock = (supply: Supply) => supply.stock <= supply.minimum;
export const roundStock = (value: number) => Math.round(value * 1000) / 1000;

export function consumeSale(inventory: Supply[], lines: TicketLine[]): Supply[] {
  const used = new Map<string, number>();
  function add(id: string, quantity: number) { used.set(id, (used.get(id) ?? 0) + quantity); }
  for (const { product, quantity, takeaway } of lines) {
    for (const row of product.recipe) add(row.supplyId, row.quantity * quantity);
    add(product.packageId, takeaway);
  }
  return inventory.map(item => ({ ...item, stock: roundStock(item.stock - (used.get(item.id) ?? 0)) }));
}
