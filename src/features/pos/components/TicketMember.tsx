import { ChevronDown, ScanLine, UserRound } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { sampleMembers } from "../members";
import { useStaffSession } from "../StaffSession";

export function TicketMember() {
  const { state, dispatch } = useStaffSession();
  const member = state.members.find(item => item.number === state.draft.memberNumber);
  if (member) return <div className="flex flex-wrap items-center justify-between gap-x-2 border-b border-border">
    <p className="min-w-0 font-semibold wrap-anywhere"><span className="sr-only">Miembro del ticket: </span>{member.name} · Nº {member.number}</p>
    <button type="button" className="min-h-11 cursor-pointer px-2 text-primary underline" aria-label="Quitar miembro"
      onClick={() => dispatch({ type: "associate", number: null })}>Quitar</button>
  </div>;

  return <details className="group border-b border-border">
    <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold text-primary">
      <UserRound size={16} aria-hidden="true" /> Añadir miembro
      <ChevronDown size={16} aria-hidden="true" className="ml-auto group-open:rotate-180" />
    </summary>
    <div className="grid gap-2 pb-3">
      <Link className="staff-secondary-button" to={paths.posMembers}>Buscar miembro</Link>
      <Link className="staff-secondary-button" to={`${paths.posMembers}?tarjeta=${sampleMembers[0].number}`}>
        <ScanLine aria-hidden="true" size={16} /> Simular escaneo de QR
      </Link>
    </div>
  </details>;
}
