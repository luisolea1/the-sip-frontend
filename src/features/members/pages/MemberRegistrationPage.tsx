import { Link } from "react-router";
import { paths } from "@/app/paths";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { Input } from "@/shared/components/ui/input";

export default function MemberRegistrationPage() {
  return (
    <>
      <AreaIntroduction title="Registro de miembros" description="Una tarjeta para identificarte en caja, reunir sellos y consultar tus recompensas." />
      <div className="grid items-start gap-5 md:grid-cols-2">
        <section className="app-area-content-panel">
          <h2>Tu registro</h2>
          <p>Puedes probar los campos. Los datos no se envían ni se guardan.</p>
          <fieldset className="grid gap-3">
            <legend className="sr-only">Datos del miembro</legend>
            <label htmlFor="member-name">Nombre</label>
            <Input id="member-name" autoComplete="given-name" placeholder="Tu nombre" />
            <label htmlFor="member-email">Correo electrónico</label>
            <Input id="member-email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" />
          </fieldset>
        </section>
        <section className="app-area-content-panel">
          <h2>¿Ya eres miembro?</h2>
          <p>La tarjeta reúne tu código QR y el progreso de tus recompensas.</p>
          <Link to={paths.memberCard}>Acceder a mi tarjeta</Link>
        </section>
      </div>
    </>
  );
}
