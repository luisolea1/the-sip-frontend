import { useState, type FormEvent } from "react";
import { type StockMovement, type Supply } from "@/features/pos/inventory";
import { useStaffSession } from "@/features/pos/StaffSession";

export function SupplyForm({ supply, close }: { supply?: Supply; close: () => void }) {
  const { state, dispatch } = useStaffSession();
  const [kind, setKind] = useState<Supply["kind"]>(supply?.kind ?? "Ingrediente");
  const [unit, setUnit] = useState<Supply["unit"]>(supply?.unit ?? "g");
  const [error, setError] = useState("");
  const step = unit === "pzas." ? 1 : .001;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    if (!name || state.inventory.some(s => s.id !== supply?.id && s.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"))) return setError("Usa un nombre único para este insumo.");
    dispatch({ type: "saveSupply", supply: { id: supply?.id ?? crypto.randomUUID(), name, kind, unit,
      stock: supply?.stock ?? Number(form.get("stock")), minimum: Number(form.get("minimum")) } });
    close();
  }
  return <form className="admin-form" onSubmit={save}><fieldset className="admin-fields">
    <legend>{supply ? "Configurar insumo" : "Agregar insumo"}</legend>
    <label>Nombre del insumo<input name="name" required maxLength={70} defaultValue={supply?.name} /></label>
    <div className="admin-field-grid">
      <label>Tipo<select disabled={!!supply} value={kind} onChange={e => {
        const next = e.target.value as Supply["kind"]; setKind(next); setUnit(next === "Ingrediente" ? "g" : "pzas.");
      }}>{["Ingrediente", "Empaque", "Producto terminado"].map(k => <option key={k}>{k}</option>)}</select></label>
      <label>Unidad<select disabled={!!supply || kind !== "Ingrediente"} value={unit} onChange={e => setUnit(e.target.value as Supply["unit"])}>
        {(kind === "Ingrediente" ? ["g", "ml", "pzas."] : ["pzas."]).map(u => <option key={u}>{u}</option>)}</select></label>
    </div>
    {!supply && <label>Existencia inicial<input name="stock" type="number" required min="0" step={step} defaultValue="0" /></label>}
    <label>Mínimo de reposición<input name="minimum" type="number" required min="0" step={step} defaultValue={supply?.minimum ?? 0} /></label>
    {error && <p role="alert">{error}</p>}
    <div className="admin-actions"><button className="admin-primary">Guardar insumo</button><button type="button" className="staff-secondary-button" onClick={close}>Cancelar</button></div>
  </fieldset></form>;
}

export function StockMovementForm({ initialId, close }: { initialId: string; close: () => void }) {
  const { state, dispatch } = useStaffSession();
  const [id, setId] = useState(initialId);
  const [kind, setKind] = useState<StockMovement["kind"]>("Compra");
  const supply = state.inventory.find(s => s.id === id)!;
  const step = supply.unit === "pzas." ? 1 : .001;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch({ type: "adjustStock", movement: { id: crypto.randomUUID(), supplyId: id, kind,
      reason: String(data.get("reason")).trim(), quantity: Number(data.get("quantity")) } });
    close();
  }
  return <form className="admin-form" onSubmit={save}><fieldset className="admin-fields"><legend>Registrar movimiento</legend>
    <label>Insumo<select value={id} onChange={e => setId(e.target.value)}>{state.inventory.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <label>Movimiento<select value={kind} onChange={e => setKind(e.target.value as StockMovement["kind"])}>{["Compra", "Merma", "Conteo"].map(k => <option key={k}>{k}</option>)}</select></label>
    <label>{kind === "Conteo" ? "Existencia contada" : "Cantidad"} ({supply.unit})<input name="quantity" type="number" required step={step} min={kind === "Conteo" ? 0 : step} /></label>
    <label>Motivo<input required pattern=".*\S.*" maxLength={120} name="reason" /></label>
    <div className="admin-actions"><button className="admin-primary">Aplicar movimiento</button><button type="button" className="staff-secondary-button" onClick={close}>Cancelar</button></div>
  </fieldset></form>;
}
