import { useState } from "react";
import { ChevronRight, Eye, Plus } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { productCategories } from "@/features/pos/catalog";
import { ProductIllustration } from "@/features/pos/components/ProductIllustration";
import { useStaffSession } from "@/features/pos/StaffSession";
import { formatMoney } from "@/shared/utils/format-money";
import { SectionHeader } from "../components/SectionHeader";

export default function MenuPage() {
  const { state } = useStaffSession();
  const [category, setCategory] = useState("Todo");
  const items = state.menu.filter(item => category === "Todo" || item.category === category);
  return <>
    <SectionHeader title="Tu menú, a tu manera." description="Lo que guardes como visible aparecerá en su categoría en caja.">
      <div className="admin-actions"><Link to={paths.sale} className="staff-secondary-button"><Eye size={16} />Vista de caja</Link>
        <Link className="admin-primary" to={`${paths.menu}/nuevo`}><Plus size={16} />Agregar producto</Link></div>
    </SectionHeader>
    <div className="admin-actions" role="group" aria-label="Categorías del menú">
      {["Todo", ...productCategories].map(value => <button key={value} className="admin-filter" aria-pressed={value === category}
        onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    {items.length ? <ul className="admin-list">{items.map(item => <li key={item.id} className="admin-menu-row">
      <span className="admin-thumbnail"><ProductIllustration kind={item.illustration} /></span>
      <div><strong>{item.name}</strong><p>{item.category} · {item.variants.length} {item.variants.length === 1 ? "presentación" : "presentaciones"}</p>
        <small className={item.visible ? "admin-positive" : "admin-chip"}>{item.visible ? "Visible en caja" : "Oculto"}</small></div>
      <div className="admin-price"><small>{item.variants.length > 1 ? "Desde" : "Precio"}</small><strong>{formatMoney(Math.min(...item.variants.map(v => v.price)))}</strong></div>
      <Link className="admin-text-action" aria-label={`Editar ${item.name}`} to={`${paths.menu}/${item.id}`}>Editar <ChevronRight size={16} /></Link>
    </li>)}</ul> : <div className="staff-workspace-panel"><p>Todavía no hay productos en esta categoría.</p><Link to={`${paths.menu}/nuevo`}>Agregar producto</Link></div>}
    <p className="admin-note">El menú se comparte con caja en esta pestaña. Al recargar se restablecen los datos de ejemplo.</p>
  </>;
}
