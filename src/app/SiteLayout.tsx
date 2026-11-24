import { NavLink, Outlet, useLocation } from "react-router";
import { paths } from "./paths";

const navigation = [
  { to: paths.registration, label: "Registro" },
  { to: paths.memberCard, label: "Mi tarjeta" },
  { to: paths.sale, label: "Caja" },
  { to: paths.owner, label: "Administración" },
];

export function SiteLayout() {
  const { pathname } = useLocation();
  const theme = pathname.startsWith("/caja/") ? "pos-area-theme"
    : pathname === paths.owner ? "" : "members-area-theme";

  return (
    <div className={`${theme} min-h-screen bg-muted text-foreground`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block">
        Saltar al contenido
      </a>
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 px-4 py-3">
          <span className="text-2xl font-bold tracking-wide">THE SIP</span>
          <nav aria-label="Áreas de THE SIP" className="flex flex-wrap gap-x-1">
            {navigation.map(({ to, label }) => (
              <NavLink key={to} to={to} className="app-area-navigation-link">{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
