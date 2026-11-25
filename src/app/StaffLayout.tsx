import { LayoutDashboard, Store } from "lucide-react";
import { Suspense } from "react";
import { Outlet, useMatch } from "react-router";
import { paths } from "./paths";
import { ContentSkeleton } from "@/shared/components/ContentSkeleton";
import { DashboardSkeleton } from "@/features/admin/components/DashboardSkeleton";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { PosNavigation } from "@/features/pos/components/PosNavigation";

export function StaffLayout() {
  const isAdmin = !!useMatch(paths.admin);
  const isSale = !!useMatch(paths.sale);
  const Icon = isAdmin ? LayoutDashboard : Store;
  const content = <>
      <a href="#staff-content" className="sr-only focus:not-sr-only">Saltar al contenido</a>
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 bg-primary px-4 py-4 text-white sm:px-8">
        <span className="text-xl font-extrabold tracking-tight">THE SIP</span>
        <span className="flex items-center gap-2 border-l border-white/40 pl-4">
          <Icon aria-hidden="true" size={18} /> {isAdmin ? "Administración" : "Caja"}
        </span>
        {!isSale && <span className="ml-auto rounded-full border border-white/40 px-3 py-1 text-xs font-semibold">Vista previa</span>}
      </header>
      {!isAdmin && <PosNavigation />}
      <main id="staff-content" tabIndex={-1} className="grid min-w-0 gap-6 p-4 sm:p-6 lg:p-8">
        {isAdmin && <AreaIntroduction title="Administración" description="Sucursal Centro · Ventas e inventario con datos de ejemplo." />}
        <Suspense fallback={isAdmin ? <DashboardSkeleton /> : <ContentSkeleton label="Cargando operación de caja" />}>
          <Outlet />
        </Suspense>
      </main>
    </>;
  return (
    <div className={`staff-workspace ${isAdmin ? "admin-area-theme" : "pos-area-theme"} ${isSale ? "pos-sale-workspace" : ""}`}>
      <div className={isSale ? "pos-sale-scroll" : undefined}>{content}</div>
    </div>
  );
}
