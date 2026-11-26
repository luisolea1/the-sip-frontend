import { useState } from "react";
import { formatMoney } from "@/shared/utils/format-money";
import { StockOverview } from "../components/StockOverview";
import { useStaffSession } from "@/features/pos/StaffSession";
import { periods, periodSales, saleHistory, type Period } from "../preview-data";
import { SectionHeader } from "../components/SectionHeader";
import { SalesChart } from "../components/SalesChart";
import { hourlyTickets, monthlyRevenue } from "../sales-series";
import { rankProducts } from "../product-ranking";
import "../dashboard.css";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("today");
  const { state } = useStaffSession();
  const history = saleHistory(state.sales);
  const sales = periodSales(history, period);
  const revenue = monthlyRevenue(history);
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);
  const ranking = rankProducts(sales);
  const metrics = [
    { label: "Ventas del periodo", value: formatMoney(total) },
    { label: "Tickets", value: sales.length },
    { label: "Ticket promedio", value: formatMoney(sales.length ? Math.round(total / sales.length) : 0) },
    { label: "Unidades vendidas", value: ranking.reduce((sum, product) => sum + product.units, 0) },
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
      <SalesChart title="Así van tus ventas" subtitle={`Ventas semanales · ${revenue.month} · MXN`}
        groups={revenue.weeks} metric="revenue" defaultIndex={revenue.currentWeek} />
      <SalesChart key={period} title="Tu momento más concurrido" subtitle={`Tickets de 07:00 a 20:00 · ${periods[period]}`}
        groups={hourlyTickets(sales)} metric="tickets" />
    </div>
    <div className="admin-detail-grid">
      <section aria-labelledby="admin-favorites-title" className="staff-workspace-panel shadow-none">
        <h2 id="admin-favorites-title">Los favoritos del periodo</h2>
        <p className="mt-1 text-muted-foreground">Productos ordenados por unidades vendidas · MXN</p>
        {ranking.length ? <ol className="admin-ranking">{ranking.map((product, index) => <li key={product.id}>
          <span aria-hidden="true" className="text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0 wrap-anywhere"><strong>{product.name}</strong>
            <p className="text-muted-foreground">{product.units} {product.units === 1 ? "unidad" : "unidades"}</p></div>
          <strong className="text-right">{formatMoney(product.revenue)}</strong>
        </li>)}</ol> : <p className="mt-4">No hay productos vendidos en este periodo.</p>}
      </section>
      <StockOverview />
    </div>
  </>;
}
