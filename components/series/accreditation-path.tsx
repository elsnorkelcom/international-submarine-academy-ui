import { formatMessage, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { seasonsConfig } from '@/lib/data/config'

const ACCREDITATION_LEVELS = [
  { level: 0, name: 'steel', status: 'available' },
  { level: 1, name: 'copper', status: 'inDevelopment' },
  { level: 2, name: 'bronze', status: 'classified' },
  { level: 3, name: 'silver', status: 'classified' },
  { level: 4, name: 'gold', status: 'classified' },
] as const

/** Colour per level, taken from the configuration table when available. */
const LEVEL_COLORS: Record<string, string> = {
  steel: '#8FA3B0',
  copper: '#B87333',
  bronze: '#CD7F32',
  silver: '#C0C7CE',
  gold: '#D4AF37',
}

function levelColor(name: string): string {
  const configured = seasonsConfig().find((season) => season.name === name)?.colorTheme
  return configured || LEVEL_COLORS[name] || '#8FA3B0'
}

export function AccreditationPath({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.accreditationPath
  const colors = ACCREDITATION_LEVELS.map((item) => levelColor(item.name))

  return (
    <section
      aria-labelledby="ruta-acreditacion-title"
      className="mx-auto mt-12 max-w-[1600px] scroll-mt-24 px-4 md:px-10"
    >
      <h2
        id="ruta-acreditacion-title"
        className="font-display text-2xl font-bold uppercase tracking-tight text-foreground"
      >
        {messages.title}
      </h2>
      <ul
        className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label={messages.sectionAria}
      >
        {ACCREDITATION_LEVELS.map((item, index) => {
          const name = messages.levels[item.name]
          const status = messages.status[item.status]
          const color = colors[index]

          return (
            <li
              key={item.level}
              aria-label={formatMessage(messages.cardAria, { level: item.level, name, status })}
              className="min-w-0 overflow-hidden rounded-md border bg-card/40"
              style={{ borderColor: `${color}66` }}
            >
              <span
                aria-hidden="true"
                className="block h-1 w-full"
                style={{ backgroundColor: color }}
              />
              <div className="p-4">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color }}
                >
                  {messages.levelLabel} {item.level}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-foreground">
                  {name}
                </h3>
                <span
                  className="mt-2 inline-flex rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                  style={{ borderColor: `${color}66`, color }}
                >
                  {status}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        aria-hidden="true"
        className="mt-4 flex h-1.5 overflow-hidden rounded-full"
        style={{
          background: `linear-gradient(90deg, ${colors
            .map((color, index) => `${color} ${index * 25}%`)
            .join(', ')}, ${colors[colors.length - 1]} 100%)`,
        }}
      />
    </section>
  )
}
