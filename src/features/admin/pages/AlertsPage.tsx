import { Link } from "react-router";
import { paths } from "@/app/paths";
import { useStaffSession } from "@/features/pos/StaffSession";
import { needsRestock } from "@/features/pos/inventory";
import { SectionHeader } from "../components/SectionHeader";

export default function AlertsPage() {
  const { state } = useStaffSession();
  const alerts = state.inventory.filter(needsRestock);
  return <>
    <SectionHeader title={alerts.length ? "Es momento de reponer." : "Todo está por encima del mínimo."} description="Avisos según las existencias y los mínimos que configuraste." />
    {alerts.length ? <ul className="admin-list">{alerts.map(s => <li className="admin-split-row" key={s.id}>
      <div><span className="admin-warning">Reponer</span><h3>{s.name}</h3><p>Disponible: {s.stock} {s.unit} · Mínimo: {s.minimum} {s.unit}</p></div>
      <Link className="staff-secondary-button" to={`${paths.inventory}?movimiento=${s.id}`}>Registrar reposición</Link>
    </li>)}</ul> : <p className="admin-note">No hay avisos de reposición activos.</p>}
  </>;
}
