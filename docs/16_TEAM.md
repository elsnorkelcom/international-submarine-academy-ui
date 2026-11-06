# ISA · Team configuration

How the work is split across agents in this repository, and why.

---

## 1. What kind of work this project actually has

| Work type | Files | Parallelizable |
|---|---|---|
| Data and configuration pipeline | `scripts/`, `lib/data/`, `lib/domain/` | Yes, disjoint from UI |
| Learner experience | `components/learn/`, `app/series`, `app/episodes`, `app/profile` | Yes, disjoint from data |
| Administration | `components/admin/`, `app/admin/` | Yes, but shares `app/` with the learner area |
| Content and editorial | `lib/i18n/`, `docs/`, datasets | Partly |
| Verification | build, typecheck, browser checks | Only after changes land |

The heavy work is sequential in nature (one app, tight coupling), so a large fan-out is wasteful. A four-slot team is enough.

## 2. Recommended roles

| Slot | Role | Writes | Never writes |
|---|---|---|---|
| Lead | Coordination, review, final verification, deploy | everything | — |
| 1 | Data and configuration engineer | `scripts/`, `lib/data/`, `lib/domain/`, `docs/15_*`, config workflow | `components/`, `app/`, `lib/i18n/` |
| 2 | Learner UI engineer | `components/learn/`, `components/series/`, `lib/i18n/app.ts` | `lib/data/`, `scripts/` |
| 3 | Administration UI engineer | `components/admin/`, `app/admin/` | `lib/data/`, `components/learn/` |
| 4 | QA and verification | `docs/qa/` only, read-only elsewhere | any source file |

Content/editorial does not need a dedicated slot yet: it is mostly `lib/i18n` and dataset edits that the Lead or the relevant engineer can own.

## 3. Sequencing rules

1. Data changes land before UI consumes them (UI depends on `lib/data/config.ts` and repositories).
2. QA never runs `pnpm build` while an engineer is building: `.next` is shared.
3. Only one agent runs `pnpm dev` on port 3000 at a time.
4. Only the Lead commits and pushes.

## 4. Task board conventions

- One shared task per deliverable, with `write_scopes` matching the role table.
- A task is claimed with the current revision, then completed with the new revision.
- Verification is part of the task: typecheck, build, and a browser check when UI is touched.
- Reports to the Lead are short: files, evidence, not verified, blockers.

## 5. Commands every agent needs

```powershell
$node = 'C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe'
$pnpm = 'C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs'
$python = 'C:\Users\MDQdam\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe'

& $node $pnpm exec tsc --noEmit --incremental false
& $node $pnpm build
& $node $pnpm dev
& $python scripts/sync_config.py --check ...
```

Browser verification uses Chrome headless over CDP against `http://localhost:3000`.

## 6. Current status (6 Nov 2026)

- The session already had eight teammates from earlier phases (audits, sheet contract, gate implementation).
- The member limit is eight, so new roles cannot be spawned without freeing slots.
- Waking any existing teammate fails: the runs end without a closing message and the shared tasks stay unclaimed.
- Until the team is reset, work runs Lead-only; the tasks created for this phase (`task-8`, `task-9`, `task-10`) remain pending and describe exactly what each role must do.

## 7. When the team is reset

1. Create the four roles above with fresh context.
2. Assign `task-8` to the data engineer, `task-9` to the learner UI engineer.
3. Keep `task-10` blocked by both; QA starts when they complete.
4. Only the Lead commits.
