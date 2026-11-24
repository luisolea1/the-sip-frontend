type AreaIntroductionProps = {
  title: string;
  description: string;
};

export function AreaIntroduction({ title, description }: AreaIntroductionProps) {
  return (
    <header className="grid gap-3">
      <title>{`${title} | THE SIP`}</title>
      <h1>{title}</h1>
      <p className="max-w-prose">{description}</p>
    </header>
  );
}
