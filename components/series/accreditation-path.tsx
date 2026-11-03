import { formatMessage, getMessages } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

const ACCREDITATION_LEVELS = [
  { level: 0, name: 'steel', status: 'available' },
  { level: 1, name: 'copper', status: 'inDevelopment' },
  { level: 2, name: 'bronze', status: 'classified' },
  { level: 3, name: 'silver', status: 'classified' },
  { level: 4, name: 'gold', status: 'classified' },
] as const

export function AccreditationPath({ locale }: { locale: Locale }) {
  const messages = getMessages(locale).series.accreditationPath

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
        {ACCREDITATION_LEVELS.map((item) => {
          const name = messages.levels[item.name]
          const status = messages.status[item.status]

          return (
            <li
              key={item.level}
              aria-label={formatMessage(messages.cardAria, { level: item.level, name, status })}
              className="min-w-0 rounded-md border border-white/10 bg-card/40 p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">
                {messages.levelLabel} {item.level}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-foreground">
                {name}
              </h3>
              <span className="mt-2 inline-flex rounded-sm border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {status}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
