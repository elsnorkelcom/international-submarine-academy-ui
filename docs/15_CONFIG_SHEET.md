# ISA · Configuration sheet

The accreditation rules live in a table outside the app (Google Sheet, optionally edited with AppSheet).
`scripts/sync_config.py` turns that table into `lib/data/datasets/isa-config.json`, and the app applies it to the local database.

---

## 0. Sections

Four optional tables feed one versioned file, `lib/data/datasets/isa-config.json`:

| Section | Flag | What it controls |
|---|---|---|
| Settings | `--settings` | App name, default language, attempts, timer, welcome / access / fiction texts |
| Seasons | `--seasons` | Season titles, order, colours, TIMSS domain, GSA emphasis |
| Missions | `--missions` | Mission titles, objective, season, museum, compartment, equipment, status |
| Awards | `--awards` | Badge rules and thresholds |

Sections are merged: sending only `--awards` keeps the existing seasons and missions.
The first visit applies every section; **Apply config** re-applies them to an existing browser.

## 1. Awards table columns

| Column | Required | Example | Notes |
|---|---|---|---|
| `badge_id` | yes | `BDG-STEEL-SEASON` | Stable identifier |
| `badge_name_en` | yes | `Steel Season Recognition` | |
| `badge_name_es` | no | `Reconocimiento Temporada Acero` | Falls back to English |
| `type` | yes | `badge` | `credential`, `coin` or `badge` |
| `season_id` | yes | `SEA-STEEL` | Must match a season in the app |
| `mission_id` | only for `mission` | `MIS-STEEL-04` | Empty for season rules |
| `criteria_en` | no | `Complete every Steel mission.` | Shown in the credential |
| `criteria_es` | no | `Completar todas las misiones de Acero.` | |
| `rule_type` | yes | `season-count` | `mission` or `season-count` |
| `rule_count` | season rules | `3` | Missions required; ignored for `mission` |
| `color` | no | `#8FA3B0` | Badge colour |
| `status` | no | `published` | `draft`, `published`, `archived` |

Header names are matched without case or accents, so `Badge ID`, `badge_id` and `BadgeId` all work.

## 1.1 Seasons table

`id`, `name` (`steel`, `copper`, `bronze`, `silver`, `gold`), `title_en`, `title_es`,
`description_en`, `description_es`, `order`, `color_theme`, `timss_domain`,
`gsa_en`, `gsa_es`, `status`.

`color_theme` is the colour used on the Home accreditation path.

## 1.2 Missions table

`id`, `title_en`, `title_es`, `episode_id`, `season_id`, `museum_id`, `compartment_id`,
`equipment_id`, `description_en`, `description_es`, `objective_en`, `objective_es`,
`timss_domain`, `gsa_competency`, `civil_en`, `civil_es`, `order`, `status`.

## 1.3 Settings table

Key/value rows: `key`, `value`, `value_es`.

| Key | Effect |
|---|---|
| `app_name` | Application name |
| `default_language` | `en` or `es` |
| `max_attempts` | Attempts per question |
| `timer_seconds` | Timer duration |
| `welcome_en` / `welcome_es` | Home welcome message |
| `access_en` / `access_es` | Access screen text |
| `fiction_en` / `fiction_es` | Fiction disclaimer |

Unknown keys are ignored, so the table can grow without breaking the sync.

## 2. Command

```bash
python3 scripts/sync_config.py --awards awards.csv --check
python3 scripts/sync_config.py --seasons seasons.csv --missions missions.csv --awards awards.csv
python3 scripts/sync_config.py --awards "https://docs.google.com/.../pub?gid=...&output=csv"
```

## 2.1 Automatic sync

`.github/workflows/sync-config.yml` runs weekly and on dispatch, reading the sheet URLs from
repository variables: `ISA_CONFIG_SEASONS_URL`, `ISA_CONFIG_MISSIONS_URL`,
`ISA_CONFIG_AWARDS_URL`, `ISA_CONFIG_SETTINGS_URL`. If any is set, it regenerates
`isa-config.json` and commits the change; the commit deploys the site.

Validation rejects unknown `rule_type`, unknown `type`, non-numeric `rule_count` and reports the line number.
The script never deletes anything: removing a row from the table leaves the badge untouched.

## 3. AppSheet workflow

1. Create the table in AppSheet over a Google Sheet with the columns above.
2. Share the sheet as *anyone with the link can view* (published CSV) or keep it private and run the
   script from a machine with access.
3. Run the sync on a schedule (same pattern as the museums workflow) and commit the generated JSON.
4. In `/admin/accreditation`, press **Apply config** to re-apply the file to an existing browser database.

## 4. Where it applies

| Moment | Behaviour |
|---|---|
| First visit (empty database) | `ensureSeed` applies the configuration after seeding |
| Existing database | **Apply config** updates rules, creates missing badges |
| Badge removed from the table | Left as is (no destructive sync) |

## 5. Verification performed

Valid file (two rules):

```text
Acreditaciones: 2
Por regla: {'mission': 1, 'season-count': 1}
Escrito: lib\data\datasets\isa-config.json
```

Invalid file (`rule_type = weekly`):

```text
Errores:
  - L4: rule_type 'weekly' no es válido (mission, season-count).
```

Multi-section run:

```text
[seasons] 2 fila(s)
[missions] 1 fila(s)
[awards] 1 fila(s)
Secciones: seasons, missions, awards
```

The committed dataset stays empty (`version: 2` with empty sections) so no test badges or missions reach production.

## 6. Limits

- Only awards are configurable from the table today; seasons, missions and questions still use the
  admin panel or CSV import.
- There is no two-way sync: the table is the source of truth, the app never writes back to it.
- Changing `season_id` or `mission_id` values that do not exist creates unreachable rules; the panel
  flags season rules whose threshold exceeds the published missions.
