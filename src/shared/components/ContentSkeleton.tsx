export function ContentSkeleton({ label }: { label: string }) {
  return <div role="status" className="grid gap-4">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true" className="h-7 w-1/2 rounded-lg bg-muted" />
    <div aria-hidden="true" className="h-40 rounded-2xl bg-muted" />
  </div>;
}
