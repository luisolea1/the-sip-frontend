import { Link } from "react-router";
import { AreaIntroduction } from "@/shared/components/AreaIntroduction";
import { paths } from "@/app/paths";

export default function MemberCardPage() {
  return (
    <>
      <AreaIntroduction title="Mi tarjeta" description="Para consultar una tarjeta se necesita una sesión de miembro. El acceso por correo todavía no está habilitado." />
      <Link to={paths.registration}>Volver al registro de miembros</Link>
    </>
  );
}
