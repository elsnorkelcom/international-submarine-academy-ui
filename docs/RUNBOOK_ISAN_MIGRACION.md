# Runbook: ISAN Migration and Local Preview

This runbook documents the steps to preview, validate and migrate the ISA configuration and assets.

## Overview
Deliverables:
- patches/ (diffs to apply)
- scripts/update-isa-config.py (wrapper for sync_config.py)
- scripts/copy_assets.py (copy and manifest generator)
- scripts/verify_loop.mjs (headless smoke test)
- master workbook: isa-master.xlsx (editable source for content curators)
- docs/README_LOCAL_PREVIEW.md

## Local preview (Windows / macOS / Linux)
Requirements:
- Node.js 22, pnpm (as in repo), Python 3.8+, Chrome (optional for headless testing)

Steps:
1. Clone and install
   - git clone https://github.com/elsnorkelcom/international-submarine-academy-ui
   - cd international-submarine-academy-ui
   - pnpm install

2. Typecheck and build
   - pnpm exec tsc --noEmit
   - pnpm build

3. Export static output and serve
   - pnpm export (if configured) or ensure `out/` exists
   - python -m http.server 4330 --bind 127.0.0.1 --directory out
   - Open http://127.0.0.1:4330/series.html

4. Smoke tests
   - Use scripts/verify_loop.mjs with a local headless Chrome remote debugging port (9350)

## Migration steps (using master workbook)
1. Edit `isa-master.xlsx` in Excel or upload to Google Sheets.
2. Save and export workbook to disk (if edited in Google Sheets: File → Download → Microsoft Excel (.xlsx)).
3. Run:
   - python scripts/update-isa-config.py --xlsx path/to/isa-master.xlsx
   This runs scripts/sync_config.py --xlsx and bumps SEED_VERSION automatically (to generated version + 1).
4. Validate: pnpm exec tsc --noEmit && pnpm build
5. Export to out and smoke-test pages.

## Rollback
- If the import breaks, revert the changes via git: `git checkout -- lib/data/datasets/isa-config.json` and restore previous `SEED_VERSION` in `lib/data/seed.ts`.

## Notes on parity mobile/desktop
- Test 390px viewport for mobile; check timer UI and touch targets.
- Test diploma generation (canvas) and download on mobile browsers.

## Applying patches to the official repo
Preferred workflow (patches + scripts):
- Apply patches: `git apply patches/patch-01-add-seasons-SEA-COPPER-SEA-STEEL.patch`
- Run `pnpm exec tsc --noEmit` and `pnpm build`.
- Commit and open PR following .github/PULL_REQUEST_TEMPLATE.md.

For direct PR creation to the official repo, you must provide push access or create a branch and open the PR yourself.
