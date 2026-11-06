# ISA · Museum archive

Reference site that inspired this area: <https://submarinos-museo-del-mundo.elsnorkel.com/> (Leaflet 1.9.4 + Leaflet.markercluster).
Scope delivered: dataset, register, map plot and museum files. Administration and CSV import are still pending.

---

## 1. Routes

| Route | Content |
|---|---|
| `/museums` | Register: search, country filter, propulsion filter, sorting, 160 rows |
| `/museums/[id]` | Museum file: metadata, description, series relations, links |
| `/map` | Leaflet plot with clustered markers and the same filters |

Both pages are client-rendered over IndexedDB and are statically exported; the
`/museums/[id]` paths are generated from the dataset at build time.

## 2. Dataset

`lib/data/datasets/museums-snk-2025.json` — 160 records generated from
`TIMSS/Submarinos Museos SNK 2025 OK - Points (1).csv`.

Transformation applied:

- museum name extracted from `Location` and from the `<b>` block of `Description`;
- vessel type, origin and launch year extracted from the description labels;
- Spanish country names normalized to English (`Alemania` → `Germany`);
- bilingual description built from the extracted fields;
- `validation: 'validated'` only for rows marked `Validado` (8); the rest stay
  `pending` and the UI shows “Information to be validated.”;
- HTML stripped: no markup from the source CSV reaches the DOM;
- U-995 keeps the stable id `MUS-U995`; the rest use `MUS-SNK-NNN`.

Nothing was invented: every field traces back to the CSV, and the original row
status is preserved in `notes`.

## 3. Dependencies added

| Package | Version | Why |
|---|---|---|
| `leaflet` | 1.9.4 | Map rendering, same major version as the reference site |
| `leaflet.markercluster` | 1.5.3 | Clustered markers for 160 points |
| `@types/leaflet` / `@types/leaflet.markercluster` | dev | Type safety |

Tile layer: CARTO dark basemap over OpenStreetMap data, with attribution. Map
tiles require network access; the register and files work offline, the plot does
not until tiles are cached.

## 4. Implementation notes

- Leaflet is loaded dynamically inside an effect; the plugin needs a global `L`
  before it is imported, otherwise `markerClusterGroup` is undefined.
- If the plugin is missing the map falls back to a plain layer group, so markers
  still render.
- IndexedDB transactions resolve on `oncomplete`, with handlers attached before
  the request is issued; otherwise fast transactions can leave the UI loading.
- The batch import preloads existing ids once, instead of one read per row.
- The UI language switch also updates `<html lang>`.

## 5. Verification

- `tsc --noEmit` clean; `pnpm build` generates 167 static pages.
- Chrome headless over CDP against the dev server:
  - `/museums` renders 160 file links and populated country filters;
  - `/museums/MUS-U995` renders Location `Laboe, Germany`, Vessel `Type VIIC/41`,
    Propulsion `Diesel`, Origin `Germany`, Launched `1943`, source and pending tag;
  - `/map` initializes one Leaflet container, 11 individual markers, 13 clusters
    and 8 loaded tiles.

Not verified: tile provider quota, mobile touch behaviour in a real device,
and offline caching of map tiles.

## 6. Next

- Link the archive from the home series navigation.
- CSV Import Center so new museums can be loaded without editing the dataset.
- Admin CRUD over the same repositories.
