import { Coffee, Gift } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { Input } from "@/shared/components/ui/input";
import { NewPosMember } from "../components/NewPosMember";
import { searchMembers } from "../members";
import { useStaffSession } from "../StaffSession";

export default function PosMembersPage() {
  const { state, dispatch } = useStaffSession();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(params.get("tarjeta") ?? "");
  const [creating, setCreating] = useState(false);
  const visible = searchMembers(state.members, search);
  const member = search.trim() && visible.length === 1 ? visible[0] : undefined;
  const earned = Math.floor((member?.stamps ?? 0) / 10);
  const progress = member?.stamps && member.stamps % 10 === 0 ? 10 : (member?.stamps ?? 0) % 10;

  return <>
    <AreaIntroduction title="Miembros" description="Cada visita cuenta. Busca una tarjeta para asociarla al ticket actual." />
    <div className="flex flex-wrap items-end gap-3">
      <label className="min-w-0 flex-1 font-semibold">Buscar por correo o número de miembro
        <Input type="search" placeholder="Ej. maria@example.com o 01725" value={search} onChange={event => setSearch(event.target.value)} />
      </label>
      <button type="button" className="staff-secondary-button" aria-expanded={creating} onClick={() => setCreating(!creating)}>
        {creating ? "Cancelar alta" : "Nuevo miembro"}
      </button>
    </div>
    {creating && <NewPosMember onCreated={number => { setCreating(false); setSearch(number); }} />}
    <div className="grid min-w-0 items-start gap-4 md:grid-cols-2">
      <section className="staff-workspace-panel grid gap-3" aria-labelledby="pos-members-results">
        <h2 id="pos-members-results">Tus miembros</h2>
        {!search.trim() && <p>Busca por correo o número, o selecciona un miembro de la lista.</p>}
        {!visible.length && <p role="status">No se encontraron miembros.</p>}
        {visible.map(item => <button type="button" key={item.number} aria-pressed={item.number === member?.number}
          className="staff-secondary-button flex-wrap justify-between break-words aria-pressed:bg-accent"
          onClick={() => setSearch(item.number)}>{item.name} · Nº {item.number}</button>)}
      </section>
      {member && <section aria-label="Tarjeta seleccionada" className="grid gap-3">
        <div className="grid min-w-0 gap-4 rounded-3xl bg-gradient-to-br from-primary to-[#430705] p-5 text-white">
          <strong>THE SIP</strong><h2 className="break-words">{member.name}</h2>
          <p>Tarjeta Nº {member.number}</p>
          <div aria-hidden="true" className="grid grid-cols-5 justify-items-center gap-2">
            {Array.from({ length: 10 }, (_, index) => {
              const Icon = index === 9 ? Gift : Coffee;
              return <Icon key={index} size={30} className={`rounded-full border p-1.5 ${index < progress ? "bg-white text-primary" : "opacity-70"}`} />;
            })}
          </div>
          <p>{progress} / 10 cafés{earned > 0 && ` · Recompensas acumuladas: ${earned}`}</p>
        </div>
        <button type="button" className="staff-primary-button" onClick={() => {
          dispatch({ type: "associate", number: member.number });
          navigate(paths.sale);
        }}>Usar en esta venta</button>
      </section>}
    </div>
  </>;
}
