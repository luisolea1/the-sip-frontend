import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { formatMoney } from "@/shared/utils/format-money";
import { useStaffSession } from "../StaffSession";
import { ticketTotal } from "../session";
import { ProductCatalog } from "../components/ProductCatalog";
import { TicketPanel } from "../components/TicketPanel";
import "../sale.css";

export default function SalePage() {
  const { state, dispatch } = useStaffSession();
  const total = ticketTotal(state.draft.lines);

  return <>
    <AreaIntroduction title="Punto de venta" description="Sucursal Centro · Arma un ticket de ejemplo. No se realizan cobros." />
    <div className="pos-sale-layout">
      <ProductCatalog onAdd={product => dispatch({ type: "quantity", product, delta: 1 })} />
      <TicketPanel total={total} />
      <div className="pos-mobile-ticket-bar">
        <strong>Total · {formatMoney(total)}</strong>
        <a href="#pos-ticket" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-bold text-white no-underline">Ver ticket</a>
      </div>
    </div>
  </>;
}
