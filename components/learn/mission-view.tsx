'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useApp } from '@/components/app/data-provider';
import { QuestionEngine, type QuestionOutcome } from '@/components/learn/question-engine';
import { useProgress } from '@/components/learn/progress-provider';
import { completedMissionIds, evaluateAwards } from '@/lib/badges/rules';
import { pickVariant } from '@/lib/learning/variant';
import {
  localize,
  type Badge,
  type Compartment,
  type Episode,
  type Mission,
  type Museum,
  type Question,
  type Season,
  type Settings,
  type SubmarineSystem,
} from '@/lib/domain/types';

interface MissionBundle {
  mission: Mission;
  episode: Episode | null;
  season: Season | null;
  museum: Museum | null;
  compartment: Compartment | null;
  system: SubmarineSystem | null;
  question: Question | null;
  badge: Badge | null;
  settings: Settings | null;
}

export function MissionView() {
  const { database, ready, language, t } = useApp();
  const { progress, record, grantBadges } = useProgress();
  const [missionId, setMissionId] = useState<string | null>(null);
  const [bundle, setBundle] = useState<MissionBundle | null>(null);
  const [stage, setStage] = useState<'intro' | 'question' | 'reward'>('intro');
  const [outcome, setOutcome] = useState<QuestionOutcome | null>(null);
  const [reward, setReward] = useState<{ points: number; badge: string | null } | null>(null);
  const [awarded, setAwarded] = useState<Badge[]>([]);

  // Kept in a ref so the loader reads the current progress without re-running
  // and overwriting the reward screen after a mission is recorded.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMissionId(params.get('id'));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!database || !missionId) {
        return;
      }

      const mission = await database.repository('missions').get(missionId);

      if (!mission || mission.status !== 'published') {
        if (!cancelled) setBundle(null);
        return;
      }

      const [episode, season, museum, compartment, system, questions, badges, settings] = await Promise.all([
        mission.episodeId ? database.repository('episodes').get(mission.episodeId) : Promise.resolve(null),
        mission.seasonId ? database.repository('seasons').get(mission.seasonId) : Promise.resolve(null),
        mission.museumId ? database.repository('museums').get(mission.museumId) : Promise.resolve(null),
        mission.compartmentId ? database.repository('compartments').get(mission.compartmentId) : Promise.resolve(null),
        mission.equipmentId ? database.repository('systems').get(mission.equipmentId) : Promise.resolve(null),
        database.repository('questions').list({ pageSize: 0 }),
        database.repository('badges').list({ pageSize: 0 }),
        database.settings().get(),
      ]);

      if (cancelled) {
        return;
      }

      const ownedQuestions = questions.items.filter((item) => item.missionId === mission.id);
      const publishedQuestions = ownedQuestions.filter((item) => item.status === 'published');
      const variants = [...(publishedQuestions.length ? publishedQuestions : ownedQuestions)].sort(
        (a, b) => (a.variantIndex ?? 0) - (b.variantIndex ?? 0),
      );
      const question = pickVariant(variants, mission.cellIndex ?? 0);

      const badge = badges.items.find((item) => item.missionId === mission.id && item.status === 'published') ?? null;

      if (progressRef.current.missions[mission.id]?.correct) {
        setStage('reward');
        setReward({ points: 0, badge: null });
      }

      setBundle({ mission, episode, season, museum, compartment, system, question, badge, settings });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [database, missionId]);

  const timerSeconds = useMemo(() => {
    if (!bundle?.settings) return null;
    return bundle.settings.featureFlags.enableTimer ? bundle.settings.timerSeconds : null;
  }, [bundle]);

  async function handleResolved(result: QuestionOutcome) {
    if (!bundle) {
      return;
    }

    if (!result.correct) {
      const earned = record(
        {
          missionId: bundle.mission.id,
          episodeId: bundle.mission.episodeId,
          seasonId: bundle.mission.seasonId,
          badgeId: bundle.badge?.id ?? null,
        },
        result,
      );

      setOutcome(result);
      setReward({ points: earned.pointsEarned, badge: earned.newBadge });
      setStage('reward');
      return;
    }

    const earned = record(
      {
        missionId: bundle.mission.id,
        episodeId: bundle.mission.episodeId,
        seasonId: bundle.mission.seasonId,
        badgeId: bundle.badge?.id ?? null,
      },
      result,
    );

    setOutcome(result);
    setReward({ points: earned.pointsEarned, badge: earned.newBadge });

    // End-of-season rules run after the mission is recorded.
    try {
      const context = {
        database: database!,
        mission: bundle.mission,
        completedMissionIds: [
          ...new Set([...completedMissionIds(progress), bundle.mission.id]),
        ],
        baseUrl: window.location.origin,
      };

      const awards = await evaluateAwards(context);

      if (awards.badges.length > 0) {
        grantBadges(awards.badges.map((item) => item.id));
        setAwarded(awards.badges);
      }
    } catch {
      // Awarding is additive: a failure must not block the mission result.
    }

    setStage('reward');
  }

  if (!ready) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>;
  }

  if (!missionId) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm text-foreground">{t.learn.series.empty}</p>
        <Link href="/series" className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {t.learn.episode.back}
        </Link>
      </div>
    );
  }

  if (!bundle) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.common.loading}</p>;
  }

  const { mission, museum, compartment, system, question, badge, season } = bundle;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/series"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary"
      >
        ← {t.learn.episode.back}
      </Link>

      <header className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: season?.colorTheme }}>
          {season ? localize(season.title, language) : ''} · {mission.id}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
          {localize(mission.title, language)}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {localize(mission.description, language)}
        </p>
      </header>

      <dl className="mt-6 grid gap-3 border-y border-white/10 py-4 sm:grid-cols-3">
        <Meta label={t.learn.episode.museum} value={museum ? localize(museum.name, language) : ''} />
        <Meta label={t.learn.episode.compartment} value={compartment ? localize(compartment.name, language) : ''} />
        <Meta label={t.learn.episode.equipment} value={system ? localize(system.name, language) : ''} />
      </dl>

      <p className="mt-4 text-sm text-foreground/90">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">
          {t.learn.episode.objective}:{' '}
        </span>
        {localize(mission.learningObjective, language)}
      </p>

      {stage === 'intro' ? (
        <button
          type="button"
          disabled={!question}
          onClick={() => setStage('question')}
          className="mt-6 border border-primary/40 bg-primary/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition enabled:hover:bg-primary/20 disabled:opacity-40"
        >
          {question ? t.learn.episode.start : t.learn.episode.noQuestion}
        </button>
      ) : null}

      {stage === 'question' && question ? (
        <div className="mt-8 border-t border-white/10 pt-6">
          <QuestionEngine
            question={question}
            language={language}
            t={t.learn.episode}
            timerSeconds={timerSeconds}
            maxAttempts={bundle.settings?.maxAttempts ?? 2}
            onResolved={(result) => void handleResolved(result)}
          />
        </div>
      ) : null}

      {stage === 'reward' ? (
        <section className="mt-8 border border-primary/40 bg-primary/5 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{t.learn.reward.title}</p>

          {badge && (reward?.badge || awarded.some((item) => item.id === badge.id)) && badge.icon.startsWith('/') ? (
            <img src={badge.icon} alt="" className="mt-3 size-16 object-contain" />
          ) : null}

          {badge && (reward?.badge || awarded.some((item) => item.id === badge.id)) ? (
            <p className="mt-3 font-display text-2xl font-extrabold uppercase tracking-wide text-foreground">
              {localize(badge.name, language)}
            </p>
          ) : (
            <p className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-foreground">
              {t.learn.episode.results}
            </p>
          )}

          {awarded.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {awarded.map((item) => (
                <li key={item.id} className="flex items-center gap-2 border-l border-primary/40 pl-3 text-sm text-foreground">
                  {item.icon.startsWith('/') ? (
                    <img src={item.icon} alt="" className="size-8 object-contain" />
                  ) : null}
                  {localize(item.name, language)}{' '}
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-3 text-sm text-foreground/90">
            {t.learn.reward.points}:{' '}
            <strong className="text-primary">+{reward?.points ?? 0}</strong>
          </p>

          <p className="mt-1 text-sm text-foreground/80">
            {t.learn.profile.points}: {progress.points} · {t.learn.episode.streak}: {progress.streak}
          </p>

          {outcome ? (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {outcome.correct ? t.learn.episode.correct : t.learn.episode.incorrect} · {t.learn.episode.correctAnswer}{' '}
              {question?.correctOptionId}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/series"
              className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition hover:border-primary hover:text-primary"
            >
              {t.learn.episode.back}
            </Link>
            <Link
              href="/profile"
              className="border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary transition hover:bg-primary/20"
            >
              {t.learn.nav.profile}
            </Link>
          </div>

          <p className="mt-5 text-[10px] leading-relaxed text-muted-foreground">{t.learn.profile.disclaimer}</p>
        </section>
      ) : null}

      <p className="mt-8 text-[10px] leading-relaxed text-muted-foreground">{t.learn.episode.fiction}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-metal">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}
