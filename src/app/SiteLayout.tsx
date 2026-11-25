import { NavLink, Outlet } from "react-router";
import { paths } from "./paths";

const memberNavigation = [
  { to: paths.registration, label: "Registro" },
  { to: paths.memberCard, label: "Mi tarjeta" },
];

export function SiteLayout() {
  return (
    <div className="members-area-theme min-h-screen bg-muted text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block">
        Saltar al contenido
      </a>
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 px-4 py-3">
          <span className="text-2xl font-bold tracking-wide">THE SIP</span>
          <nav aria-label="Portal de miembros" className="flex flex-wrap gap-x-1">
            {memberNavigation.map(({ to, label }) => (
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
