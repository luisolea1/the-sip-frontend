import type { TicketLine } from "@/features/pos/catalog";

type RankedProduct = { id: string; name: string; units: number; revenue: number };

export function rankProducts(sales: { lines: TicketLine[] }[]) {
  const products = new Map<string, RankedProduct>();
  for (const sale of sales) {
    for (const { product, quantity } of sale.lines) {
      let entry = products.get(product.itemId);
      if (!entry) {
        entry = { id: product.itemId, name: product.name, units: 0, revenue: 0 };
        products.set(entry.id, entry);
      }
      entry.units += quantity;
      entry.revenue += quantity * product.price;
    }
  }
  return [...products.values()].sort((a, b) => b.units - a.units || a.name.localeCompare(b.name, "es"));
}
