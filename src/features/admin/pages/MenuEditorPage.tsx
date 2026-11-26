import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { paths } from "@/app/paths";
import { productCategories, type Category, type MenuItem } from "@/features/pos/catalog";
import { parseCents } from "@/features/pos/payment";
import { useStaffSession } from "@/features/pos/StaffSession";
import { newVariant, VariantFields } from "../components/VariantFields";
import { SectionHeader } from "../components/SectionHeader";

export default function MenuEditorPage() {
  const { itemId } = useParams();
  const { state } = useStaffSession();
  const item = state.menu.find(product => product.id === itemId);
  if (!item && itemId !== "nuevo") return <p>Producto no encontrado. <Link to={paths.menu}>Volver al menú</Link></p>;
  return <MenuEditor key={itemId} item={item} />;
}

function MenuEditor({ item }: { item?: MenuItem }) {
  const { state, dispatch } = useStaffSession();
  const navigate = useNavigate();
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<Category>(item?.category ?? "Café");
  const [visible, setVisible] = useState(item?.visible ?? true);
  const [photo, setPhoto] = useState(item?.photo);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState(() => item?.variants.map(v => ({ ...v, price: (v.price / 100).toFixed(2) })) ?? [newVariant("smallCup")]);

  async function readPhoto(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) return setError("Elige una foto JPG, PNG o WebP de hasta 2 MB.");
    setReading(true);
    try {
      const image = await createImageBitmap(file);
      const scale = Math.min(1, 640 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();
      setPhoto(canvas.toDataURL("image/webp", .8));
      setError("");
    } catch { setError("No se pudo leer la imagen."); }
    finally { setReading(false); }
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const sizes = variants.map(v => v.size.trim().toLocaleLowerCase("es"));
    if (!name.trim() || sizes.includes("") || new Set(sizes).size !== sizes.length) return setError("Escribe un nombre y presentaciones distintas.");
    if (variants.some(v => (parseCents(v.price) ?? 0) <= 0)) return setError("Usa precios mayores que cero con hasta dos decimales.");
    dispatch({ type: "saveItem", item: { id: item?.id ?? crypto.randomUUID(), name: name.trim(), category, visible, photo,
      illustration: item?.illustration ?? (category === "Alimentos" ? "muffin" : category === "Bebidas" ? "chai" : "latte"),
      variants: variants.map(v => ({ ...v, size: v.size.trim(), price: parseCents(v.price)! })) } });
    navigate(paths.menu);
  }
  return <>
    <Link to={paths.menu} className="admin-text-action">← Volver al menú</Link>
    <SectionHeader title={item ? "Cada detalle cuenta." : "Dale lugar a un nuevo producto."} description="Define cómo aparece el producto en el punto de venta." />
    <div className="admin-editor-layout">
      <form className="admin-form" onSubmit={save}>
        <fieldset className="admin-fields"><legend>Información del producto</legend>
          <label>Nombre del producto<input required maxLength={70} value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Categoría<select value={category} onChange={e => setCategory(e.target.value as Category)}>{productCategories.map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Foto opcional · hasta 2 MB<input type="file" accept="image/png,image/jpeg,image/webp" disabled={reading} onChange={e => void readPhoto(e.target.files?.[0])} /></label>
          {photo && <div className="admin-actions"><img alt="Foto del producto" src={photo} width={64} height={64} /><button type="button" className="admin-text-action" onClick={() => setPhoto(undefined)}>Quitar foto</button></div>}
          <label className="admin-check"><input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} />Visible en el menú de caja</label>
        </fieldset>
        {variants.map((variant, index) => <VariantFields key={variant.id} variant={variant} index={index} supplies={state.inventory}
          change={next => setVariants(variants.map(v => v.id === next.id ? next : v))}
          remove={variants.length === 1 ? undefined : () => setVariants(variants.filter(v => v.id !== variant.id))} />)}
        <button type="button" className="staff-secondary-button justify-self-start" onClick={() => setVariants([...variants, newVariant(variants[0].packageId)])}>Agregar presentación</button>
        {error && <p role="alert">{error}</p>}
        <div className="admin-actions"><button className="admin-primary" disabled={reading}>Guardar producto</button><Link to={paths.menu} className="staff-secondary-button">Cancelar</Link></div>
      </form>
      <aside className="admin-note"><strong>Así se usa en caja</strong><p>Cada presentación tiene un precio. Sus insumos se descuentan al confirmar la venta; el empaque, solo por las unidades para llevar.</p></aside>
    </div>
  </>;
}
