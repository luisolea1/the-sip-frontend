import { Bell, BookOpen, ChartNoAxesCombined, Coffee, Package, Store, UsersRound } from "lucide-react";
import { Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { paths } from "@/app/paths";
import { useStaffSession } from "@/features/pos/StaffSession";
import { needsRestock } from "@/features/pos/inventory";
import { ContentSkeleton } from "@/shared/components/ContentSkeleton";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import "./dashboard.css";

const sections = [
  { path: paths.admin, title: "Resumen", icon: ChartNoAxesCombined },
  { path: paths.menu, title: "Menú", icon: BookOpen },
  { path: paths.inventory, title: "Existencias", icon: Package },
  { path: paths.alerts, title: "Avisos", icon: Bell },
  { path: paths.team, title: "Cajeros", icon: UsersRound },
];

export default function AdminWorkspace() {
  const { state } = useStaffSession();
  const { pathname } = useLocation();
  const alerts = state.inventory.filter(needsRestock).length;
  const section = sections.find(entry => entry.path !== paths.admin && pathname.startsWith(entry.path)) ?? sections[0];
  return <div className="staff-workspace admin-workspace">
    <title>{`${section.path === paths.admin ? "Administración" : `${section.title} · Administración`} | THE SIP`}</title>
    <a href="#admin-content" className="admin-skip-link">Saltar al contenido</a>
    <header className="admin-rail">
      <div className="admin-brand"><span><Coffee aria-hidden="true" /></span><div><strong>THE SIP</strong><small>Administración</small></div></div>
      <nav aria-label="Administración" className="admin-nav">
        {sections.map(({ path, title, icon: Icon }) => <NavLink key={path} end={path === paths.admin} to={path}>
          <Icon size={19} aria-hidden="true" /><span>{title}</span>
          {path === paths.alerts && alerts > 0 && <small aria-label={`${alerts} para reponer`}>{alerts}</small>}
        </NavLink>)}
      </nav>
      <small className="admin-rail-note">THE SIP · Centro</small>
    </header>
    <main id="admin-content" tabIndex={-1} className="admin-content">
      <header className="admin-welcome">
        <div><p className="admin-eyebrow">Administración · Centro</p><h1>Hola, Ana.</h1><p>Tu cafetería, en un solo lugar.</p></div>
        <Link className="staff-secondary-button" to={paths.sale}><Store size={18} />Abrir punto de venta</Link>
      </header>
      <Suspense fallback={section.path === paths.admin ? <DashboardSkeleton /> : <ContentSkeleton label={`Cargando ${section.title}`} />}>
        <Outlet />
      </Suspense>
    </main>
  </div>;
}
