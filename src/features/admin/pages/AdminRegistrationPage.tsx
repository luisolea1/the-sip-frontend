import { useState, type FormEvent } from "react";
import { Input } from "@/shared/components/ui/input";

export default function AdminRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);

  function previewRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return <main className="grid min-h-dvh place-items-center bg-muted px-4 py-8">
    <title>Registro de administrador | THE SIP</title>
    <section aria-labelledby="admin-registration-title" className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-primary px-6 py-4 text-white">
        <strong className="text-xl tracking-wide">THE SIP · Centro</strong>
        <span className="text-sm">Administración</span>
      </header>
      <div className="grid gap-6 p-6 sm:p-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">Vista previa</p>
          <h1 id="admin-registration-title" className="text-3xl">Registro de administrador</h1>
          <p id="admin-registration-note" className="mt-2 text-sm text-muted-foreground">Prueba el formulario con datos ficticios. No se envían ni se guardan.</p>
        </div>
        <form className="grid gap-5" aria-describedby="admin-registration-note" autoComplete="off"
          onSubmit={previewRegistration} onChange={() => setSubmitted(false)}>
          <label className="grid gap-1.5 font-semibold">Correo electrónico
            <Input type="email" placeholder="admin@ejemplo.com" required />
          </label>
          <label className="grid gap-1.5 font-semibold">Contraseña
            <Input type="password" autoComplete="new-password" required />
          </label>
          <button type="submit" className="staff-primary-button">Probar registro</button>
        </form>
        <p role="status" className="empty:hidden rounded-xl bg-accent p-3 text-sm text-primary">
          {submitted && "Prueba completada. No se ha creado ninguna cuenta."}
        </p>
      </div>
    </section>
  </main>;
}
