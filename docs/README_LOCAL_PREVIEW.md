# Local preview quick guide

Commands (copy/paste):

pnpm install
pnpm exec tsc --noEmit
pnpm build
python -m http.server 4330 --bind 127.0.0.1 --directory out

Open http://127.0.0.1:4330/series.html

Smoke tests:
- episodes?id=MIS-AC-03 (mechanism, retry/alternate flows)
- profile (Daily honor roll, diploma download)

To regenerate isa-config.json from the master workbook:
python scripts/update-isa-config.py --xlsx isa-master.xlsx

To regenerate badge manifests:
python scripts/copy_assets.py
