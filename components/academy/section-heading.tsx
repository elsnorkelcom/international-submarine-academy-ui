export function SectionHeading({
  id,
  eyebrow,
  title,
  meta,
}: {
  id: string
  eyebrow: string
  title: string
  meta?: string
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        <h2 id={id} className="mt-1 font-display text-3xl font-extrabold uppercase tracking-wide text-foreground md:text-4xl">
          {title}
        </h2>
      </div>
      {meta && <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-metal">{meta}</p>}
    </div>
  )
}
