import { Link } from "react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { paths } from "@/app/paths";
import { formatMoney } from "@/shared/utils/format-money";
import { currentTime, useStaffSession } from "../StaffSession";

export function CheckoutSummary({ total, amountValid }: { total: number; amountValid: boolean }) {
  const { state, dispatch } = useStaffSession();
  const { payment } = state.draft;
  const missingVoucher = payment.method !== "Efectivo" && !payment.voucher.trim();
  const price = formatMoney(total);
  const actionClass = "pos-checkout-action";

  return <section aria-label="Resumen de cobro" className="pos-checkout-summary">
    {state.notice && <p role="status">{state.notice}</p>}
    <p className="flex justify-between border-b border-border pb-3 text-sm"><span>Subtotal</span>{price}</p>
    <p className="flex flex-wrap items-baseline justify-between gap-2 font-bold">Total
      <span><small className="mr-1 text-xs font-normal">MXN</small><strong aria-live="polite" className="text-2xl">{price}</strong></span>
    </p>
    {state.shift.close ? <Link className={actionClass} to={paths.shift}>Abrir turno</Link>
      : !total ? <button type="button" className={actionClass} disabled>Cobrar {price} <ArrowRight size={16} /></button>
      : !amountValid || missingVoucher ? <a className={actionClass} href={amountValid ? "#pos-voucher" : "#pos-cash"}>Cobrar {price} <ArrowRight size={16} /></a>
      : <button type="button" className={actionClass} onClick={() => dispatch({ type: "confirm", time: currentTime() })}>
        Confirmar venta simulada
      </button>}
    <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={16} aria-hidden="true" />Precios finales en pesos mexicanos</p>
  </section>;
}
