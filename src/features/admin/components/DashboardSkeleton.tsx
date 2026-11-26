import "../dashboard.css";

export function DashboardSkeleton() {
  return <>
    <span className="sr-only" role="status">Cargando resumen de administración</span>
    <div aria-hidden="true" className="grid gap-4">
      <div className="flex min-h-11 items-center"><h2>Resumen de ventas</h2></div>
      <div className="admin-metric-grid">
        {["Ventas del periodo", "Tickets", "Ticket promedio", "Unidades vendidas"].map(label => <div key={label} className="staff-workspace-panel">
          <p className="font-semibold">{label}</p>
          <div className="mt-2 h-9 w-24 rounded-lg bg-muted" />
        </div>)}
      </div>
    </div>
    <div aria-hidden="true" className="admin-detail-grid">
      {["Ventas recientes", "Qué necesito comprar"].map(title => <div key={title} className="staff-workspace-panel grid gap-3">
        <h2>{title}</h2>
        {[0, 1, 2, 3].map(row => <div key={row} className="h-11 rounded-lg bg-muted" />)}
      </div>)}
    </div>
  </>;
}
