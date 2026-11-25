import { StaffLayout } from "@/app/StaffLayout";
import { useEffect, useRef, useState } from "react";
import { formatMoney } from "@/shared/utils/format-money";
import { useStaffSession } from "../StaffSession";
import { ticketTotal } from "../session";
import { ProductCatalog } from "../components/ProductCatalog";
import { TicketPanel } from "../components/TicketPanel";
import "../sale.css";

export default function SalePage() {
  const { state, dispatch } = useStaffSession();
  const total = ticketTotal(state.draft.lines);
  const firstName = state.shift.cashier.trim().split(/\s+/)[0];
  const ticketRef = useRef<HTMLElement>(null);
  const [ticketVisible, setTicketVisible] = useState(false);
  useEffect(() => {
    const ticket = ticketRef.current;
    if (!ticket) return;
    const observer = new IntersectionObserver(([entry]) => setTicketVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -50% 0px",
    });
    observer.observe(ticket);
    return () => observer.disconnect();
  }, []);

  return <StaffLayout area="pos" showPreviewBadge={false} footer={<div className="pos-ticket-shortcut" hidden={ticketVisible}>
    <strong>Total · {formatMoney(total)}</strong><a href="#pos-ticket" className="staff-secondary-button">Ver compra</a>
  </div>}>
    <header className="pos-sale-heading">
      <title>Punto de venta | THE SIP</title>
      <h1>Hola, {firstName}.</h1>
      <p className="text-sm text-muted-foreground">Un nuevo día, un buen café.</p>
    </header>
    <div className="pos-sale-layout">
      <ProductCatalog onAdd={product => dispatch({ type: "quantity", product, delta: 1 })} />
      <TicketPanel ref={ticketRef} total={total} />
    </div>
  </StaffLayout>;
}
