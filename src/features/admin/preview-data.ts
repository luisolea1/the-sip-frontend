import { sampleLines } from "@/features/pos/shift";

export const salesByDay = {
  yesterday: [
    { ticket: "0054", time: "17:24", method: "Tarjeta", total: 7500, lines: sampleLines("large-latte") },
    { ticket: "0053", time: "17:08", method: "Efectivo", total: 13000, lines: sampleLines("small-latte", "small-latte") },
    { ticket: "0052", time: "16:48", method: "Tarjeta", total: 6800, lines: sampleLines("chai") },
  ],
};
