import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { formatMoney } from "@/shared/utils/format-money";
import { productCategories, products, type Product } from "../catalog";
import { ProductIllustration } from "./ProductIllustration";

const categories = ["Todo", ...productCategories] as const;

export function ProductCatalog({ onAdd }: { onAdd: (product: Product) => void }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todo");
  const [query, setQuery] = useState("");
  const visible = products.filter(product =>
    (category === "Todo" || product.category === category) &&
    `${product.name} ${product.size}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es"))
  );
  return (
    <section id="pos-catalog" aria-labelledby="pos-catalog-title" className="grid min-w-0 content-start gap-4">
      <header className="grid gap-1">
        <h2 id="pos-catalog-title">¿Qué preparamos hoy?</h2>
        <p className="text-sm text-muted-foreground">Elige algo del menú para empezar.</p>
      </header>
      <div className="pos-catalog-tools">
        <label className="relative block">
          <span className="sr-only">Buscar en el menú</span>
          <Search aria-hidden="true" size={18} className="pointer-events-none absolute top-3.5 left-3" />
          <Input type="search" placeholder="Buscar en el menú" className="pl-10" value={query} onChange={event => setQuery(event.target.value)} />
        </label>
        <div role="group" aria-label="Categorías" className="flex flex-wrap gap-2">
          {categories.map(item => <button type="button" key={item} aria-pressed={category === item}
            className="pos-category-button" onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </div>
      <ul className="pos-product-grid">
        {visible.map(product => <li key={product.id}>
          <button type="button" className="pos-product-button" onClick={() => onAdd(product)}
            aria-label={`Añadir ${product.name}, ${product.size}, ${formatMoney(product.price)}`}>
            <span className="block rounded-xl bg-[#f2eee4]"><ProductIllustration kind={product.illustration} /></span>
            <span className="mt-2 block font-bold">{product.name}</span>
            <span className="text-muted-foreground">{product.size}</span>
            <span className="mt-2 flex items-center justify-between gap-1 font-semibold">
              {formatMoney(product.price)} <Plus size={24} className="rounded-full bg-accent p-1 text-primary" aria-hidden="true" />
            </span>
          </button>
        </li>)}
      </ul>
      {visible.length === 0 && <p role="status">No hay productos que coincidan con la búsqueda.</p>}
    </section>
  );
}
