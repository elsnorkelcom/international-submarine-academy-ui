import palette from '@/lib/data/datasets/palette.json';
import grid from '@/lib/data/datasets/cobre-grid.json';
import type { AppStrings } from '@/lib/i18n/app';
import type { LanguageCode } from '@/lib/domain/types';

interface CopperGridProps {
  language: LanguageCode;
  t: AppStrings['learn']['series'];
}

const DISC_ORDER = ['SCI', 'TEC', 'ING', 'MAT'] as const;
const SPEC_ORDER = ['MAQ', 'ELE', 'ELN', 'NAV', 'LOG'] as const;

type GridCell = (typeof grid.cells)[number];

/** Grilla de Cobre: 5 especialidades × 4 dimensiones STEM, 3 variantes por celda. */
export function CopperGrid({ language, t }: CopperGridProps) {
  const colors = (palette as { seasons: Record<string, { disciplines: Record<string, string> }> })
    .seasons.COPPER.disciplines;

  const cells = grid.cells as GridCell[];
  const byCell = new Map<string, GridCell>();
  for (const cell of cells) {
    byCell.set(`${cell.specialtyId}-${cell.disciplineId}`, cell);
  }

  const disciplineName = (code: string) => {
    const cell = cells.find((item) => item.disciplineId === code);
    if (!cell) return code;
    return language === 'es' ? cell.disciplineEs : cell.disciplineEn;
  };

  const specialtyName = (code: string) => {
    const cell = cells.find((item) => item.specialtyId === code);
    if (!cell) return code;
    return language === 'es' ? cell.specialtyEs : cell.specialtyEn;
  };

  return (
    <section aria-labelledby="copper-grid-title" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{t.gridKicker}</p>
          <h2
            id="copper-grid-title"
            className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide"
          >
            {t.gridTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.gridHint}</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-primary">20 × 3 = 60</span>
        </p>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div
          className="grid min-w-[820px] gap-2"
          style={{ gridTemplateColumns: '128px repeat(4, minmax(0, 1fr))' }}
        >
          <div className="px-1 pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.gridSpecialty} / {t.gridDimension}
          </div>

          {DISC_ORDER.map((discipline) => (
            <div key={discipline} className="px-1 pb-1">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.16em]"
                style={{ color: colors[discipline] }}
              >
                {discipline}
              </span>
              <span className="ml-2 text-[11px] text-muted-foreground">{disciplineName(discipline)}</span>
            </div>
          ))}

          {SPEC_ORDER.map((specialty) => (
            <div key={specialty} className="contents">
              <div className="flex flex-col justify-center rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {specialty}
                </span>
                <span className="mt-1 font-display text-sm font-bold uppercase tracking-wide">
                  {specialtyName(specialty)}
                </span>
              </div>

              {DISC_ORDER.map((discipline) => {
                const cell = byCell.get(`${specialty}-${discipline}`);
                if (!cell) {
                  return <div key={`${specialty}-${discipline}`} className="rounded-md border border-white/10" />;
                }

                const color = colors[discipline];
                const codes = cell.variants.map((variant) => variant.contentCode).join(' · ');

                return (
                  <div
                    key={cell.cellCode}
                    className="rounded-md border border-white/10 bg-card/40 p-2.5"
                    style={{ borderTopColor: color, borderTopWidth: 3 }}
                    aria-label={`${specialtyName(specialty)} · ${disciplineName(discipline)}: ${t.gridVariants}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.16em]"
                        style={{ color }}
                      >
                        {t.gridVariants}
                      </span>
                      <span aria-hidden="true" className="flex items-center gap-1">
                        {cell.variants.map((variant) => (
                          <span
                            key={variant.id}
                            className="block size-2 rounded-full"
                            style={{ backgroundColor: color, opacity: 1 - (variant.variantIndex - 1) * 0.22 }}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {codes}
                    </p>
                    <p className="mt-2 font-mono text-[9px] text-white/25">{cell.cellCode}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {DISC_ORDER.map((discipline) => (
          <li key={discipline} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block size-2.5 rounded-sm"
              style={{ backgroundColor: colors[discipline] }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {discipline} · {disciplineName(discipline)}
            </span>
          </li>
        ))}
        <li className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {t.gridLegend}
        </li>
      </ul>
    </section>
  );
}
