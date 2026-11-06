# ISA · Accreditation configuration sheet

The accreditation rules live in a table outside the app (Google Sheet, optionally edited with AppSheet).
`scripts/sync_config.py` turns that table into `lib/data/datasets/isa-config.json`, and the app applies it to the local database.

---

## 1. Table columns

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

## 2. Command

```bash
python3 scripts/sync_config.py --awards awards.csv --check   # validate only
python3 scripts/sync_config.py --awards awards.csv           # write the dataset
python3 scripts/sync_config.py --awards "https://docs.google.com/.../pub?gid=...&output=csv"
```

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

The committed dataset stays empty (`{"version": 1, "awards": []}`) so no test badges reach production.

## 6. Limits

- Only awards are configurable from the table today; seasons, missions and questions still use the
  admin panel or CSV import.
- There is no two-way sync: the table is the source of truth, the app never writes back to it.
- Changing `season_id` or `mission_id` values that do not exist creates unreachable rules; the panel
  flags season rules whose threshold exceeds the published missions.
