import Image from 'next/image'
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'

const NAV = [
  { label: 'Inicio', href: '#', active: true },
  { label: 'Temporadas', href: '#temporadas', active: false },
  { label: 'Seguir viendo', href: '#seguir-viendo', active: false },
]

export function SeriesHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background/95 via-background/60 to-transparent">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label="International Submarine Academy, inicio">
          <Image src="/images/academy-logo.png" alt="" width={32} height={32} className="size-8" />
          <span className="font-display text-sm font-bold uppercase leading-none tracking-[0.18em] text-foreground md:text-base">
            ISA <span className="text-primary">Series</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    item.active ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <Link
            href="/v1"
            className="rounded-sm border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
          >
            Versión 1
          </Link>
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Buscar"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Notificaciones"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-sm border border-white/10 bg-gradient-to-br from-zinc-600 to-zinc-800 text-foreground ring-primary/60 transition hover:ring-2"
            aria-label="Perfil de usuario"
          >
            <User className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
