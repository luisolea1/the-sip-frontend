import { formatMoney } from "@/shared/utils/format-money";

export const methods = ["Efectivo", "Tarjeta", "Mixto"] as const;
export type Payment = { method: typeof methods[number]; amount: string; voucher: string };
export const emptyPayment: Payment = { method: "Efectivo", amount: "", voucher: "" };

export function parseCents(input: string) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(input)) return null;
  const cents = Math.round(Number(input) * 100);
  return Number.isSafeInteger(cents) ? cents : null;
}

export function quotePayment({ method, amount }: Payment, total: number) {
  if (method === "Tarjeta") return { valid: true, cash: 0, note: `Importe en terminal: ${formatMoney(total)}` };
  const cents = parseCents(amount);
  if (cents === null) return { valid: false, cash: 0, note: "Escribe un importe válido con hasta dos decimales." };
  if (method === "Mixto") {
    const valid = cents > 0 && cents < total;
    return { valid, cash: cents, note: valid ? `Parte en tarjeta: ${formatMoney(total - cents)}` : "La parte en efectivo debe ser mayor que cero y menor que el total." };
  }
  return { valid: cents >= total, cash: total, note: cents >= total ? `Cambio: ${formatMoney(cents - total)}` : `Faltan: ${formatMoney(total - cents)}` };
}
