import { useState } from "react";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { formatMoney } from "@/shared/utils/format-money";
import type { Product, TicketLine } from "../catalog";
import { ProductCatalog } from "../components/ProductCatalog";
import { TicketPanel } from "../components/TicketPanel";
import "../sale.css";

export default function SalePage() {
  const [lines, setLines] = useState<TicketLine[]>([]);
  const total = lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0);

  function changeQuantity(product: Product, delta: number) {
    setLines(current => {
      if (!current.some(line => line.product.id === product.id)) {
        return delta > 0 ? [...current, { product, quantity: delta }] : current;
      }
      return current.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + delta } : line)
        .filter(line => line.quantity > 0);
    });
  }

  return <>
    <AreaIntroduction title="Punto de venta" description="Sucursal Centro · Arma un ticket de ejemplo. No se realizan cobros." />
    <div className="pos-sale-layout">
      <ProductCatalog onAdd={product => changeQuantity(product, 1)} />
      <TicketPanel lines={lines} total={total} onChange={changeQuantity} onClear={() => setLines([])} />
      <div className="pos-mobile-ticket-bar">
        <strong>Total · {formatMoney(total)}</strong>
        <a href="#pos-ticket" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-bold text-white no-underline">Ver ticket</a>
      </div>
    </div>
  </>;
}
