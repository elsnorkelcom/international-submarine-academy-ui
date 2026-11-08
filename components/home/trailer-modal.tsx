'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import { SAMPLE_VIDEO } from '@/lib/media/youtube';

/** Netflix-style trailer modal: dark overlay, 16:9 player, ESC/backdrop to close. */
export function TrailerModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tráiler de la serie ISA"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl border border-white/15 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            Tráiler · ISA Serie Vertical
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar tráiler"
            className="flex size-8 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${SAMPLE_VIDEO.id}?autoplay=1&rel=0&modestbranding=1`}
            title="Tráiler de la serie ISA"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        <p className="px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-200">
          Video de muestra · no es una producción ISA · crédito: {SAMPLE_VIDEO.author}
        </p>
      </div>
    </div>
  );
}
