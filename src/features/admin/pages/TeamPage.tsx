import { useState, type FormEvent } from "react";
import { useStaffSession } from "@/features/pos/StaffSession";
import { SectionHeader } from "../components/SectionHeader";

export default function TeamPage() {
  const { state, dispatch } = useStaffSession();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username")).trim().toLowerCase();
    if (state.team.some(c => c.username === username)) return setError("Ese usuario ya pertenece al equipo.");
    dispatch({ type: "saveCashier", cashier: { id: crypto.randomUUID(), name: String(data.get("name")).trim(), username, active: true } });
    setAdding(false);
  }
  return <>
    <SectionHeader title="Tu equipo" description="Cajeros de THE SIP · Centro."><button className="admin-primary" onClick={() => { setAdding(true); setError(""); }}>Registrar cajero</button></SectionHeader>
    {adding && <form className="admin-form" onSubmit={add}><fieldset className="admin-fields"><legend>Registrar cajero</legend>
      <label>Nombre<input name="name" required pattern=".*\S.*" maxLength={80} /></label>
      <label>Usuario<input name="username" required pattern="[a-zA-Z0-9._]{2,40}" title="De 2 a 40 letras, números, puntos o guiones bajos" /></label>
      {error && <p role="alert">{error}</p>}
      <div className="admin-actions"><button className="admin-primary">Guardar cajero</button><button type="button" className="staff-secondary-button" onClick={() => setAdding(false)}>Cancelar</button></div>
    </fieldset></form>}
    <ul className="admin-list">{state.team.map(c => <li key={c.id} className="admin-split-row">
      <div className="admin-person"><span aria-hidden="true">{c.name.split(/\s+/).slice(0, 2).map(n => n[0]).join("")}</span><div><strong>{c.name}</strong><p>Usuario: {c.username}</p></div></div>
      <div className="admin-actions"><small className={c.active ? "admin-positive" : "admin-chip"}>{c.active ? "Activo" : "Inactivo"}</small>
        <button className="admin-text-action" onClick={() => dispatch({ type: "saveCashier", cashier: { ...c, active: !c.active } })}>{c.active ? "Desactivar" : "Activar"}</button></div>
    </li>)}</ul>
    <p className="admin-note">Equipo de ejemplo. El alta no crea credenciales de acceso.</p>
  </>;
}
