import { Store, UsersRound, Wallet } from "lucide-react";
import { NavLink } from "react-router";
import { paths } from "@/app/paths";

const tabs = [
  { to: paths.sale, label: "Venta", icon: Store },
  { to: paths.posMembers, label: "Miembros", icon: UsersRound },
  { to: paths.shift, label: "Caja", icon: Wallet },
];

export function PosNavigation() {
  return <nav aria-label="Operación de caja" className="flex flex-wrap gap-1 bg-primary px-2 pb-2 sm:px-6">
    {tabs.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}
      className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 font-semibold text-white no-underline aria-[current=page]:bg-white aria-[current=page]:text-primary focus-visible:outline-current">
      <Icon size={16} aria-hidden="true" />{label}
    </NavLink>)}
  </nav>;
}
