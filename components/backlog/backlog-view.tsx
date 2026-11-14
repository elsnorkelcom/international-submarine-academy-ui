'use client';

import { useState } from 'react';
import { useProgress } from '@/components/learn/progress-provider';
import type { AppStrings } from '@/lib/i18n/app';
import { useApp } from '@/components/app/data-provider';

type Item = { id: string; title: string; description: string; status: 'idea'|'planned'|'in_progress'|'done' };

const SAMPLE: Item[] = [
  { id: 'BL-001', title: 'Finalizar mecanismos Acero', description: 'Completar mechanismEs/En para todas las misiones de Acero y revisar textos del guía (veteranNote).', status: 'in_progress' },
  { id: 'BL-002', title: 'Ribbons gráficos Acero', description: 'Finalizar gráficos de ribbons para Acero (equipo de arte); copiar a public/images/badges/acero/ribbons/', status: 'in_progress' },
  { id: 'BL-003', title: 'Coin Temporada Acero', description: 'Validar BDG-COIN-STEEL, icon y regla (season-count); mostrar modal especial al ganar.', status: 'done' },
  { id: 'BL-004', title: 'Plantilla video vertical (9:16)', description: 'Definir y versionar plantilla para episodios verticales: tiempos, HUD, safe areas, subtítulos VTT.', status: 'in_progress' },
  { id: 'BL-005', title: 'Piloto vertical MIS-AC-03', description: 'Generar piloto 30s, subir a YouTube no-listado, asociar mediaUrl y poster.', status: 'planned' },
  { id: 'BL-006', title: 'VTT y accesibilidad', description: 'Generar VTT ES/EN para cada video y probar reproducción en la app; entregar archivos con cada episodio.', status: 'planned' },
  { id: 'BL-007', title: 'Diploma de Acero', description: 'Pulir diseño del diploma descargable y mensaje de cierre; prueba en navegadores móviles.', status: 'in_progress' },
  { id: 'BL-008', title: 'Workflow isa-master.xlsx', description: 'Consolidar la planilla maestra y documentar el flujo: editar → sync_config → isa-config.json → bump seed.', status: 'planned' },
  { id: 'BL-009', title: 'Script copy_assets', description: 'Automatizar copia y manifest de badges desde carpeta de arte (scripts/copy_assets.py).', status: 'done' },
  { id: 'BL-010', title: 'Serverless OG images', description: 'Planificar endpoint serverless para generar OG images (postergar)', status: 'idea' },
  { id: 'BL-011', title: 'Ranking local y opt-in', description: 'Mantener puntos ocultos en perfil; desarrollar tarjeta de ranking opt-in y compartir.', status: 'planned' },
  { id: 'BL-012', title: 'PWA / Offline', description: 'Plan de PWA: service worker, cache de assets, respaldo de seed.', status: 'idea' },
  { id: 'BL-013', title: 'QA y accesibilidad', description: 'Checklist de accesibilidad, pruebas 390px y voiceover; control de contraste y subtítulos.', status: 'in_progress' },
  { id: 'BL-014', title: 'CI y checks', description: 'Agregar step en CI para validar rutas estáticas (incluye /backlog) y build export.', status: 'planned' },
  { id: 'BL-015', title: 'Política y consentimientos', description: 'Plantilla de consentimiento para uso de imagen/voz en videos; almacenar comprobantes.', status: 'planned' },
  { id: 'BL-016', title: 'Templates para productores', description: 'Instrucciones y plantilla CapCut / export para productores externos.', status: 'planned' },
  { id: 'BL-017', title: 'Badge share placeholder', description: 'Mostrar icono compartir en popup (marcar espacio) — no funcional por ahora.', status: 'done' },
  { id: 'BL-018', title: 'Notificación coin', description: 'Modal especial y copy para cuando un usuario gana la coin de temporada.', status: 'done' },
  { id: 'BL-019', title: 'Auditoría de contenidos', description: 'Revisión editorial de textos para evitar lenguaje bélico y asegurar contexto patrimonial.', status: 'planned' },
  { id: 'BL-020', title: 'Integración con museums partners', description: 'Procedimiento para añadir museos firmantes y metas de publicación.', status: 'idea' },
  { id: 'BL-021', title: 'Pruebas de usuario (beta)', description: 'Reclutar 5–10 testers, checklist de tareas y observaciones.', status: 'planned' },
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
