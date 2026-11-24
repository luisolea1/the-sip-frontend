import type { CardDesign } from "../card-designs";
import sampleQr from "../images/sample-card-qr.svg";
import { CardIllustration } from "./CardIllustration";

export function SampleMemberCard({ design }: { design: CardDesign }) {
  return (
    <article aria-labelledby="member-card-design-title"
      style={{ backgroundColor: design.background, color: design.foreground }}
      className="grid min-w-0 gap-5 rounded-3xl p-5 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold tracking-widest">THE SIP</span>
        <span className="rounded-full border px-3 py-1 text-sm font-semibold">De muestra</span>
      </header>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm">Colección navideña</p>
          <h2 id="member-card-design-title" className="mt-2 text-3xl">{design.name}</h2>
        </div>
        <CardIllustration design={design} />
      </div>
      <footer className="flex flex-wrap items-end justify-between gap-4 border-t pt-4">
        <div>
          <p className="text-sm font-semibold">3 de 6 sellos de ejemplo</p>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className={`size-4 rounded-full border ${index < 3 ? "bg-current" : ""}`} />
            ))}
          </div>
        </div>
        <img src={sampleQr} width="88" height="88" alt="Código QR de muestra sin validez en caja" />
      </footer>
    </article>
  );
}
