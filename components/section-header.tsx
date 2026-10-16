export function SectionHeader({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium tracking-[0.18em] text-violet-400 uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children ? <p className="mt-4 leading-7 text-zinc-400">{children}</p> : null}
    </div>
  );
}
