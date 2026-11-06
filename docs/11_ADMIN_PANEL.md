# ISA · Admin panel

Routes: `/admin` (overview), `/admin/[entity]` (12 collections), `/admin/import`, `/admin/settings`.
Scope: local administration over the browser database. No server, no accounts.

---

## 1. Structure

```text
lib/admin/entities.ts      Declarative schema: columns, fields, statuses
lib/admin/local-auth.ts    Local passphrase gate (SHA-256 in localStorage)
components/admin/admin-shell.tsx   Gate, navigation, lock
components/admin/admin-dashboard.tsx   Counts per collection
components/admin/entity-table.tsx      Generic list, filters, bulk actions
components/admin/entity-form.tsx       Generic create/edit form
components/admin/settings-form.tsx     Singleton settings editor
lib/admin/...              (no other admin runtime)
```

One declaration per entity drives the table, the form and the actions, so a new
collection needs no new screen.

## 2. Gate

- First visit: choose a passphrase; only its SHA-256 hash is stored.
- Later visits: the passphrase unlocks a session flag in `sessionStorage`.
- `Lock` clears the session.

This is a local deterrent, not security: anyone with access to the browser
profile can clear storage. Institutional keys and server-side verification remain
a separate, pending stage.

## 3. Table capabilities

- Search across every field, status filter, sort by any column, asc/desc.
- Pagination of 20 rows.
- Multi-select with bulk actions: publish, unpublish, delete, restore, duplicate.
- Row actions: edit, duplicate, delete (soft), restore.
- Export of the filtered rows to CSV (localised fields exported in English).
- Soft-deleted rows stay visible with reduced opacity until restored.

## 4. Form

- Fields declared per entity: text, textarea, number, select, localized pair,
  list (comma separated), date.
- Required fields block the save and name themselves in the error.
- `id` is editable and validated by the repository (duplicates rejected).

## 5. Settings

Application name, default language, welcome message, access screen text, fiction
notice, fallback status, max attempts, timer, theme colours and feature flags.

## 6. Verification

Chrome over CDP against the dev server:

| Check | Result |
|---|---|
| First visit to `/admin` | Setup gate shown |
| Passphrase creation | Dashboard rendered |
| Dashboard counts | Museums 160, Institutions 1, Access keys 0, … |
| `/admin/museums` | 20 rows per page, columns populated |
| Edit action | Form opened with 22 fields |
| Create action | "Saved." plus the new row found through search |
| `tsc --noEmit` / `pnpm build` | Clean; 12 entity routes generated |

Repository-level operations (soft delete, restore, duplicate, import) were already
covered by the data-layer smoke test.

## 7. Limits

- No optimistic concurrency: two tabs editing the same record last-write-wins.
- No relation pickers: foreign keys are typed as IDs, not selected from a list.
- No per-field audit history; only `createdAt`/`updatedAt`/`updatedBy`.
- Access keys are edited as raw hashes; there is no key generator screen yet.
- Settings save replaces the record wholesale; validation is minimal.
