import type { Product, TicketLine } from "./catalog";
import { packaging, type PackageId } from "./packaging";
import { emptyPayment, quotePayment, type Payment } from "./payment";
import { sampleMembers, type PosMember } from "./members";

export type Sale = {
  ticket: string; time: string; method: Payment["method"]; total: number; cash: number;
  voucher: string; lines: TicketLine[]; memberNumber: string | null;
};
type Draft = { lines: TicketLine[]; payment: Payment; memberNumber: string | null };
const emptyDraft: Draft = { lines: [], payment: emptyPayment, memberNumber: null };

export const initialState = { draft: emptyDraft, sales: [] as Sale[], notice: "", members: sampleMembers };
export type Session = typeof initialState;
type Action =
  | { type: "quantity"; product: Product; delta: 1 | -1 }
  | { type: "takeaway"; id: string; count: number }
  | { type: "payment"; payment: Payment }
  | { type: "clear" }
  | { type: "register"; member: PosMember }
  | { type: "associate"; number: string | null }
  | { type: "confirm"; time: string };

export function ticketTotal(lines: TicketLine[]) {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

export function availablePackages(sales: Sale[], id: PackageId) {
  return sales.reduce((stock, sale) => stock - sale.lines.reduce((used, line) =>
    used + (line.product.packageId === id ? line.takeaway : 0), 0), packaging[id].stock);
}

function changeQuantity(lines: TicketLine[], product: Product, delta: number) {
  if (!lines.some(line => line.product.id === product.id)) {
    return delta > 0 ? [...lines, { product, quantity: delta, takeaway: 0 }] : lines;
  }
  return lines.map(line => {
    if (line.product.id !== product.id) return line;
    const quantity = line.quantity + delta;
    return { ...line, quantity, takeaway: Math.min(line.takeaway, quantity) };
  }).filter(line => line.quantity > 0);
}

export function sessionReducer(state: Session, action: Action): Session {
  const { draft, sales } = state;
  switch (action.type) {
    case "quantity":
      return { ...state, notice: "", draft: { ...draft, lines: changeQuantity(draft.lines, action.product, action.delta) } };
    case "takeaway":
      return { ...state, draft: { ...draft, lines: draft.lines.map(line => line.product.id === action.id
        ? { ...line, takeaway: Math.max(0, Math.min(action.count, line.quantity)) } : line) } };
    case "payment": return { ...state, draft: { ...draft, payment: action.payment } };
    case "clear": return { ...state, draft: emptyDraft, notice: "" };
    case "register":
      if (state.members.some(member => member.email === action.member.email || member.number === action.member.number)) return state;
      return { ...state, members: [...state.members, action.member] };
    case "associate":
      return { ...state, notice: "", draft: { ...draft, memberNumber: action.number } };
    case "confirm": {
      const total = ticketTotal(draft.lines);
      const { valid, cash } = quotePayment(draft.payment, total);
      if (!total || !valid) return state;
      const voucher = cash < total ? draft.payment.voucher.trim() : "";
      if (cash < total && !voucher) return state;
      if (voucher && sales.some(sale => sale.voucher === voucher)) return { ...state, notice: "Ese voucher ya se usó en otra venta simulada." };
      const ticket = String(59 + sales.length).padStart(4, "0");
      const sale = { ticket, time: action.time, method: draft.payment.method, total, cash, voucher, lines: draft.lines, memberNumber: draft.memberNumber };
      const stamps = draft.lines.reduce((count, line) => count + (line.product.category === "Bebidas" ? line.quantity : 0), 0);
      const members = state.members.map(member => member.number === draft.memberNumber ? { ...member, stamps: member.stamps + stamps } : member);
      return { ...state, members, sales: [sale, ...sales], draft: emptyDraft, notice: `Venta simulada ${ticket} confirmada.` };
    }
  }
}
