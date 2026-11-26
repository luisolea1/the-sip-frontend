import { sampleLines } from "@/features/pos/shift";
import type { Sale } from "@/features/pos/session";

export const salesByDay = {
  yesterday: [
    { ticket: "0054", time: "17:24", method: "Tarjeta", total: 7500, lines: sampleLines("large-latte") },
    { ticket: "0053", time: "17:08", method: "Efectivo", total: 13000, lines: sampleLines("small-latte", "small-latte") },
    { ticket: "0052", time: "16:48", method: "Tarjeta", total: 6800, lines: sampleLines("chai") },
  ],
};

const earlierSales = [
  { daysAgo: 4, ticket: "0051", time: "09:10", method: "Efectivo", total: 11000, lines: sampleLines("small-latte", "americano") },
  { daysAgo: 12, ticket: "0050", time: "13:40", method: "Tarjeta", total: 8400, lines: sampleLines("muffin", "muffin") },
  { daysAgo: 19, ticket: "0049", time: "11:00", method: "Tarjeta", total: 6800, lines: sampleLines("chai") },
  { daysAgo: 24, ticket: "0048", time: "08:30", method: "Efectivo", total: 7500, lines: sampleLines("large-latte") },
];

export const periods = { today: "Hoy", yesterday: "Ayer", week: "Últimos 7 días", month: "Últimas 4 semanas" };
export type Period = keyof typeof periods;
export function periodSales(today: Sale[], period: Period) {
  const history = [...today.map(s => ({ ...s, daysAgo: 0 })), ...salesByDay.yesterday.map(s => ({ ...s, daysAgo: 1 })), ...earlierSales];
  return history.filter(sale => {
    if (period === "today" || period === "yesterday") return sale.daysAgo === (period === "today" ? 0 : 1);
    return sale.daysAgo < (period === "week" ? 7 : 28);
  });
}
