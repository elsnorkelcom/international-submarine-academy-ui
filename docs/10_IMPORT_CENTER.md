# ISA · CSV Import Center

Route: `/admin/import`
Scope: museums, institutions and questions. Other entities reuse the same pipeline once a spec is added.

---

## 1. Pipeline

```text
lib/import/csv.ts       Parser and writer (quotes, embedded commas/newlines, ; or ,)
lib/import/schemas.ts   Entity specs: fields, required flags, aliases, examples
lib/import/mapping.ts   Auto-mapping, coercion, per-row validation
lib/import/run.ts       Defaults, natural-key matching, repository import, report
components/admin/import-center.tsx  Wizard UI
```

Nothing assumes fixed column names. `guessMapping` only proposes a mapping from
field keys, labels and aliases; the user can override every column.

## 2. Wizard

1. **File** — choose the entity, download its template, drop or select a CSV.
2. **Mapping** — one selector per entity field, live preview, required-field warning,
   import mode (`create-only`, `upsert`, `replace`).
3. **Report** — totals, per-row issues with severity, error download, restart.

## 3. Validation rules

| Situation | Result |
|---|---|
| Required value empty | Row skipped, `error` |
| Duplicate ID inside the file | Row skipped, `error` |
| Number not parseable | Stored empty, `warning` |
| Enum value unknown | Default used, `warning` |
| Row fails | Remaining rows still import |

Enum matching is tolerant: `Knowing (Conocimiento)` resolves to `knowing` because
the normalized value contains the option key.

## 4. Identity and duplicates

- With an `id` column: the ID drives create/update/skip.
- Without an `id` column: records are matched against existing rows by their
  natural key (`name`, `title` or `text`, English value). Importing the same
  source twice updates instead of duplicating.
- New records receive a readable generated ID (`INS-`, `MUS-`, `QST-`, …).

## 5. Library API

```ts
import { parseCsv, toObjects, toCsv } from '@/lib/import/csv';
import { guessMapping, missingRequiredFields } from '@/lib/import/mapping';
import { runImport, templateCsv } from '@/lib/import/run';
import { MUSEUM_IMPORT } from '@/lib/import/schemas';

const csv = parseCsv(text);
const mapping = guessMapping(csv.headers, MUSEUM_IMPORT);
const report = await runImport({ database, spec: MUSEUM_IMPORT, objects: toObjects(csv), mapping, mode: 'upsert' });
```

## 6. Verification

Runtime check through the real pipeline, in Node over `MemoryStorage`:

| Case | Result |
|---|---|
| Museums CSV (160 rows, no ID column) with `upsert` | 160 updated, 0 duplicates on re-import |
| Same file with `create-only` | 0 created, 160 skipped |
| TIMSS curated CSV (100 rows) | 100 created, 4 options, answer `B`, `timssDomain` normalized |
| File with one broken row | 1 created, 1 skipped, issue reported |
| Error export | `row,severity,message` header |

Browser check through Chrome over CDP: uploaded
`TIMSS/Submarinos Museos SNK 2025 OK - Points (1).csv`, mapping auto-resolved,
"Import 160 rows" executed, and the report listed per-row results.

## 7. Limits

- `/admin/import` is not protected yet: no administrator key gate exists.
- No audit entry is written for imports beyond the record audit fields.
- Templates cover the mapped fields only; they do not include every entity field.
- Question import requires the option and answer columns; it does not yet import
  full feedback variants per language.
- Replace mode deletes every record of the entity, including records created
  outside the import.
