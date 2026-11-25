import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/shared/utils/format-money";
import { useStaffSession } from "../StaffSession";
import { packaging } from "../packaging";
import { PaymentPreview } from "./PaymentPreview";
import { TicketMember } from "./TicketMember";

export function TicketPanel({ paymentNote }: { paymentNote: string }) {
  const { state, dispatch } = useStaffSession();
  const { lines } = state.draft;
  return (
    <section id="pos-ticket" aria-labelledby="pos-ticket-title" tabIndex={-1} className="staff-workspace-panel grid content-start gap-4">
      <header className="flex items-center gap-2 text-primary">
        <ShoppingBag size={20} aria-hidden="true" /><h2 id="pos-ticket-title">Ticket actual</h2>
      </header>
      <TicketMember />
      {lines.length === 0 ? <p className="rounded-xl bg-muted p-4">Añade un producto del menú para empezar.</p> :
        <ul className="divide-y divide-border">
          {lines.map(({ product, quantity, takeaway }) => <li key={product.id} className="grid gap-2 py-2">
            <p><strong>{product.name}</strong> · {product.size}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="pos-quantity-button" onClick={() => dispatch({ type: "quantity", product, delta: -1 })}
                aria-label={`Quitar una unidad de ${product.name}, ${product.size}`}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button type="button" className="pos-quantity-button" onClick={() => dispatch({ type: "quantity", product, delta: 1 })}
                aria-label={`Añadir una unidad de ${product.name}, ${product.size}`}><Plus size={16} /></button>
              <strong className="ml-auto">{formatMoney(quantity * product.price)}</strong>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="pos-category-button" aria-pressed={takeaway > 0}
                onClick={() => dispatch({ type: "takeaway", id: product.id, count: takeaway ? 0 : 1 })}>Para llevar</button>
              {takeaway > 0 && <label>Unidades
                <input type="number" min="1" max={quantity} step="1" value={takeaway}
                  aria-label={`Unidades para llevar de ${product.name}, ${product.size}`}
                  className="ml-2 min-h-11 w-16 rounded-lg border border-border px-2"
                  onChange={event => {
                    const count = event.target.valueAsNumber;
                    if (Number.isInteger(count)) dispatch({ type: "takeaway", id: product.id, count });
                  }} />
              </label>}
            </div>
            {takeaway > 0 && <p>Empaque: {packaging[product.packageId].name} × {takeaway}</p>}
          </li>)}
        </ul>}
      {lines.length > 0 && <>
        <PaymentPreview note={paymentNote} />
        <button type="button" className="pos-category-button justify-self-start" onClick={() => dispatch({ type: "clear" })}>Vaciar ticket</button>
      </>}
    </section>
  );
}
