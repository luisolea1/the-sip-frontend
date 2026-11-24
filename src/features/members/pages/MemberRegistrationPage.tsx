import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { paths } from "@/app/paths";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { Input } from "@/shared/components/ui/input";
import { useMemberProfile } from "../MemberProfileProvider";

export default function MemberRegistrationPage() {
  const { profile, register } = useMemberProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register({ name: name.trim().replace(/\s+/g, " "), email: email.trim() });
    navigate(paths.memberCard);
  }

  return (
    <>
      <AreaIntroduction title="Registro" description="Una tarjeta para identificarte en caja, reunir sellos y consultar tus recompensas." />
      <div className="grid items-start gap-5 md:grid-cols-2">
        <form className="app-area-content-panel" aria-labelledby="member-details-title" onSubmit={handleSubmit}>
          <h2 id="member-details-title">Tus datos</h2>
          <fieldset className="grid gap-3">
            <legend className="sr-only">Datos del miembro</legend>
            <label htmlFor="member-name">Nombre</label>
            <Input id="member-name" autoComplete="name" placeholder="Tu nombre" required pattern={".*\\S.*"}
              title="Escribe tu nombre" value={name} onChange={event => setName(event.target.value)} />
            <label htmlFor="member-email">Correo electrónico</label>
            <Input id="member-email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" required
              value={email} onChange={event => setEmail(event.target.value)} />
          </fieldset>
          <button type="submit" className="member-card-primary-button">Registrarse</button>
          <p className="text-sm text-muted-foreground">Los datos no se envían y se borran al recargar.</p>
        </form>
        <section className="app-area-content-panel">
          <h2>¿Ya eres miembro?</h2>
          <p>La tarjeta reúne tu código QR y el progreso de tus recompensas.</p>
          <Link to={paths.memberCard}>Acceder a mi tarjeta</Link>
        </section>
      </div>
    </>
  );
}
