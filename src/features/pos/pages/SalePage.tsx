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
    <header className="pos-sale-heading">
      <title>Punto de venta | THE SIP</title>
      <h1>Punto de venta</h1>
      <p className="font-semibold">Sucursal Centro</p>
      <p className="text-sm">Venta de ejemplo · No se realizan cobros.</p>
    </header>
    <div className="pos-sale-layout">
      <ProductCatalog onAdd={product => dispatch({ type: "quantity", product, delta: 1 })} />
      <TicketPanel paymentNote={quote.note} />
    </div>
  </StaffLayout>;
}
