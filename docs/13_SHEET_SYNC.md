# ISA · Museum Sheet sync

Source of truth: the published Google Sheet used by
<https://github.com/elsnorkelcom/submarinos_museo>.

Script: `scripts/sync_museums.py`
Output: `lib/data/datasets/museums-snk-2025.json`

---

## 1. How it works

```text
Published Google Sheet (CSV)
        │  scripts/sync_museums.py
        ▼
lib/data/datasets/museums-snk-2025.json
        │  imported by lib/data/seed.ts
        ▼
IndexedDB on first visit → register, plot, files, admin
```

The site never calls Google Sheets at runtime: the dataset is regenerated and
versioned, exactly like the reference project does.

## 2. Commands

```bash
python3 scripts/sync_museums.py --check   # fetch and compare, write nothing
python3 scripts/sync_museums.py           # regenerate the dataset
pnpm sync:museums                         # same, through package scripts
```

## 3. Automation

`.github/workflows/sync-museums.yml` runs the script every Monday at 06:00 UTC
and on manual dispatch. If the dataset changed, it commits
`chore: sync museums dataset from published Sheet`, which triggers the Pages
deployment.

## 4. Field mapping

| Sheet column | Dataset field | Notes |
|---|---|---|
| `Name` | `name` | Hull name |
| `Description` (`<b>` block) | `museumName` | Museum hosting the hull |
| `Clase` | `vesselType` | Vessel class |
| `Group` | `propulsion` | Diesel, nuclear, electric, hand-crank |
| `Nationality` / `Origen:` | `origin` | Normalized to English names |
| `Launch year` | `launchYear` | Integer |
| `Latitude` / `Longitude` | `latitude`, `longitude` | Decimals |
| `Country` | `country` | Spanish sheet value normalized to English |
| `City / Town` | `city` | |
| `Address found` | `address` | |
| `URL` | `website` | |
| `Video` | `mediaUrl` | |
| `Featured` | `featured` | Boolean |
| `Situacion` / `Icon URL` | `situation` | `flote`, `agua`, `tierra`, `cerrado`, `monumento` |
| row order | `dossier` | `SNK-001`… when the sheet has no dossier column |
| `Estado` | `validation`, `notes` | `Validado` → `validated`; anything else → `pending` |

## 5. Identity rules

- Existing names keep their current ids (`MUS-U995`, `MUS-SNK-012`, …).
- New rows receive a readable slug id (`MUS-<SLUG>`), never a row number.
- A museum missing from the sheet is not deleted automatically: it simply stops
  being updated, and the diff shows it.

## 6. Verification

`--check` against the published sheet:

```text
Sheet rows: 160
Dataset actual: 160 museos
Nuevos: 0 · Faltantes: 0
Sin coordenadas: 0
Validados: 8
```

After the first real sync: 160 records, 8 featured, 20 with a situation
(`tierra` 11, `agua` 9), ids preserved (`MUS-U995` still points to the seeded
compartment and episode). `tsc --noEmit` and `pnpm build` pass; the register shows
a new Situation filter and the files show the archive code.

## 7. Limits

- The sheet has no `Dossier` or `Situacion` column yet, so `dossier` falls back to
  the row order and `situation` is empty for most rows.
- Deletions and renames in the sheet are not reconciled automatically.
- The sync needs network access; CI does it for us on a schedule.
- Only museums are synchronised. Questions, seasons and missions still depend on
  the admin panel or CSV import.
