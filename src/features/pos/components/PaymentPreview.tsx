import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { formatMoney } from "@/shared/utils/format-money";

const methods = ["Efectivo", "Tarjeta", "Mixto"] as const;

function describeCash(amount: string, total: number, mixed: boolean) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(amount)) return "Escribe un importe válido con hasta dos decimales.";
  const cash = Math.round(Number(amount) * 100);
  if (!Number.isSafeInteger(cash)) return "El importe es demasiado grande.";
  if (mixed) {
    if (cash <= 0 || cash >= total) return "La parte en efectivo debe ser mayor que cero y menor que el total.";
    return `Parte en tarjeta: ${formatMoney(total - cash)}`;
  }
  return cash >= total ? `Cambio: ${formatMoney(cash - total)}` : `Faltan: ${formatMoney(total - cash)}`;
}

export function PaymentPreview({ total }: { total: number }) {
  const [method, setMethod] = useState<(typeof methods)[number]>("Efectivo");
  const [amount, setAmount] = useState("");
  return (
    <fieldset className="grid min-w-0 gap-3 border-t border-border pt-3">
      <legend className="pr-2 font-semibold">Medio de pago</legend>
      <div className="flex flex-wrap gap-2">
        {methods.map(item => <label key={item} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-muted px-2.5">
          <input type="radio" name="payment" className="accent-primary" checked={method === item}
            onChange={() => { setMethod(item); setAmount(""); }} /> {item}
        </label>)}
      </div>
      {method === "Tarjeta" ? <p>Importe en terminal: <strong>{formatMoney(total)}</strong></p> : <>
        <label htmlFor="pos-cash">{method === "Mixto" ? "Parte en efectivo" : "Efectivo recibido"}</label>
        <Input id="pos-cash" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00"
          value={amount} onChange={event => setAmount(event.target.value)} />
        <output htmlFor="pos-cash" className="rounded-xl bg-muted p-3">
          {amount ? describeCash(amount, total, method === "Mixto") : "Escribe el importe en efectivo."}
        </output>
      </>}
    </fieldset>
  );
}
