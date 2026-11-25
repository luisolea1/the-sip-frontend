import { ScanLine } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { sampleMembers } from "../members";
import { useStaffSession } from "../StaffSession";

export function TicketMember() {
  const { state, dispatch } = useStaffSession();
  const member = state.members.find(item => item.number === state.draft.memberNumber);
  return <section className="grid gap-2 rounded-xl border border-dashed border-border p-3">
    <h3 className="font-semibold">{member ? "Miembro del ticket" : "Agregar miembro"}</h3>
    {member ? <>
      <p>{member.name} · Nº {member.number}</p>
      <button type="button" className="staff-secondary-button" onClick={() => dispatch({ type: "associate", number: null })}>Quitar miembro</button>
    </> : <>
      <Link className="staff-secondary-button" to={paths.posMembers}>Buscar miembro</Link>
      <Link className="staff-secondary-button" to={`${paths.posMembers}?tarjeta=${sampleMembers[0].number}`}>
        <ScanLine aria-hidden="true" size={16} /> Simular escaneo de QR
      </Link>
    </>}
  </section>;
}
