import { useState } from "react";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { formatMoney } from "@/shared/utils/format-money";
import { useStaffSession } from "../StaffSession";
import { ShiftForm, type ShiftOperation } from "../components/ShiftForm";
import { cashier, shiftSummary } from "../shift";
import { packaging, type PackageId } from "../packaging";
import { availablePackages } from "../session";

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border py-2">
    <dt>{label}</dt><dd className="font-semibold">{value}</dd>
  </div>;
}

export default function ShiftPage() {
  const { state } = useStaffSession();
  const { shift } = state;
  const summary = shiftSummary(shift, state.sales);
  const [operation, setOperation] = useState<ShiftOperation | null>(null);
  return <>
    <AreaIntroduction title="Caja" description="Caja 01 · Sucursal Centro. Apertura, movimientos y corte del turno simulado." />
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="grid min-w-0 gap-4">
        <section className="staff-workspace-panel grid gap-3">
          <h2>{shift.close ? "Caja cerrada" : "Caja abierta"}</h2>
          <p>{cashier} · Apertura {shift.opened}</p>
          {shift.close && <dl>
            <Detail label="Hora de corte" value={shift.close.time} />
            <Detail label="Efectivo contado" value={formatMoney(shift.close.counted)} />
            <Detail label="Diferencia del corte" value={formatMoney(shift.close.counted - summary.expected)} />
          </dl>}
          <button type="button" className="staff-primary-button" onClick={() => setOperation(shift.close ? "open" : "close")}>
            {shift.close ? "Abrir nuevo turno" : "Hacer corte"}
          </button>
          {(operation === "open" || operation === "close") && <ShiftForm operation={operation} expected={summary.expected} onDone={() => setOperation(null)} />}
        </section>
        <section className="staff-workspace-panel grid gap-3" aria-labelledby="pos-drawer-title">
          <h2 id="pos-drawer-title">Efectivo esperado</h2>
          <p className="text-3xl font-bold">{formatMoney(summary.expected)}</p>
          <dl>
            <Detail label="Fondo inicial" value={formatMoney(shift.opening)} />
            <Detail label="Ventas en efectivo" value={formatMoney(summary.cash)} />
            <Detail label="Entradas adicionales" value={formatMoney(summary.entries)} />
            <Detail label="Retiros" value={formatMoney(-summary.withdrawals)} />
          </dl>
          {!shift.close && <div className="flex flex-wrap gap-2">
            <button type="button" className="staff-secondary-button" onClick={() => setOperation("entry")}>Entrada</button>
            <button type="button" className="staff-secondary-button" onClick={() => setOperation("withdrawal")}>Retiro</button>
          </div>}
          {(operation === "entry" || operation === "withdrawal") && <ShiftForm key={operation} operation={operation} expected={summary.expected} onDone={() => setOperation(null)} />}
        </section>
      </div>
      <div className="grid min-w-0 gap-4">
        <section className="staff-workspace-panel grid gap-2">
          <h2>Pagos con tarjeta</h2><strong className="text-2xl">{formatMoney(summary.card)}</strong>
          <p>Se cotejan con la terminal y no forman parte del efectivo esperado.</p>
        </section>
        <section className="staff-workspace-panel">
          <h2>En esta sesión</h2><dl className="mt-3">
            <Detail label="Tickets registrados" value={String(summary.tickets)} />
            <Detail label="Ventas registradas" value={formatMoney(summary.cash + summary.card)} />
          </dl>
        </section>
        <section className="staff-workspace-panel">
          <h2>Movimientos de la caja</h2>
          <ol className="mt-3 divide-y divide-border">
            {shift.movements.map((movement, index) => <li key={shift.movements.length - index} className="py-2">
              <div className="flex flex-wrap justify-between gap-2">
                <strong className="min-w-0 break-words">{movement.reason}</strong>
                <span>{movement.kind === "entry" ? "+" : "−"}{formatMoney(movement.amount)}</span>
              </div>
              <p>{movement.kind === "entry" ? "Entrada" : "Retiro"} · {movement.time} · {movement.operator}</p>
            </li>)}
            <li className="py-2"><strong>Apertura de caja · {formatMoney(shift.opening)}</strong><p>{shift.opened} · {cashier}</p></li>
          </ol>
        </section>
        <section className="staff-workspace-panel">
          <h2>Empaques disponibles</h2><dl className="mt-3">
            {(Object.keys(packaging) as PackageId[]).map(id => <Detail key={id} label={packaging[id].name} value={`${availablePackages(state.sales, id)} pzas.`} />)}
          </dl>
        </section>
      </div>
    </div>
  </>;
}
