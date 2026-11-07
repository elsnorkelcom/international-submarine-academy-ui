'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import { useApp } from '@/components/app/data-provider';
import { VerticalVideo } from '@/components/media/vertical-video';
import { SAMPLE_VIDEO, youtubeId } from '@/lib/media/youtube';
import type { Compartment, Episode, Mission, Museum, Question } from '@/lib/domain/types';
import { localize } from '@/lib/domain/types';

interface MuseumFileData {
  museum: Museum;
  compartments: Compartment[];
  episodes: Episode[];
  missions: Mission[];
  questions: Question[];
}

export function MuseumFile({ id }: { id: string }) {
  const { database, ready, language, t } = useApp();
  const [data, setData] = useState<MuseumFileData | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database) {
        return;
      }

      const museum = await database.repository('museums').get(id);

      if (!museum || museum.deletedAt) {
        if (!cancelled) setMissing(true);
        return;
      }

      const [compartments, episodes, missions, questions] = await Promise.all([
        database.repository('compartments').list({ pageSize: 0 }),
        database.repository('episodes').list({ pageSize: 0 }),
        database.repository('missions').list({ pageSize: 0 }),
        database.repository('questions').list({ pageSize: 0 }),
      ]);

      if (cancelled) {
        return;
      }

      setData({
        museum,
        compartments: compartments.items.filter((item) => item.museumId === museum.id),
        episodes: episodes.items.filter((item) => item.museumId === museum.id),
        missions: missions.items.filter((item) => item.museumId === museum.id),
        questions: questions.items.filter((item) => item.museumId === museum.id),
      });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database, id]);

  if (!ready) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>;
  }

  if (missing) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm text-foreground">{t.file.notFound}</p>
        <Link href="/museums" className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {t.file.notFoundHint}
        </Link>
      </div>
    );
  }

  if (!data) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>;
  }

  const { museum, compartments, episodes, missions, questions } = data;
  const validated = museum.validation === 'validated';

  return (
    <article>
      <Link
        href="/museums"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary"
      >
        ← {t.common.back}
      </Link>

      <header className="mt-5 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          {t.file.eyebrow} · {museum.dossier || museum.id}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {localize(museum.name, language)}
        </h1>
        <p className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-primary/90">
          {localize(museum.museumName, language)}
        </p>

        <span
          className={`mt-4 inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
            validated
              ? 'border-primary/40 text-primary'
              : 'border-amber-300/40 text-amber-200'
          }`}
        >
          {validated ? t.common.validated : t.common.pending}
        </span>
      </header>

      <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-white/10 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <Meta label={t.file.location} value={[museum.city, museum.country].filter(Boolean).join(', ')} />
        <Meta label={t.file.vessel} value={museum.vesselType} />
        <Meta label={t.file.propulsion} value={museum.propulsion} />
        <Meta
          label={t.file.situation}
          value={museum.situation ? (t.situation[museum.situation as keyof typeof t.situation] ?? museum.situation) : ''}
        />
        <Meta label={t.file.origin} value={museum.origin} />
        <Meta label={t.file.launched} value={museum.launchYear ? String(museum.launchYear) : ''} />
        <Meta label={t.file.source} value={museum.source} />
      </dl>

      <section className="mt-8 max-w-3xl">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">{t.file.description}</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {validated
            ? localize(museum.description, language)
            : `${t.file.pendingInfo} ${localize(museum.description, language)}`}
        </p>
        {museum.notes ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.file.notes}: {museum.notes}
          </p>
        ) : null}
      </section>

      {(() => {
        const ownId = youtubeId(museum.mediaUrl);
        const videoId = ownId ?? SAMPLE_VIDEO.id;

        return (
          <section className="mt-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">{t.file.video}</h2>
            <div className="mt-3">
              <VerticalVideo
                videoId={videoId}
                title={localize(museum.name, language)}
                sample={!ownId}
                credit={ownId ? undefined : { author: SAMPLE_VIDEO.author, url: SAMPLE_VIDEO.authorUrl }}
                sampleLabel={t.file.videoSample}
                creditLabel={t.file.videoCredit}
              />
            </div>
          </section>
        );
      })()}

      <section className="mt-8 flex flex-wrap gap-3">
        {museum.website ? (
          <a
            href={museum.website}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition hover:border-primary hover:text-primary"
          >
            {t.file.external} ↗
          </a>
        ) : null}

        {museum.mediaUrl ? (
          <a
            href={museum.mediaUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition hover:bg-primary/20"
          >
            {t.file.film} ▶
          </a>
        ) : null}
      </section>

      {compartments.length + episodes.length + missions.length + questions.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-metal">{t.file.related}</h2>

          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <RelatedGroup title={t.file.compartments}>
              {compartments.map((item) => (
                <RelatedItem key={item.id} label={localize(item.name, language)} code={item.id} />
              ))}
            </RelatedGroup>

            <RelatedGroup title={t.file.episodes}>
              {episodes.map((item) => (
                <RelatedItem key={item.id} label={localize(item.title, language)} code={item.id} />
              ))}
            </RelatedGroup>

            <RelatedGroup title={t.file.missions}>
              {missions.map((item) => (
                <RelatedItem key={item.id} label={localize(item.title, language)} code={item.id} />
              ))}
            </RelatedGroup>

            <RelatedGroup title={t.file.questions}>
              {questions.map((item) => (
                <RelatedItem key={item.id} label={localize(item.text, language)} code={item.id} />
              ))}
            </RelatedGroup>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-metal">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

function RelatedGroup({ title, children }: { title: string; children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      <ul className="mt-2 space-y-2">{children}</ul>
    </div>
  );
}

function RelatedItem({ label, code }: { label: string; code: string }) {
  return (
    <li className="border-l border-primary/30 pl-3">
      <p className="text-sm text-foreground">{label}</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">{code}</p>
    </li>
  );
}
