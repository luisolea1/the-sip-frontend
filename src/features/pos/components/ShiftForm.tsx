import { useState, type FormEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { formatMoney } from "@/shared/utils/format-money";
import { currentTime, useStaffSession } from "../StaffSession";
import { parseCents } from "../payment";
import { cashier } from "../shift";

const actions = {
  open: { title: "Abrir turno", label: "Fondo inicial" },
  close: { title: "Confirmar corte", label: "Efectivo contado" },
  entry: { title: "Registrar entrada", label: "Importe de entrada" },
  withdrawal: { title: "Registrar retiro", label: "Importe de retiro" },
};
export type ShiftOperation = keyof typeof actions;

export function ShiftForm({ operation, expected, onDone }: { operation: ShiftOperation; expected: number; onDone: () => void }) {
  const { dispatch } = useStaffSession();
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const amount = parseCents(value);
  const moving = operation === "entry" || operation === "withdrawal";
  const valid = amount !== null && (!moving || (amount > 0 && reason.trim() !== ""));
  const { title, label } = actions[operation];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || amount === null) return;
    const time = currentTime();
    if (operation === "open") dispatch({ type: "open", amount, time });
    else if (operation === "close") dispatch({ type: "close", counted: amount, time });
    else dispatch({ type: "move", movement: { kind: operation, amount, time, reason: reason.trim(), operator: cashier } });
    onDone();
  }
  return <form aria-label={title} className="grid gap-3 rounded-2xl border border-border p-4" onSubmit={submit}>
    <label>{label}<Input autoFocus type="number" inputMode="decimal" min={moving ? "0.01" : "0"} step="0.01" required
      value={value} onChange={event => setValue(event.target.value)} /></label>
    {moving && <label>Motivo<Input required maxLength={120} value={reason} onChange={event => setReason(event.target.value)} /></label>}
    {operation === "close" && amount !== null && <output>Diferencia: {formatMoney(amount - expected)}</output>}
    <div className="flex flex-wrap gap-2">
      <button className="staff-primary-button" disabled={!valid}>{title}</button>
      <button type="button" className="staff-secondary-button" onClick={onDone}>Cancelar</button>
    </div>
  </form>;
}
