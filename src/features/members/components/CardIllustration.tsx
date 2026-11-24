import type { CardDesign } from "../card-designs";

const motifs = {
  "snow-village": <>
    <path d="m18 66 29-27 29 27m-50-6v33h43V60m1-9 21-20 25 25m-36-9v34h29V52M40 92V72h13v20" />
    <path d="m23 62 12-4 6-8 6 3 6-7M94 59h7v9h-7zM8 99q20-8 48-3t62-8" />
  </>,
  "thread-pine": <>
    <path d="m64 16-21 28h11L34 66h14L24 91q40 8 80 0L80 66h14L74 44h11ZM60 96v10h9V96" />
    <path d="m51 40 24-6m-32 25 39-9m-47 28 53-12m-60 23 63-13" />
  </>,
  "bear-lights": <>
    <circle cx="40" cy="42" r="12" /><circle cx="88" cy="42" r="12" />
    <ellipse cx="64" cy="65" rx="34" ry="29" /><ellipse cx="64" cy="73" rx="12" ry="9" />
    <path d="M50 59h1m26 0h1m-17 9h6l-3 4zM15 85q44 33 96-4m-80 16-2 6m27-1v7m28-13 3 6" />
  </>,
  "polar-gift": <>
    <path d="M29 60h70v37H29zM25 47h78v14H25zM58 47h12v50M64 46C32 46 34 18 48 25q10 3 16 21Zm0 0c32 0 30-28 16-21q-10 3-16 21Z" />
    <path d="m39 72 3 4 5 1-4 3 1 5-5-3-4 2 1-4-3-4 5-1z" />
  </>,
  "snow-santa": <>
    <path d="M32 54q10-39 35-33 23 3 32 27-12-8-22-7l5 12M32 53q23-5 51 0v10q-25-4-51 0z" />
    <circle cx="101" cy="50" r="6" /><path d="M35 64q-2 14 4 19m38-20q3 12-2 21M37 77q8 4 16-3 4 5 10 0 7 7 15 2-2 21-23 29-14-7-18-29zM45 67h1m20 0h1" />
  </>,
  gingerbread: <>
    <path d="M48 46a18 18 0 1 1 32 0l16-5c13-4 18 12 7 17L84 68l9 21c6 14-10 21-18 9L64 84 53 99c-8 11-24 4-18-9l9-22-20-10c-11-6-4-21 8-17Z" />
    <path d="M57 32h1m12 0h1m-13 8q6 5 12-1m-32 47 8 2 4 6m29-6 4-2 6 2" />
    <circle cx="64" cy="57" r="2" /><circle cx="64" cy="69" r="2" />
  </>,
} satisfies Record<CardDesign["id"], React.ReactNode>;

export function CardIllustration({ design }: { design: CardDesign }) {
  return (
    <svg aria-hidden="true" width="128" height="112" viewBox="0 0 128 112"
      className="h-auto w-28 max-w-full sm:w-40" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v8m-4-4h8m85 43v6m-3-3h6" opacity=".65" />
      {motifs[design.id]}
    </svg>
  );
}
