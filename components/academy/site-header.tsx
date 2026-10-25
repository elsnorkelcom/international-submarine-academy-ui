import Link from 'next/link'
import { Anchor, Bell, Search, User } from 'lucide-react'

const NAV = [
  { label: 'Inicio', href: '#', active: true },
  { label: 'Misiones', href: '#fase-acero', active: false },
  { label: 'Mi Colección', href: '#mi-progreso', active: false },
]

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-gradient-to-b from-background via-background/90 to-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label="International Submarine Academy, inicio">
          <span className="flex size-8 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 text-primary">
            <Anchor className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-bold uppercase leading-none tracking-[0.18em] text-foreground md:text-base">
            <span className="hidden sm:inline">International </span>
            <span className="text-primary">Submarine</span> Academy
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
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground sm:flex"
            aria-label="Buscar"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
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

      <nav aria-label="Principal móvil" className="border-t border-white/5 md:hidden">
        <ul className="flex items-center gap-5 px-4 py-2">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={`text-xs font-medium ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
