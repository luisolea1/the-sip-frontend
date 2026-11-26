import { useState, type FormEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { useStaffSession } from "../StaffSession";
import { BirthdayFields, readBirthday } from "@/features/members/components/BirthdayFields";

export function NewPosMember({ onCreated }: { onCreated: (number: string) => void }) {
  const { state, dispatch } = useStaffSession();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim().replace(/\s+/g, " ");
    const email = String(data.get("email")).trim().toLowerCase();
    if (!name) return setError("Escribe el nombre del miembro.");
    if (state.members.some(member => member.email === email)) return setError("Ya existe un miembro con ese correo.");
    const number = String(Math.max(...state.members.map(member => Number(member.number))) + 1).padStart(5, "0");
    dispatch({ type: "register", member: { number, name, email, stamps: 0, birthday: readBirthday(data) } });
    onCreated(number);
  }
  return <form onSubmit={submit} className="staff-workspace-panel grid gap-3">
    <h2>Nuevo miembro</h2>
    <label>Nombre<Input name="name" required autoComplete="off" maxLength={100} /></label>
    <label>Correo electrónico<Input name="email" type="email" required autoComplete="off" /></label>
    <BirthdayFields />
    {error && <p role="alert">{error}</p>}
    <button className="staff-primary-button">Crear miembro de ejemplo</button>
  </form>;
}
