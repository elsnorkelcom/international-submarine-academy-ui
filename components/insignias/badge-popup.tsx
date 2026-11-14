'use client';

import { useState } from 'react';
import { localize, type Badge, type LanguageCode } from '@/lib/domain/types';
import { getMessages } from '@/lib/i18n';

export function BadgePopup({ badge, language }: { badge: Badge; language: LanguageCode }) {
  const [open, setOpen] = useState(false);

  // Share reserved: show icon only, no action (placeholder for future share implementation)
  function share() {
    // intentionally empty — placeholder to reserve UI space
    return;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border rounded p-0 bg-transparent"
        aria-label={localize(badge.name, language)}
      >
        {badge.icon.startsWith('/') ? (
          <img src={badge.icon} alt={localize(badge.name, language)} className="size-12 object-contain" />
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-sm rounded bg-card/90 p-4 text-center">
            {badge.icon.startsWith('/') ? (
              <img src={badge.icon} alt="" className="mx-auto size-24 object-contain" />
            ) : null}
            <h3 className="mt-3 font-display text-lg font-bold uppercase">{localize(badge.name, language)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{localize(badge.criteria, language)}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => share()}
                disabled
                aria-disabled
                className="border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary opacity-60"
                title={language === 'es' ? 'Compartir (próximamente)' : 'Share (coming soon)'}
              >
                <svg className="inline-block size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
