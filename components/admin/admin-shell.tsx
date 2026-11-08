'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { DataProvider } from '@/components/app/data-provider';
import { ADMIN_ENTITIES } from '@/lib/admin/entities';
import {
  closeAdminSession,
  hasAdminSession,
  openAdminSession,
  readAdminHash,
  sha256Hex,
  writeAdminHash,
} from '@/lib/admin/local-auth';

type GateState = 'loading' | 'setup' | 'locked' | 'open';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <AdminGate>{children}</AdminGate>
    </DataProvider>
  );
}

function AdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>('loading');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasAdminSession()) {
      setState('open');
      return;
    }

    setState(readAdminHash() ? 'locked' : 'setup');
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    const passphrase = value.trim();

    if (passphrase.length < 6) {
      setError('Usá al menos seis caracteres.');
      return;
    }

    try {
      const hash = await sha256Hex(passphrase);

      if (state === 'setup') {
        writeAdminHash(hash);
        openAdminSession();
        setState('open');
        return;
      }

      if (hash === readAdminHash()) {
        openAdminSession();
        setState('open');
        return;
      }

      setError('Contraseña incorrecta.');
      setValue('');
    } catch {
      setError('Web Crypto no está disponible. Usá un contexto seguro (HTTPS o localhost).');
    }
  }

  if (state === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Cargando admin…</p>
      </div>
    );
  }

  if (state !== 'open') {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5 py-12 text-foreground">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-white/10 bg-black/60 p-7 backdrop-blur"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Admin // Local</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-tight">
            {state === 'setup' ? 'Definir contraseña' : 'Desbloquear panel'}
          </h1>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {state === 'setup'
              ? 'Primera vez: elegí una contraseña para este navegador. Se guarda como hash SHA-256 en localStorage.'
              : 'Ingresá la contraseña configurada para este navegador.'}
          </p>

          <label className="mt-5 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">Contraseña</span>
            <input
              type="password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoFocus
              className="mt-2 h-10 w-full rounded-sm border border-white/15 bg-white/5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>

          {error ? (
            <p role="alert" className="mt-3 text-xs text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-5 w-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
          >
            {state === 'setup' ? 'Crear administrador local' : 'Desbloquear'}
          </button>

          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
            Local protection only. It does not secure the deployment and does not replace institutional
            authentication.
          </p>

          <Link href="/" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-metal hover:text-primary">
            ← Volver al sitio
          </Link>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <AdminHeader onBloquear={() => {
        closeAdminSession();
        setState('locked');
      }} />
      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}

function AdminHeader({ onBloquear }: { onBloquear: () => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenúOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-5 py-3 md:px-8">
        <Link href="/admin" className="font-display text-sm font-bold uppercase tracking-[0.2em] transition hover:text-primary">
          ISA <span className="text-primary">Admin</span>
        </Link>

        <button
          type="button"
          onClick={() => setMenúOpen((open) => !open)}
          className="ml-auto border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:hidden"
          aria-expanded={menuOpen}
        >
          Menú
        </button>

        <nav
          aria-label="Admin sections"
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-wrap items-center gap-1 md:flex md:w-auto`}
        >
          <AdminNav href="/admin" label="Resumen" active={pathname === '/admin'} />
          <span className="mx-2 hidden h-4 w-px bg-white/10 md:block" />
          {ADMIN_ENTITIES.map((entity) => (
            <AdminNav
              key={entity.collection}
              href={`/admin/${entity.collection}`}
              label={entity.label}
              active={pathname === `/admin/${entity.collection}`}
            />
          ))}
          <span className="mx-2 hidden h-4 w-px bg-white/10 md:block" />
          <AdminNav
            href="/admin/accreditation"
            label="Acreditaciones"
            active={pathname === '/admin/accreditation'}
          />
          <AdminNav href="/admin/import" label="Importar" active={pathname === '/admin/import'} />
          <AdminNav href="/admin/settings" label="Ajustes" active={pathname === '/admin/settings'} />
        </nav>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Ver sitio
          </Link>
          <button
            type="button"
            onClick={onBloquear}
            className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            Bloquear
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminNav({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </Link>
  );
}
