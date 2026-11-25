import { Link } from "react-router";
import { paths } from "@/app/paths";
import { formatMoney } from "@/shared/utils/format-money";
import { currentTime, useStaffSession } from "../StaffSession";

export function CheckoutSummary({ total, amountValid }: { total: number; amountValid: boolean }) {
  const { state, dispatch } = useStaffSession();
  const { payment } = state.draft;
  const missingVoucher = payment.method !== "Efectivo" && !payment.voucher.trim();
  const actionClass = "staff-primary-button inline-flex items-center justify-center no-underline";

  return <section aria-label="Resumen de cobro" className="pos-checkout-summary">
    {state.notice && <p role="status" className="basis-full">{state.notice}</p>}
    <p className="mr-auto grid"><span>Total</span><strong aria-live="polite" className="text-xl">{formatMoney(total)}</strong></p>
    {state.shift.close ? <Link className={actionClass} to={paths.shift}>Abrir turno</Link>
      : !total ? <a className="staff-secondary-button" href="#pos-ticket">Ver ticket</a>
      : !amountValid || missingVoucher ? <a className={actionClass} href={amountValid ? "#pos-voucher" : "#pos-cash"}>Ir al pago</a>
      : <button type="button" className={actionClass} onClick={() => dispatch({ type: "confirm", time: currentTime() })}>
        Confirmar venta simulada
      </button>}
  </section>;
}
