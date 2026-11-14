'use client';

import { useState } from 'react';
import { localize, type Badge, type LanguageCode } from '@/lib/domain/types';
import { getMessages } from '@/lib/i18n';

export function BadgePopup({ badge, language }: { badge: Badge; language: LanguageCode }) {
  const [open, setOpen] = useState(false);

  async function share() {
    const text = `${localize(badge.name, language)} · ${localize(badge.criteria, language)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: localize(badge.name, language), text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        // show small feedback (not implemented here)
      } else {
        const u = encodeURIComponent(text);
        window.open(`https://twitter.com/intent/tweet?text=${u}`, '_blank');
      }
    } catch {
      // ignore
    }
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
                onClick={() => void share()}
                className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary"
              >
                {language === 'es' ? 'Compartir' : 'Share'}
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
