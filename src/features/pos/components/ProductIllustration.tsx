import type { Product } from "../catalog";

export function ProductIllustration({ kind, photo }: { kind: Product["illustration"]; photo?: string }) {
  if (photo) return <img alt="" src={photo} className="h-24 w-full rounded-[inherit] object-cover" />;
  const dark = kind === "americano";
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true" className="h-24 w-full">
      <ellipse cx="80" cy="83" rx="48" ry="6" fill="#795b35" opacity=".12" />
      {kind === "muffin" ? <g transform="rotate(-7 80 55)">
        <path d="M49 52h62l-7 28q-25 8-48-1z" fill="#a47853" />
        <path d="m61 59 4 18m12-18 1 20m15-21-2 19" stroke="#785135" strokeWidth="3" />
        <path d="M44 53q-3-14 9-19 2-12 17-12 13-11 24 1 19-2 19 13 12 6 5 18-39 13-74-1" fill="#674433" />
        <path d="m61 38 8-3m9 12 5 2m10-18 6 3" stroke="#b68866" strokeWidth="4" strokeLinecap="round" />
      </g> : <g transform="rotate(-5 80 58)">
        <ellipse cx="79" cy="77" rx="47" ry="8" fill={dark ? "#a5b7ab" : "#d4c8ae"} />
        <path d="M108 39c25-8 26 21 0 22" fill="none" stroke={dark ? "#879c90" : "#c5bca6"} strokeWidth="8" />
        <path d="M42 35q2 43 35 43t36-43" fill={dark ? "#aebfb3" : "#f8f0df"} />
        <ellipse cx="78" cy="35" rx="36" ry="12" fill={kind === "chai" ? "#b78f68" : dark ? "#4c3628" : "#aa7045"} stroke={dark ? "#ced8cb" : "#fcf7e8"} strokeWidth="4" />
        {!dark && <path d="M78 41c-27-8-8-15 0-8 11-8 24-2 0 8" fill="#f9e7cc" />}
      </g>}
    </svg>
  );
}
