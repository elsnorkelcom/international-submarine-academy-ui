'use client';

import { useState } from 'react';
import { useProgress } from '@/components/learn/progress-provider';
import type { AppStrings } from '@/lib/i18n/app';
import { useApp } from '@/components/app/data-provider';

type Item = { id: string; title: string; description: string; status: 'idea'|'planned'|'in_progress'|'done' };

const SAMPLE: Item[] = [
  { id: 'BL-001', title: 'Mobile-first vertical poster', description: 'Adapt UI cards and episode view to 9:16 poster', status: 'done' },
  { id: 'BL-002', title: 'Ranking global opt-in', description: 'Backend + privacy for daily ranking', status: 'planned' },
  { id: 'BL-003', title: 'Offline PWA', description: 'Service worker and seed synchronization for offline use', status: 'idea' },
  { id: 'BL-004', title: 'Badge social image generator', description: 'Server-side image generation for richer shares', status: 'in_progress' },
];

export function BacklogView({ t }: { t: AppStrings['learn']['series'] }) {
  const { reset } = useProgress();
  const { language } = useApp();
  const [items] = useState<Item[]>(SAMPLE);
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    reset();
    setConfirming(false);
    // simple feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-tight">Backlog · Ideas</h1>
        <p className="mt-2 text-sm text-muted-foreground">Listado temporal de ideas y su estado de implementación.</p>
      </header>

      <section className="mt-6 border border-white/6 bg-card/40 p-4">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-md border p-3 bg-card/30 flex items-start justify-between">
              <div>
                <p className="font-display text-sm font-bold uppercase">{it.title} <span className="font-mono text-[10px] ml-2 text-muted-foreground">{it.id}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>
              </div>
              <div className="font-mono text-[11px] uppercase">{it.status.replace('_',' ')}</div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {confirming ? (
            <div className="flex items-center gap-3">
              <button onClick={handleReset} className="border border-primary/40 bg-primary/10 px-4 py-2 text-primary">Confirm reset profile</button>
              <button onClick={() => setConfirming(false)} className="border px-3 py-2">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="border border-primary/40 bg-primary/10 px-4 py-2 text-primary">Reset profile (for testing)</button>
          )}
        </div>
      </section>
    </div>
  );
}
