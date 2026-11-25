import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/shared/utils/format-money";
import type { Product, TicketLine } from "../catalog";
import { PaymentPreview } from "./PaymentPreview";

type TicketProps = {
  lines: TicketLine[];
  total: number;
  onChange: (product: Product, delta: number) => void;
  onClear: () => void;
};

export function TicketPanel({ lines, total, onChange, onClear }: TicketProps) {
  return (
    <section id="pos-ticket" aria-labelledby="pos-ticket-title" tabIndex={-1} className="staff-workspace-panel grid content-start gap-4">
      <header className="flex items-center gap-2 text-primary">
        <ShoppingBag size={20} aria-hidden="true" /><h2 id="pos-ticket-title">Ticket actual</h2>
      </header>
      {lines.length === 0 ? <p className="rounded-xl bg-muted p-4">Añade un producto del menú para empezar.</p> :
        <ul className="divide-y divide-border">
          {lines.map(({ product, quantity }) => <li key={product.id} className="grid gap-2 py-2">
            <p><strong>{product.name}</strong> · {product.size}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="pos-quantity-button" onClick={() => onChange(product, -1)}
                aria-label={`Quitar una unidad de ${product.name}, ${product.size}`}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button type="button" className="pos-quantity-button" onClick={() => onChange(product, 1)}
                aria-label={`Añadir una unidad de ${product.name}, ${product.size}`}><Plus size={16} /></button>
              <strong className="ml-auto">{formatMoney(quantity * product.price)}</strong>
            </div>
          </li>)}
        </ul>}
      <p className="flex justify-between border-t border-border pt-4 text-lg font-bold" aria-live="polite">
        Total <span>{formatMoney(total)}</span>
      </p>
      {lines.length > 0 && <>
        <PaymentPreview total={total} />
        <button type="button" className="pos-category-button justify-self-start" onClick={onClear}>Vaciar ticket</button>
      </>}
    </section>
  );
}
