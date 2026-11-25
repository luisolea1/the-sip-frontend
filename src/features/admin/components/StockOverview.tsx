import { Package } from "lucide-react";
import { useState } from "react";
import { supplies } from "../preview-data";

export function StockOverview() {
  const [onlyLow, setOnlyLow] = useState(true);
  const visible = supplies.filter(item => !onlyLow || item.stock <= item.minimum);
  return (
    <section aria-labelledby="admin-stock-title" className="staff-workspace-panel">
      <header className="flex items-center gap-2">
        <Package size={20} className="shrink-0 text-primary" aria-hidden="true" />
        <h2 id="admin-stock-title">Qué necesito comprar</h2>
      </header>
      <p className="mt-1 text-muted-foreground">Existencias estimadas de la sucursal.</p>
      <label className="my-2 inline-flex min-h-11 items-center gap-2 font-semibold">
        <input type="checkbox" className="accent-primary" checked={onlyLow}
          onChange={event => setOnlyLow(event.target.checked)} /> Solo insumos por reponer
      </label>
      <ul className="divide-y divide-border">
        {visible.map(item => <li key={item.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div><strong>{item.name}</strong><p>Disponible: {item.stock} {item.unit} · Mínimo: {item.minimum} {item.unit}</p></div>
          <span className={item.stock <= item.minimum ? "admin-stock-alert" : "admin-stock-available"}>
            {item.stock <= item.minimum ? "Reponer" : "Suficiente"}
          </span>
        </li>)}
      </ul>
    </section>
  );
}
