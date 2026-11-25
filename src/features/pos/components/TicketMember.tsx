import { ChevronDown, ScanLine } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { sampleMembers } from "../members";
import { useStaffSession } from "../StaffSession";

export function TicketMember() {
  const { state, dispatch } = useStaffSession();
  const member = state.members.find(item => item.number === state.draft.memberNumber);
  if (member) return <div className="pos-ticket-member flex flex-wrap items-center justify-between gap-x-2">
    <p className="min-w-0 font-semibold wrap-anywhere"><span className="sr-only">Miembro del ticket: </span>{member.name} · Nº {member.number}</p>
    <button type="button" className="min-h-11 cursor-pointer px-2 text-primary underline" aria-label="Quitar miembro"
      onClick={() => dispatch({ type: "associate", number: null })}>Quitar</button>
  </div>;

  return <details className="pos-ticket-member group">
    <summary className="flex min-h-11 cursor-pointer items-center gap-2">
      <ScanLine size={17} aria-hidden="true" className="shrink-0" />
      <span className="grid gap-1"><strong>Agregar miembro</strong><span className="text-xs text-muted-foreground">Escanea su tarjeta de fidelidad.</span></span>
      <ChevronDown size={16} aria-hidden="true" className="ml-auto group-open:rotate-180" />
    </summary>
    <div className="grid gap-2 pt-2">
      <Link className="staff-secondary-button" to={paths.posMembers}>Buscar miembro</Link>
      <Link className="staff-secondary-button" to={`${paths.posMembers}?tarjeta=${sampleMembers[0].number}`}>
        <ScanLine aria-hidden="true" size={16} /> Simular escaneo de QR
      </Link>
    </div>
  </details>;
}
