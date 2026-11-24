import { Link } from "react-router";
import { paths } from "@/app/paths";
import { CoffeeCupIcon } from "../components/CoffeeCupIcon";
import { useCardSession } from "../components/MemberCardLayout";
import { MemberQrDialog } from "../components/MemberQrDialog";
import { SampleMemberCard } from "../components/SampleMemberCard";
import { useMemberProfile } from "../MemberProfileProvider";

export default function MemberCardPage() {
  const { design } = useCardSession();
  const { profile } = useMemberProfile();
  const parts = (profile?.name ?? "Miembro").split(" ");
  const firstName = parts[0];
  const initials = (firstName[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toLocaleUpperCase("es");
  return <>
    <title>Mi tarjeta | THE SIP</title>
    <header className="flex items-center gap-2 font-bold">
      <span className="rounded-lg bg-primary p-2 text-white"><CoffeeCupIcon /></span> THE SIP
      <span aria-hidden="true" className="ml-auto rounded-full bg-muted p-2 text-xs">{initials}</span>
    </header>
    <div className="mt-2"><h1 className="break-words text-2xl font-bold tracking-tight">Hola, {firstName}.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tu siguiente café está cada vez más cerca.</p></div>
    <SampleMemberCard design={design} memberName={profile?.name ?? "Miembro de ejemplo"} />
    <Link to={paths.memberCardDesigns} className="-mt-2 inline-flex min-h-11 items-center justify-self-end text-sm font-semibold">Elegir diseño</Link>
    <section aria-labelledby="member-rewards-heading" className="grid gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="member-rewards-heading" className="text-base">Tus cafés cuentan.</h2>
        <p aria-label="0 de 10 cafés"><strong className="text-xl text-primary">0</strong> / 10</p>
      </div>
      <div aria-hidden="true" className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, index) => <span key={index} className="grid aspect-square place-items-center rounded-full bg-[#f5f2f1] text-[#9c928b]"><CoffeeCupIcon /></span>)}
      </div>
      <p className="text-sm">Te faltan <strong>10 cafés pagados</strong> para desbloquear uno de regalo.</p>
    </section>
    <MemberQrDialog />
    <Link to={paths.registration} className="justify-self-center text-xs">Volver al registro de miembros</Link>
  </>;
}
