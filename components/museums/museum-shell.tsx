'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useApp } from '@/components/app/data-provider';
import { APP_LANGUAGES } from '@/lib/i18n/app';

interface MuseumShellProps {
  children: ReactNode;
  active?: 'register' | 'map';
}

/** Shared chrome for the museum area: identity, navigation and language switch. */
export function MuseumShell({ children, active }: MuseumShellProps) {
  const { language, setLanguage, t, degraded } = useApp();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-5 py-3 md:px-8">
          <Link
            href="/"
            className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground transition hover:text-primary"
          >
            ISA <span className="text-primary">Series</span>
          </Link>

          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-metal sm:inline">
            SNK // Naval Archive
          </span>

          <nav aria-label="Museum sections" className="ml-auto flex items-center gap-1">
            <NavLink href="/museums" label={t.nav.register} active={active === 'register'} />
            <NavLink href="/map" label={t.nav.map} active={active === 'map'} />
          </nav>

          <div className="flex items-center gap-1 rounded-sm border border-white/10 p-0.5">
            {APP_LANGUAGES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                aria-pressed={language === option}
                className={`px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                  language === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {degraded ? (
          <p className="mx-auto max-w-[1400px] px-5 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/80 md:px-8">
            Local storage unavailable · session-only archive
          </p>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-12">{children}</main>

      <footer className="mt-10 border-t border-white/5 py-6">
        <p className="mx-auto max-w-[1400px] px-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:px-8">
          International Submarine Academy · {t.file.disclaimer}
        </p>
      </footer>
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </Link>
  );
}
