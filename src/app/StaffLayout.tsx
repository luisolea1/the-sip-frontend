import { LayoutDashboard, Store } from "lucide-react";
import { Outlet } from "react-router";
import { PosNavigation } from "@/features/pos/components/PosNavigation";

export function StaffLayout({ area }: { area: "pos" | "admin" }) {
  const isSale = area === "pos";
  const Icon = isSale ? Store : LayoutDashboard;
  return (
    <div className={`staff-workspace ${isSale ? "pos-area-theme" : "admin-area-theme"}`}>
      <a href="#staff-content" className="sr-only focus:not-sr-only">Saltar al contenido</a>
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 bg-primary px-4 py-4 text-white sm:px-8">
        <span className="text-xl font-extrabold tracking-tight">THE SIP</span>
        <span className="flex items-center gap-2 border-l border-white/40 pl-4">
          <Icon aria-hidden="true" size={18} /> {isSale ? "Caja" : "Administración"}
        </span>
        <span className="ml-auto rounded-full border border-white/40 px-3 py-1 text-xs font-semibold">Vista previa</span>
      </header>
      {isSale && <PosNavigation />}
      <main id="staff-content" tabIndex={-1} className="grid min-w-0 gap-6 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
