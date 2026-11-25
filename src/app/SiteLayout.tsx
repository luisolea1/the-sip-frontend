import { Outlet } from "react-router";

export function SiteLayout() {
  return (
    <div className="members-area-theme mx-auto min-h-screen max-w-lg px-5 text-foreground sm:px-8">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block">
        Saltar al contenido
      </a>
      <header className="border-b border-border py-4 sm:pt-8">
        <span className="text-2xl font-bold tracking-wide text-primary">THE SIP</span>
      </header>
      <main id="main-content" tabIndex={-1} className="grid gap-6 py-7 sm:gap-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
