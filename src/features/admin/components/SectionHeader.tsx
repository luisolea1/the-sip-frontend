import type { ReactNode } from "react";

export function SectionHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <header className="admin-section-header">
    <div><h2>{title}</h2><p>{description}</p></div>
    {children}
  </header>;
}
