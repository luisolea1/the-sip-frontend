import type { CardDesign } from "../card-designs";
import sampleQr from "../images/sample-card-qr.svg";
import { CardIllustration } from "./CardIllustration";

export function SampleMemberCard({ design, memberName }: { design: CardDesign; memberName: string }) {
  return (
    <article aria-label={`Tarjeta de muestra: ${design.name}`} style={{ backgroundColor: design.background, color: design.foreground }}
      className="relative isolate grid aspect-[1.29] min-h-56 content-between overflow-hidden rounded-[1.75rem] p-5 shadow-lg">
      <header className="flex items-start justify-between gap-2">
        <div><h2 className="text-3xl font-extrabold tracking-tighter">THE SIP</h2>
          <p className="mt-1 text-xs font-bold tracking-[0.18em]">CLUB DE CAFÉ</p></div>
        <span className="rounded-full border px-2 py-1 text-[0.65rem]">MIEMBRO</span>
      </header>
      <div className="absolute top-[19%] right-[10%] -z-10 size-[45%]">
        <CardIllustration design={design} />
      </div>
      <footer className="flex items-end justify-between gap-2">
        <div className="min-w-0"><p className="break-words font-semibold">{memberName}</p>
          <p className="mt-1 text-xs tracking-widest">N.º 01725</p></div>
        <img src={sampleQr} width="64" height="64" alt="QR de muestra de la tarjeta" className="rounded-lg bg-white p-1" />
      </footer>
    </article>
  );
}
