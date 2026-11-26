import { useState } from "react";
import { useSearchParams } from "react-router";
import { useStaffSession } from "@/features/pos/StaffSession";
import { needsRestock } from "@/features/pos/inventory";
import { SectionHeader } from "../components/SectionHeader";
import { StockMovementForm, SupplyForm } from "../components/StockForm";

export default function InventoryPage() {
  const { state } = useStaffSession();
  const [params, setParams] = useSearchParams();
  const moveId = params.get("movimiento");
  const [editor, setEditor] = useState<string | null>(null);
  const close = () => { setEditor(null); setParams({}); };
  const moving = state.inventory.find(s => s.id === moveId);
  const editing = state.inventory.find(s => s.id === editor);
  return <>
    <SectionHeader title="Lo que hay, a la vista." description="Existencias registradas de Centro. El conteo físico permite comprobarlas.">
      <div className="admin-actions"><button className="staff-secondary-button" onClick={() => { setParams({}); setEditor("new"); }}>Agregar insumo</button>
        <button className="admin-primary" onClick={() => { setEditor(null); setParams({ movimiento: state.inventory[0].id }); }}>Registrar movimiento</button></div>
    </SectionHeader>
    {moving ? <StockMovementForm key={moving.id} initialId={moving.id} close={close} /> : editor && <SupplyForm key={editor} supply={editing} close={close} />}
    <ul className="admin-list">{state.inventory.map(s => <li key={s.id} className="admin-stock-row">
      <div><strong>{s.name}</strong><p>{s.kind}</p></div>
      <div><small>Disponible</small><strong>{s.stock} {s.unit}</strong></div>
      <div><small>Mínimo</small><span>{s.minimum} {s.unit}</span></div>
      <span className={needsRestock(s) ? "admin-warning" : "admin-positive"}>{needsRestock(s) ? "Reponer" : "Suficiente"}</span>
      <button className="admin-text-action" aria-label={`Configurar ${s.name}`} onClick={() => { setParams({}); setEditor(s.id); }}>Configurar</button>
    </li>)}</ul>
    <section className="staff-workspace-panel"><h3>Movimientos manuales de esta sesión</h3>
      {!state.stockMovements.length ? <p>Aún no se han registrado compras, mermas ni conteos.</p> :
        <ol className="divide-y divide-border">{state.stockMovements.map(m => {
          const supply = state.inventory.find(s => s.id === m.supplyId)!;
          return <li key={m.id} className="py-2"><strong>{m.kind} · {supply.name}</strong><p>{m.quantity} {supply.unit} · {m.reason}</p></li>;
        })}</ol>}
    </section>
  </>;
}
