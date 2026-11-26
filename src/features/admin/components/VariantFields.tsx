import type { Presentation } from "@/features/pos/catalog";
import type { Supply } from "@/features/pos/inventory";

export type VariantDraft = Omit<Presentation, "price"> & { price: string };
export function newVariant(packageId: string): VariantDraft {
  return { id: crypto.randomUUID(), size: "", price: "", packageId, recipe: [] };
}

type Props = { variant: VariantDraft; index: number; supplies: Supply[]; change: (variant: VariantDraft) => void; remove?: () => void };
export function VariantFields({ variant, index, supplies, change, remove }: Props) {
  const ingredients = supplies.filter(s => s.kind !== "Empaque");
  const nextIngredient = ingredients.find(s => !variant.recipe.some(row => row.supplyId === s.id));
  return <fieldset className="admin-fields">
    <legend>Presentación {index + 1}</legend>
    <div className="admin-field-grid">
      <label>Nombre de presentación<input required maxLength={50} value={variant.size} onChange={e => change({ ...variant, size: e.target.value })} /></label>
      <label>Precio en MXN<input type="number" inputMode="decimal" required min=".01" step=".01" value={variant.price}
        onChange={e => change({ ...variant, price: e.target.value })} /></label>
    </div>
    <label>Empaque para llevar<select value={variant.packageId} onChange={e => change({ ...variant, packageId: e.target.value })}>
      {supplies.filter(s => s.kind === "Empaque").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select></label>
    {variant.recipe.map((row, i) => {
      const supply = ingredients.find(s => s.id === row.supplyId)!;
      const update = (supplyId: string, quantity: number) => change({ ...variant, recipe: variant.recipe.map((r, j) => i === j ? { supplyId, quantity } : r) });
      return <div key={i} className="admin-recipe-row">
        <label>Insumo<select value={supply.id} onChange={e => update(e.target.value, 1)}>
          {ingredients.filter(s => s.id === supply.id || !variant.recipe.some(r => r.supplyId === s.id)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select></label>
        <label>Cantidad ({supply.unit})<input required type="number" min={supply.unit === "pzas." ? 1 : .001} step={supply.unit === "pzas." ? 1 : .001}
          value={row.quantity || ""} onChange={e => update(supply.id, Number(e.target.value))} /></label>
        <button type="button" className="admin-text-action" aria-label={`Quitar ${supply.name}`} onClick={() => change({ ...variant, recipe: variant.recipe.filter((_, j) => i !== j) })}>Quitar</button>
      </div>;
    })}
    <div className="admin-actions"><button type="button" className="staff-secondary-button" disabled={!nextIngredient} onClick={() => {
      if (nextIngredient) change({ ...variant, recipe: [...variant.recipe, { supplyId: nextIngredient.id, quantity: 1 }] });
    }}>Agregar insumo</button>
      {remove && <button type="button" className="admin-text-action" onClick={remove}>Quitar presentación</button>}
    </div>
  </fieldset>;
}
