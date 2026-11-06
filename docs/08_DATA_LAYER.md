# ISA · Data layer (Stage 1)

Specification: `docs/00_DOCUMENTO_BASE.md`.
Scope of this stage: domain model, storage adapters, repositories and seed data.
No UI, routes or network calls were added.

---

## 1. Architecture

```text
lib/domain/types.ts        Entity contracts, enumerations, bilingual text
lib/data/storage.ts        StorageAdapter contract + search/sort helpers
lib/data/memory-storage.ts In-memory adapter (tests, Node, fallback)
lib/data/indexeddb-storage.ts IndexedDB adapter (browser persistence)
lib/data/repository.ts     Repository<T> contract + LocalRepository<T>
lib/data/sheets-repository.ts  Future remote contracts (not implemented)
lib/data/seed.ts           Pilot dataset
lib/data/bootstrap.ts      First-run seeding
```

The UI must depend on `Repository<T>` only. Nothing in the UI may import
IndexedDB or localStorage directly.

---

## 2. Design decisions

| Decision | Rationale |
|---|---|
| Bilingual `LocalizedText` from day one | The language selector ships without a data migration. |
| Audit fields on every record | Required by the specification and by the traceability principle. |
| Soft delete + restore | Admin must never lose content by accident. |
| `StorageAdapter` injection | Same repository contract runs in Node, browser and a future remote source. |
| Row-resilient import | One invalid row must not abort a 160-row batch. |
| Readable IDs | `INS-`, `MUS-`, `EPI-`, `QST-`, `SEA-`, `CMP-`, `SYS-`, `MIS-`, `BDG-`, `ROL-`, `DIS-`, `KEY-`. |
| No plain-text keys | `AccessKey` stores a SHA-256 hash only; keys are generated in the admin panel. |

Localized text rules:

- `en` is the reference language and the fallback;
- `es` is required in the type but may be empty only for pending content;
- use `localize(text, language)` for display.

---

## 3. Entities

Thirteen collections: `institutions`, `accessKeys`, `museums`, `compartments`,
`systems`, `seasons`, `episodes`, `missions`, `questions`, `badges`, `roles`,
`disciplines` and `settings` (singleton, id `settings`).

`EntityByCollection` maps each collection name to its type, so
`db.repository('museums')` returns `Museum` records without casts.

---

## 4. Usage

```ts
import { IndexedDbStorage, LocalDatabase, ensureSeed } from '@/lib/data';

const database = new LocalDatabase(new IndexedDbStorage(), { actor: 'admin' });
await ensureSeed(database, typeof window === 'undefined' ? null : window.localStorage);

const museums = database.repository('museums');
const page = await museums.list({ search: 'u-995', sortBy: 'name', page: 1, pageSize: 25 });

await museums.create({ /* fields, id optional */ });
await museums.update('MUS-U995', { city: 'Laboe' });
await museums.softDelete('MUS-U995');
await museums.duplicate('MUS-U995');
await museums.importRecords(rows, 'upsert');
```

Import modes: `create-only`, `upsert`, `replace`.

`ImportSummary` reports `total`, `created`, `updated`, `skipped`, `failed` and a
per-row `issues` list that can be exported as CSV by the Import Center.

---

## 5. Seed dataset

| Collection | Records |
|---|---|
| Seasons | Steel, Copper, Bronze, Silver, Gold |
| Disciplines | Science, Technology, Engineering, Mathematics, Humanities and Arts |
| Roles | Machinist, Electrician, Electronics Technician, Naval Officer, Logistics |
| Institutions | Laboe Naval Memorial |
| Museums | U-995 (Laboe, Germany, Type VIIC/41, 1943) |
| Compartments | Control Room |
| Systems | Periscope |
| Episodes | Steel 04 — Submarine Command |
| Missions | Steel 04 recognition, Copper astronomical observation |
| Questions | One per mission, from the pilot specification |
| Badges | Submarine Expedition Credential, Copper Coin |
| Settings | Bilingual, English default, theme, flags |

Content integrity:

- U-995 fields come from the Submarinos Museos reference dataset;
- `validation: 'pending'` and the description `Information to be validated.`
  prevent invented history;
- questions reproduce the pilot text verbatim;
- access keys are not seeded.

---

## 6. Verification performed

- `tsc --noEmit` clean.
- Runtime smoke test over `MemoryStorage`: seeding idempotency, counts, search,
  CRUD, duplicate, soft delete/restore, import modes and duplicate-id rejection.
- Temporary build artifacts removed after the check.

Not verified: IndexedDB behavior in a real browser (no UI consumes the layer
yet), CSV import mapping, and admin flows.

---

## 7. Next stage

Stage 2 — CSV Import Center: file parsing, column mapping, validation rules,
duplicate detection, import modes, error export and templates, using
`importRecords` as the write path.
