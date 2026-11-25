import type { Sale } from "./session";

const sampleCashier = "Ana López";
export type Movement = { kind: "entry" | "withdrawal"; amount: number; reason: string; time: string; operator: string };
export type Shift = {
  cashier: string;
  opened: string; opening: number; previousSales: number; movements: Movement[];
  close: { counted: number; time: string } | null;
};

export function newShift(opening: number, opened: string, previousSales: number, cashier: string): Shift {
  return { opening, opened, previousSales, cashier, movements: [], close: null };
}

export const sampleSales: Sale[] = [
  { ticket: "0058", time: "12:42", method: "Tarjeta", total: 14000, cash: 0, voucher: "00058", lines: [], memberNumber: null },
  { ticket: "0057", time: "12:35", method: "Efectivo", total: 8700, cash: 8700, voucher: "", lines: [], memberNumber: null },
  { ticket: "0056", time: "12:28", method: "Mixto", total: 11000, cash: 5000, voucher: "00056", lines: [], memberNumber: null },
  { ticket: "0055", time: "12:16", method: "Efectivo", total: 6500, cash: 6500, voucher: "", lines: [], memberNumber: null },
];

export const sampleShift: Shift = {
  ...newShift(50000, "08:00", 0, sampleCashier),
  movements: [
    { kind: "withdrawal", amount: 40000, time: "12:30", reason: "Retiro a resguardo", operator: sampleCashier },
    { kind: "entry", amount: 20000, time: "10:15", reason: "Fondo adicional", operator: sampleCashier },
  ],
};

export function shiftSummary(shift: Shift, sales: Sale[]) {
  const current = sales.slice(0, sales.length - shift.previousSales);
  const cash = current.reduce((sum, sale) => sum + sale.cash, 0);
  const card = current.reduce((sum, sale) => sum + sale.total - sale.cash, 0);
  const movementTotal = (kind: Movement["kind"]) => shift.movements.reduce((sum, move) =>
    sum + (move.kind === kind ? move.amount : 0), 0);
  const entries = movementTotal("entry");
  const withdrawals = movementTotal("withdrawal");
  return { cash, card, entries, withdrawals, tickets: current.length, expected: shift.opening + cash + entries - withdrawals };
}
