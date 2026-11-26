import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/shared/utils/format-money";
import { StockOverview } from "../components/StockOverview";
import { useStaffSession } from "@/features/pos/StaffSession";
import { periods, periodSales, type Period } from "../preview-data";
import { SectionHeader } from "../components/SectionHeader";
import "../dashboard.css";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("today");
  const { state } = useStaffSession();
  const sales = periodSales(state.sales, period);
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);
  const counts = new Map<string, number>();
  for (const sale of sales) for (const { product, quantity } of sale.lines) counts.set(product.name, (counts.get(product.name) ?? 0) + quantity);
  const ranking = [...counts].sort((a, b) => b[1] - a[1]);
  const metrics = [
    { label: "Ventas del periodo", value: formatMoney(total) },
    { label: "Tickets", value: sales.length },
    { label: "Ticket promedio", value: formatMoney(sales.length ? Math.round(total / sales.length) : 0) },
    { label: "Unidades vendidas", value: ranking.reduce((sum, [, units]) => sum + units, 0) },
  ];

  return <>
    <SectionHeader title="Tu negocio, con perspectiva." description="Ventas confirmadas de Centro. Las ventas de prueba que hagas en caja se suman al día de hoy." />
    <section aria-labelledby="admin-summary-title" className="grid gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="admin-summary-title">Resumen de ventas</h2>
        <label className="flex items-center gap-2 font-semibold">Periodo
          <select className="min-h-11 rounded-xl border border-border px-3" value={period}
            onChange={event => setPeriod(event.target.value as Period)}>
            {Object.entries(periods).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
      </header>
      <dl className="admin-metric-grid">
        {metrics.map(({ label, value }) => <div key={label} className="staff-workspace-panel">
          <dt className="font-semibold">{label}</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-primary">{value}</dd>
        </div>)}
      </dl>
    </section>
    <div className="admin-detail-grid">
      <section className="staff-workspace-panel"><h2>Productos más vendidos</h2>
        <ol className="admin-ranking">{ranking.map(([name, units]) => <li key={name}><div><strong>{name}</strong><span>{units} uds.</span></div>
          <meter aria-label={`Unidades de ${name}`} min={0} max={ranking[0][1]} value={units} /></li>)}</ol>
      </section>
      <section aria-labelledby="admin-sales-title" className="staff-workspace-panel">
        <header className="mb-2 flex items-center gap-2">
          <ReceiptText size={20} aria-hidden="true" className="text-primary" />
          <h2 id="admin-sales-title">Ventas recientes</h2>
        </header>
        <ol className="divide-y divide-border">
          {sales.map(sale => <li key={sale.ticket} className="flex flex-wrap items-center justify-between gap-2 py-3">
            <div><strong>Ticket {sale.ticket}</strong><p>{sale.daysAgo === 0 ? "Hoy" : sale.daysAgo === 1 ? "Ayer" : `Hace ${sale.daysAgo} días`} · <time>{sale.time}</time> · {sale.method}</p></div>
             <strong>{formatMoney(sale.total)}</strong>
             <details className="basis-full"><summary className="admin-text-action">Detalle del ticket {sale.ticket}</summary>{sale.lines.map((line, i) =>
               <p key={i}>{line.quantity} × {line.product.name} · {line.product.size} · {formatMoney(line.product.price)} c/u</p>)}</details>
          </li>)}
        </ol>
      </section>
      <StockOverview />
    </div>
  </>;
}
