import Link from 'next/link';

import { DataProvider } from '@/components/app/data-provider';
import { ImportCenter } from '@/components/admin/import-center';

export const metadata = {
  title: 'CSV Import Center — ISA',
  description: 'Import museums, institutions and questions from CSV files.',
};

export default function AdminImportPage() {
  return (
    <DataProvider>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b border-white/10 bg-black/60 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-5 py-3 md:px-8">
            <Link
              href="/"
              className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground transition hover:text-primary"
            >
              ISA <span className="text-primary">Series</span>
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">
              Local administration
            </span>
            <nav className="ml-auto flex items-center gap-1">
              <Link
                href="/museums"
                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              >
                Archive
              </Link>
              <Link
                href="/map"
                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              >
                Plot
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-12">
          <ImportCenter />
        </main>
      </div>
    </DataProvider>
  );
}
