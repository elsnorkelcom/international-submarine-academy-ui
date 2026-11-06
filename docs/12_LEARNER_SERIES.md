# ISA · Learner series

Routes: `/series`, `/episodes?id=<missionId>`, `/profile`.
Scope: real learner flow over the browser database. No accounts, no server.

---

## 1. Routes

| Route | Content |
|---|---|
| `/series` | Seasons from the database, missions per season, completion and lock state |
| `/episodes?id=…` | Mission intro, question engine, reward, civil society connection |
| `/profile` | Points, streaks, completed missions, earned recognitions, local reset |

The mission player reads the id from the query string, so new missions created in
the admin panel work without a rebuild.

## 2. Progression rules

- Only `published` seasons, episodes, missions and questions are shown.
- The first season with published missions is open.
- A later season opens when the previous one has at least one completed mission.
- A mission is *completed* when its question is answered correctly.

## 3. Question engine

- Four options from the question record, one correct answer.
- Optional timer from `settings.timerSeconds`, enabled by
  `featureFlags.enableTimer`; running out resolves the question as incorrect.
- Attempts limited by `settings.maxAttempts`; a wrong answer allows a retry until
  the limit, then reveals the correct option.
- Feedback, explanation and the civil society connection appear after resolving.

## 4. Progress model

`lib/learning/progress.ts` stores a single versioned object in localStorage:

```ts
{ version, points, streak, bestStreak, missions: { [missionId]: MissionResult }, badges: string[] }
```

Scoring: 100 points for a first correct answer, −20 per extra attempt, floor 25.
Replaying a completed mission does not add points twice. A badge becomes part of
the record only the first time it is earned.

## 5. Components

```text
components/learn/learn-shell.tsx        Navigation and language switch
components/learn/learn-root.tsx         Data + progress providers
components/learn/series-view.tsx        Seasons and missions
components/learn/mission-view.tsx       Mission orchestration
components/learn/question-engine.tsx    Question, timer, feedback
components/learn/profile-view.tsx       Local record and badges
components/learn/progress-provider.tsx  Progress context
```

## 6. Verification

Chrome over CDP against the dev server:

| Step | Result |
|---|---|
| `/series` | Steel season with its mission and `00/01` counter |
| Open mission | Museum U-995, Control Room, Periscope, objective |
| Begin → answer B | Reward screen: “Recognition unlocked” |
| Badge | Submarine Expedition Credential |
| `/profile` | 100 points, streak 1, 1 mission, credential listed |
| `tsc --noEmit` / `pnpm build` | Clean |

## 7. Limits

- Progress is per browser and per device; there is no sync.
- The `ISA-DEMO` gate and the legacy Acero/Cobre demo still exist and are not yet
  replaced by this flow.
- Episodes without a published question show “no question yet” and cannot start.
- No video playback: the episode media field is stored but not rendered.
- No analytics or aggregated metrics.
