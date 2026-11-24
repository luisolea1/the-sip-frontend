import type { ReactNode } from "react";
import type { CardDesign } from "../card-designs";

function BearHead() {
  return <g transform="rotate(-9 57 43)">
    <g fill="#f8efdf"><circle cx="29" cy="22" r="11"/><circle cx="82" cy="22" r="11"/></g>
    <g fill="#eebfae"><circle cx="29" cy="22" r="6"/><circle cx="82" cy="22" r="6"/></g>
    <ellipse cx="56" cy="45" rx="36" ry="32" fill="#f8efdf"/>
    <g fill="#263a32"><circle cx="42" cy="43" r="2.7"/><circle cx="66" cy="42" r="2.7"/><ellipse cx="55" cy="50" rx="4.8" ry="3.4"/></g>
    <g fill="#efc2b1"><circle cx="34" cy="54" r="5.3"/><circle cx="76" cy="53" r="5.3"/></g>
  </g>;
}

function PolarGift() {
  return <>
    <path fill="#f8efdf" d="M27 111q-2-47 23-51 26-5 37 18l10 33Z"/>
    <BearHead />
    <g transform="rotate(10 71 87)">
      <rect x="42" y="66" width="51" height="43" rx="4" fill="#ba3036"/>
      <path d="M67 67q-22-7-17-16 8-8 17 16 11-19 19-13 6 7-19 13Z" fill="none" stroke="#175346" strokeWidth="4"/>
      <path d="M64 67h7v42h-7z" fill="#175346"/>
    </g>
    <g fill="#f8efdf"><ellipse cx="39" cy="84" rx="14" ry="9" transform="rotate(32 39 84)"/><ellipse cx="96" cy="96" rx="8" ry="10" transform="rotate(-25 96 96)"/></g>
  </>;
}

function BearLights() {
  return <>
    <path d="M21 112q0-42 30-49 35-5 46 49Z" fill="#ba444c"/>
    <BearHead />
    <path d="M29 65q25 15 55 0l4 10q-35 17-60 1Zm42 13 10-1 2 23-10 1Z" fill="#a52e3b"/>
    <path d="M24 89q34 17 68-2" fill="none" stroke="#775038" strokeWidth="1.6"/>
    <g fill="#ffda92"><ellipse cx="33" cy="95" rx="2" ry="4"/><ellipse cx="56" cy="100" rx="2" ry="4"/></g>
    <g fill="#f4ada8"><ellipse cx="44" cy="98" rx="2" ry="4"/><ellipse cx="80" cy="94" rx="2" ry="4"/></g>
    <g fill="#a1be95"><ellipse cx="68" cy="98" rx="2" ry="4"/><path d="m29 103 1 6m58-8 1 5" stroke="#a1be95"/></g>
  </>;
}

function ThreadPine() {
  return <g fill="none" stroke="#f7d698" strokeWidth="2.1" strokeLinecap="round">
    <path d="M55 18c-13 0-14 13-4 12 11-2 9-13 3-12m-1 14c-20 2-24 23-13 24 13 0 20-25 12-23-7 3 4 25 15 20 8-5-4-23-13-20"/>
    <path d="M44 52C20 59 15 82 26 82c12 0 27-30 18-29-8 1 2 30 12 29 12-1 12-27 3-27-9 1 9 30 20 24 10-6-8-25-17-27"/>
    <path d="M31 79c-16 5-24 23-13 25 13 3 23-22 17-22-6 1-4 23 6 23 13-1 17-26 9-25-7 1 1 27 12 25 12-2 8-24 1-23-5 2 10 24 20 20 12-5-2-24-10-24m-21 28 4 4 5-5"/>
    <path fill="#f7d698" stroke="none" d="m55 5 2 5 6 1-5 3 1 5-4-3-5 3 1-5-4-3 6-1Z"/>
  </g>;
}

const motifs: Record<CardDesign["id"], ReactNode> = {
  "polar-gift": <PolarGift />,
  "bear-lights": <BearLights />,
  "thread-pine": <ThreadPine />,
  "snow-village": <>
    <path d="M6 100h99" stroke="#e4e3ca" strokeWidth="2"/>
    <path d="M17 97V61l13-18 13 18v36Z" fill="#b76f49"/><path d="m14 63 16-24 17 24-7-3-10-15-11 16Z" fill="#f3e8d4"/>
    <path d="M44 98V70l12-15 13 15v28Z" fill="#354a36"/><path d="m70 98 1-40 15-25 15 25v40Z" fill="#f4ecd9"/>
    <path d="m68 61 18-31 18 31-7-4-11-18-12 18Z" fill="#fffaeb"/>
    <path d="M27 70h6v7h-6zm0 13h6v11h-6zm55-19h5v8h-5zm0 14h5v8h-5z" fill="#edc777"/>
    <path d="M56 86q-12-7-7-12 4-2 7 3 3-5 7-3 4 4-7 12" fill="#edc777"/>
    <path d="M9 75v24m-5-17 5 4 5-6m-10 9 5 4 6-5" fill="none" stroke="#e8e6d1" strokeWidth="2"/>
  </>,
  "snow-santa": <>
    <path d="m39 59-14-29 11-5 17 30m9-4 8-29 13 4-6 31" fill="#b73533"/>
    <path d="m26 36-6-12q-9-1-11-8-1-7 8-6 12-1 16 9l5 11zm42-10 3-11q4-6 15-7 10 0 10 6-1 6-12 9l-3 7Z" fill="#243834"/>
    <path d="M20 70h78v37H20z" fill="#b83234"/><path d="M20 92h78v10H20z" fill="#30362e"/><path d="M53 91h14v12H53z" fill="none" stroke="#e5bc69" strokeWidth="3"/>
    <path d="M13 69q-1-9 9-10-2-10 8-11 0-9 10-8 8 1 9 10 8-5 14 2 8-13 18-7 8 3 7 12 12-1 12 10 10 2 8 9-1 8-11 7-6 9-16 2-8 7-17-1-10 7-18-1-10 7-17-2-12 7-16-2-11-2 0-10Z" fill="#fff6e8"/>
  </>,
  gingerbread: <g transform="rotate(-16 56 61)">
    <path d="M37 40a22 22 0 1 1 37 1l18 11c9 6 3 18-5 15L72 60l1 16 8 24c3 10-10 16-15 7L55 89l-11 18c-5 9-18 2-14-7l10-25 1-16-17 8c-10 5-16-8-7-14Z" fill="#aa642f"/>
    <g fill="#553626"><circle cx="48" cy="24" r="2.4"/><circle cx="64" cy="24" r="2.4"/><path d="M50 32q6 6 12 0-5 11-12 0"/></g>
    <g fill="#bb3937"><circle cx="43" cy="30" r="3"/><circle cx="70" cy="30" r="3"/><circle cx="56" cy="54" r="3"/></g>
    <circle cx="56" cy="67" r="3" fill="#335c48"/>
    <path d="m32 94 4-2 3 4 4-2m24 0 4-2 4 3m-60-34 4-1 1-5" fill="none" stroke="#f7dabb" strokeWidth="2"/>
    <path d="m85 75 7-26q3-9 10-6 5 2 3 9" fill="none" stroke="#fff4dc" strokeWidth="7" strokeLinecap="round"/>
    <path d="m86 67 6 2m-3-12 6 2m-2-13 5 3m3-5 5 3" stroke="#bc3940" strokeWidth="4"/>
  </g>,
};

export function CardIllustration({ design }: { design: CardDesign }) {
  return <svg aria-hidden="true" width="112" height="112" viewBox="0 0 112 112" className="block size-full">
    <g fill="#f9e9c2"><circle cx="10" cy="36" r="1.4"/><circle cx="103" cy="34" r="1.2"/><circle cx="19" cy="8" r="1.2"/>
      <path d="m96 5 1.2 4.8 4.8 1.2-4.8 1.2-1.2 4.8-1.2-4.8L90 11l4.8-1.2Z"/></g>
    {motifs[design.id]}
  </svg>;
}
