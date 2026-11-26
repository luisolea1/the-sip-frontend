import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { Ref } from "react";
import { formatMoney } from "@/shared/utils/format-money";
import { useStaffSession } from "../StaffSession";
import { nextTicketNumber } from "../session";
import { quotePayment } from "../payment";
import { CheckoutSummary } from "./CheckoutSummary";
import { PaymentPreview } from "./PaymentPreview";
import { TicketMember } from "./TicketMember";

export function TicketPanel({ total, ref }: { total: number; ref: Ref<HTMLElement> }) {
  const { state, dispatch } = useStaffSession();
  const { lines } = state.draft;
  const quote = quotePayment(state.draft.payment, total);
  return (
    <section ref={ref} id="pos-ticket" aria-labelledby="pos-ticket-title" tabIndex={-1} className="pos-ticket-panel">
      <header className="flex items-center justify-between gap-3">
        <div><h2 id="pos-ticket-title">Tu compra</h2><p className="text-sm text-muted-foreground">Orden #{nextTicketNumber(state.sales)}</p></div>
        <button type="button" className="pos-ticket-clear" aria-label="Vaciar ticket" title="Vaciar ticket" disabled={!lines.length}
          onClick={() => dispatch({ type: "clear" })}><Trash2 size={17} aria-hidden="true" /></button>
      </header>
      <div className="pos-ticket-body">
        <p className="text-sm text-muted-foreground">Marca los productos que sean para llevar.</p>
        <TicketMember />
        {lines.length === 0 ? <p className="pos-ticket-empty"><ShoppingBag size={18} aria-hidden="true" /><span>Aquí empieza<br /> tu próxima compra.</span></p> :
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
             {takeaway > 0 && <p>Empaque: {state.inventory.find(item => item.id === product.packageId)?.name} × {takeaway}</p>}
          </li>)}
        </ul>}
        {lines.length > 0 && <PaymentPreview note={quote.note} />}
      </div>
      <CheckoutSummary total={total} amountValid={quote.valid} />
    </section>
  );
}
