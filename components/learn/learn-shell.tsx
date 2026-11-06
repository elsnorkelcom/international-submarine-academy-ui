'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { useApp } from '@/components/app/data-provider';
import { APP_LANGUAGES } from '@/lib/i18n/app';

export function LearnShell({ children, active }: { children: ReactNode; active?: 'series' | 'profile' }) {
  const { language, setLanguage, t } = useApp();
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-5 py-3 md:px-8">
          <Link
            href="/series"
            className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground transition hover:text-primary"
          >
            ISA <span className="text-primary">Series</span>
          </Link>

          <nav aria-label="Learner sections" className="ml-auto flex items-center gap-1">
            <NavLink href="/series" label={t.learn.nav.series} active={active === 'series' || pathname === '/series'} />
            <NavLink href="/museums" label={t.learn.nav.archive} active={false} />
            <NavLink href="/profile" label={t.learn.nav.profile} active={active === 'profile'} />
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
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10">{children}</main>
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
