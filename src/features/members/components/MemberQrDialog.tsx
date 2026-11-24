import { useRef } from "react";
import sampleQr from "../images/sample-card-qr.svg";

export function MemberQrDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" className="member-card-primary-button" onClick={() => dialog.current?.showModal()}>
      Mostrar mi QR
    </button>
    <dialog ref={dialog} aria-labelledby="member-qr-title" className="fixed inset-0 m-auto w-[min(90vw,22rem)] rounded-2xl p-6 text-center backdrop:bg-black/60">
      <h2 id="member-qr-title">Mi QR</h2>
      <img src={sampleQr} width="256" height="256" alt="QR ampliado de muestra" className="mx-auto h-auto max-w-full" />
      <p className="mb-4 text-sm">Tarjeta de ejemplo · Sin validez en caja.</p>
      <button type="button" className="member-card-primary-button w-full" onClick={() => dialog.current?.close()}>Cerrar</button>
    </dialog>
  </>;
}
