import { Input } from "@/shared/components/ui/input";
import { emptyPayment, methods } from "../payment";
import { useStaffSession } from "../StaffSession";

export function PaymentPreview({ note }: { note: string }) {
  const { state, dispatch } = useStaffSession();
  const { payment } = state.draft;
  return (
    <fieldset className="grid min-w-0 gap-3 border-t border-border pt-3">
      <legend className="pr-2 font-semibold">Medio de pago</legend>
      <div className="flex flex-wrap gap-2">
        {methods.map(method => <label key={method} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-muted px-2.5">
          <input type="radio" name="payment" className="accent-primary" checked={method === payment.method}
            onChange={() => dispatch({ type: "payment", payment: { ...emptyPayment, method } })} /> {method}
        </label>)}
      </div>
      {payment.method !== "Tarjeta" && <>
        <label htmlFor="pos-cash">{payment.method === "Mixto" ? "Parte en efectivo" : "Efectivo recibido"}</label>
        <Input id="pos-cash" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00"
          value={payment.amount} onChange={event => dispatch({ type: "payment", payment: { ...payment, amount: event.target.value } })} />
      </>}
      <output className="rounded-xl bg-muted p-3">{note}</output>
      {payment.method !== "Efectivo" && <label>Voucher de ejemplo
        <Input id="pos-voucher" value={payment.voucher} onChange={event => dispatch({ type: "payment", payment: { ...payment, voucher: event.target.value } })} />
      </label>}
      {state.shift.close && <p>La caja está cerrada.</p>}
    </fieldset>
  );
}
