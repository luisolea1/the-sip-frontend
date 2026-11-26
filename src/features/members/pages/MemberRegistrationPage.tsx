import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { paths } from "@/app/paths";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { Input } from "@/shared/components/ui/input";
import { useMemberProfile } from "../MemberProfileProvider";
import { BirthdayFields, readBirthday } from "../components/BirthdayFields";

export default function MemberRegistrationPage() {
  const { profile, register } = useMemberProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register({ name: name.trim().replace(/\s+/g, " "), email: email.trim(), birthday: readBirthday(new FormData(event.currentTarget)) });
    navigate(paths.memberCard);
  }

  return (
    <>
      <AreaIntroduction title="Registro" description="Crea tu tarjeta para identificarte en caja y reunir sellos con tus cafés." />
      <form aria-label="Datos del miembro" aria-describedby="registration-privacy" className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <label htmlFor="member-name" className="font-semibold">Nombre</label>
          <Input id="member-name" autoComplete="name" placeholder="Tu nombre" required pattern={".*\\S.*"}
            title="Escribe tu nombre" value={name} onChange={event => setName(event.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="member-email" className="font-semibold">Correo electrónico</label>
          <Input id="member-email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" required
            value={email} onChange={event => setEmail(event.target.value)} />
        </div>
        <BirthdayFields initial={profile?.birthday} />
        <div className="grid gap-3">
          <button type="submit" className="member-card-primary-button">Registrarse</button>
          <p id="registration-privacy" className="text-sm leading-relaxed text-muted-foreground">Los datos no se envían y se borran al recargar.</p>
        </div>
      </form>
      <p className="flex flex-wrap items-center gap-x-2 border-t border-border pt-2 text-sm">
        ¿Ya eres miembro?
        <Link className="inline-flex min-h-11 items-center font-semibold" to={paths.memberCard}>Acceder a mi tarjeta</Link>
      </p>
    </>
  );
}
