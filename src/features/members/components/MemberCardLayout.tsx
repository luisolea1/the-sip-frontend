import { useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import { defaultCardDesign, type CardDesign } from "../card-designs";

type CardSession = { design: CardDesign; saveDesign: (design: CardDesign) => void };

export function useCardSession() {
  return useOutletContext<CardSession>();
}

export default function MemberCardLayout() {
  const [design, saveDesign] = useState<CardDesign>(defaultCardDesign);
  return (
    <div className="members-area-theme min-h-screen bg-muted px-1 py-1 text-foreground">
      <a href="#member-card-content" className="sr-only focus:not-sr-only">Saltar al contenido</a>
      <main id="member-card-content" tabIndex={-1} className="mx-auto grid max-w-[26rem] gap-5 rounded-[1.75rem] border border-border bg-white px-5 py-6 sm:px-7">
        <Outlet context={{ design, saveDesign } satisfies CardSession} />
      </main>
    </div>
  );
}
