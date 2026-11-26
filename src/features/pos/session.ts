import { initialMenu, saleProducts, type MenuItem, type Product, type TicketLine } from "./catalog";
import { consumeSale, initialInventory, roundStock, type StockMovement, type Supply } from "./inventory";
import { emptyPayment, quotePayment, type Payment } from "./payment";
import { sampleMembers, type PosMember } from "./members";
import { newShift, sampleSales, sampleShift, type Movement } from "./shift";

export type Sale = {
  ticket: string; time: string; method: Payment["method"]; total: number; cash: number;
  voucher: string; lines: TicketLine[]; memberNumber: string | null;
};
type Draft = { lines: TicketLine[]; payment: Payment; memberNumber: string | null };
const emptyDraft: Draft = { lines: [], payment: emptyPayment, memberNumber: null };

export type Cashier = { id: string; name: string; username: string; active: boolean };
const sampleTeam: Cashier[] = [{ id: "ana", name: sampleShift.cashier, username: "ana.l", active: true }];
export const initialState = {
  draft: emptyDraft, sales: sampleSales, notice: "", members: sampleMembers, shift: sampleShift,
  menu: initialMenu, inventory: initialInventory, stockMovements: [] as StockMovement[], team: sampleTeam,
};
export type Session = typeof initialState;
type Action =
  | { type: "saveItem"; item: MenuItem }
  | { type: "saveSupply"; supply: Supply }
  | { type: "adjustStock"; movement: StockMovement }
  | { type: "saveCashier"; cashier: Cashier }
  | { type: "quantity"; product: Product; delta: 1 | -1 }
  | { type: "takeaway"; id: string; count: number }
  | { type: "payment"; payment: Payment }
  | { type: "clear" }
  | { type: "register"; member: PosMember }
  | { type: "associate"; number: string | null }
  | { type: "open"; amount: number; time: string }
  | { type: "move"; movement: Movement }
  | { type: "close"; counted: number; time: string }
  | { type: "confirm"; time: string };

export function ticketTotal(lines: TicketLine[]) {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

export function nextTicketNumber(sales: Sale[]) {
  return String(Number(sales[0]?.ticket ?? 0) + 1).padStart(4, "0");
}

function replaceById<T extends { id: string }>(items: T[], updated: T) {
  return items.some(item => item.id === updated.id)
    ? items.map(item => item.id === updated.id ? updated : item) : [...items, updated];
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
    case "saveItem": {
      const menu = replaceById(state.menu, action.item);
      if (!draft.lines.some(line => line.product.itemId === action.item.id)) return { ...state, menu };
      const variants = saleProducts([action.item]);
      const lines = draft.lines.flatMap(line => {
        if (line.product.itemId !== action.item.id) return [line];
        const product = variants.find(item => item.id === line.product.id);
        return product ? [{ ...line, product }] : [];
      });
      return { ...state, menu, draft: { ...draft, lines, payment: emptyPayment }, notice: "El menú cambió. Revisa el ticket antes de cobrar." };
    }
    case "saveSupply": return { ...state, inventory: replaceById(state.inventory, action.supply) };
    case "saveCashier": return { ...state, team: replaceById(state.team, action.cashier) };
    case "adjustStock": {
      const move = action.movement;
      const inventory = state.inventory.map(supply => {
        if (supply.id !== move.supplyId) return supply;
        const stock = move.kind === "Conteo" ? move.quantity : supply.stock + (move.kind === "Compra" ? move.quantity : -move.quantity);
        return { ...supply, stock: roundStock(stock) };
      });
      return { ...state, inventory, stockMovements: [move, ...state.stockMovements] };
    }
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
    case "open":
      if (!state.shift.close || action.amount < 0 || !Number.isSafeInteger(action.amount)) return state;
      return { ...state, shift: newShift(action.amount, action.time, sales.length, state.shift.cashier) };
    case "move":
      if (state.shift.close || action.movement.amount <= 0 || !Number.isSafeInteger(action.movement.amount) || !action.movement.reason.trim()) return state;
      return { ...state, shift: { ...state.shift, movements: [action.movement, ...state.shift.movements] } };
    case "close":
      if (state.shift.close || action.counted < 0 || !Number.isSafeInteger(action.counted)) return state;
      return { ...state, shift: { ...state.shift, close: { counted: action.counted, time: action.time } } };
    case "confirm": {
      const total = ticketTotal(draft.lines);
      const { valid, cash } = quotePayment(draft.payment, total);
      if (!total || !valid || state.shift.close) return state;
      const voucher = cash < total ? draft.payment.voucher.trim() : "";
      if (cash < total && !voucher) return state;
      if (voucher && sales.some(sale => sale.voucher === voucher)) return { ...state, notice: "Ese voucher ya se usó en otra venta simulada." };
      const ticket = nextTicketNumber(sales);
      const sale = { ticket, time: action.time, method: draft.payment.method, total, cash, voucher, lines: draft.lines, memberNumber: draft.memberNumber };
      const stamps = draft.lines.reduce((count, line) => count + (line.product.category === "Alimentos" ? 0 : line.quantity), 0);
      const members = state.members.map(member => member.number === draft.memberNumber ? { ...member, stamps: member.stamps + stamps } : member);
      return { ...state, members, inventory: consumeSale(state.inventory, draft.lines), sales: [sale, ...sales], draft: emptyDraft, notice: `Venta simulada ${ticket} confirmada.` };
    }
  }
}
