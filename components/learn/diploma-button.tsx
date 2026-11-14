'use client';

import { useCallback, useState } from 'react';

import { getFishNick } from '@/lib/learning/fish';
import { localize, type LanguageCode } from '@/lib/domain/types';
import type { AppStrings } from '@/lib/i18n/app';

interface DiplomaButtonProps {
  missionTitle: LocalizedTextLike;
  language: LanguageCode;
  t: AppStrings['learn']['episode'];
}

type LocalizedTextLike = { en: string; es: string };

/** Diploma de Acero: descargable en la app, sin datos personales. */
export function DiplomaButton({ missionTitle, language, t }: DiplomaButtonProps) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  const buildDiploma = useCallback((): string | null => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const nick = getFishNick();
    const nickLabel = language === 'es' ? nick.es : nick.en;
    const date = new Date().toLocaleDateString(language === 'es' ? 'es-AR' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Fondo y marco
    ctx.fillStyle = '#0B0F12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#B87333';
    ctx.lineWidth = 6;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

    ctx.textAlign = 'center';

    ctx.fillStyle = '#00E08A';
    ctx.font = '700 30px monospace';
    ctx.fillText('ISA · INTERNATIONAL SUBMARINE ACADEMY', canvas.width / 2, 140);

    ctx.fillStyle = '#8FA3B0';
    ctx.font = '600 22px monospace';
    ctx.fillText(language === 'es' ? 'DIPLOMA DE EXPEDICIÓN SUBMARINA' : 'SUBMARINE EXPEDITION DIPLOMA', canvas.width / 2, 200);

    // Nombre del nick
    ctx.fillStyle = '#F5F7FA';
    ctx.font = '800 84px Georgia, serif';
    ctx.fillText(nickLabel.toUpperCase(), canvas.width / 2, 350);

    ctx.strokeStyle = '#B87333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 220, 395);
    ctx.lineTo(canvas.width / 2 + 220, 395);
    ctx.stroke();

    ctx.fillStyle = '#C9D2DA';
    ctx.font = '400 28px Georgia, serif';
    const line = language === 'es'
      ? 'Completó la visita al submarino museo y demostró'
      : 'Completed the museum submarine visit and showed';
    ctx.fillText(line, canvas.width / 2, 460);
    ctx.fillText(
      language === 'es' ? 'atención, memoria y espíritu de equipo.' : 'attention, memory and team spirit.',
      canvas.width / 2,
      505,
    );

    ctx.fillStyle = '#F5F7FA';
    ctx.font = '700 30px monospace';
    ctx.fillText(localize(missionTitle, language).toUpperCase().slice(0, 46), canvas.width / 2, 590);

    ctx.fillStyle = '#8FA3B0';
    ctx.font = '400 24px monospace';
    ctx.fillText(date, canvas.width / 2, 650);

    ctx.fillStyle = '#6B7684';
    ctx.font = '400 18px monospace';
    ctx.fillText(
      language === 'es'
        ? 'Reconocimiento simbólico · no es una certificación · Todo lo que ves es ficción'
      : 'Symbolic recognition · not a certification · Everything you see is fiction',
      canvas.width / 2,
      canvas.height - 80,
    );

    return canvas.toDataURL('image/png');
  }, [language, missionTitle]);

  function download() {
    try {
      const dataUrl = buildDiploma();
      if (!dataUrl) {
        setStatus('error');
        return;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'ISA-diploma-acero.png';
      link.click();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={download}
        className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
      >
        {t.diploma}
      </button>
      <p className="mt-2 text-[10px] text-muted-foreground" role="status">
        {status === 'done' ? t.diplomaSaved : status === 'error' ? t.diplomaError : t.diplomaHint}
      </p>
    </div>
  );
}
