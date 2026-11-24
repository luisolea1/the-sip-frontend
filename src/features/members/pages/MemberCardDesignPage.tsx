import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { paths } from "@/app/paths";
import { CardDesignPicker } from "../components/CardDesignPicker";
import { useCardSession } from "../components/MemberCardLayout";

export default function MemberCardDesignPage() {
  const { design, saveDesign } = useCardSession();
  const [draft, setDraft] = useState(design);
  const navigate = useNavigate();

  function confirmDesign() {
    saveDesign(draft);
    navigate(paths.memberCard, { replace: true });
  }

  return <>
    <title>Elegir diseño | THE SIP</title>
    <header className="grid justify-items-start gap-4">
      <p className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Maqueta · datos de ejemplo</p>
      <p className="text-xs font-semibold tracking-[0.15em] text-primary">COLECCIÓN NAVIDEÑA</p>
      <h1 className="text-3xl leading-none font-bold tracking-tight">Tu pausa.<br />Con magia.</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">Elige uno de los seis diseños navideños de THE SIP para tu tarjeta.</p>
    </header>
    <CardDesignPicker selected={draft} onSelect={setDraft} />
    <button type="button" onClick={confirmDesign} className="member-card-primary-button mt-3"><span aria-hidden="true">✓　</span>Guardar diseño</button>
    <p aria-live="polite" className="text-xs text-primary">{draft.name} · edición navideña de THE SIP.</p>
    <Link to={paths.memberCard} replace className="border-t border-border pt-4 text-sm">Volver sin guardar</Link>
  </>;
}
