import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { StaffLayout } from "@/app/StaffLayout";
import { CheckoutSummary } from "../components/CheckoutSummary";
import { useStaffSession } from "../StaffSession";
import { ticketTotal } from "../session";
import { quotePayment } from "../payment";
import { ProductCatalog } from "../components/ProductCatalog";
import { TicketPanel } from "../components/TicketPanel";
import "../sale.css";

export default function SalePage() {
  const { state, dispatch } = useStaffSession();
  const total = ticketTotal(state.draft.lines);
  const quote = quotePayment(state.draft.payment, total);

  return <StaffLayout area="pos" footer={<CheckoutSummary total={total} amountValid={quote.valid} />}>
    <AreaIntroduction title="Punto de venta" description="Sucursal Centro · Arma un ticket de ejemplo. No se realizan cobros." />
    <div className="pos-sale-layout">
      <ProductCatalog onAdd={product => dispatch({ type: "quantity", product, delta: 1 })} />
      <TicketPanel paymentNote={quote.note} />
    </div>
  </StaffLayout>;
}
