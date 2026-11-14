#!/usr/bin/env python3
"""Wrapper to generate isa-config.json from CSV/XLSX sources and bump SEED_VERSION.

Usage:
  python scripts/update-isa-config.py --xlsx master.xlsx

This calls scripts/sync_config.py --xlsx <file>, validates, writes isa-config.json and bumps lib/data/seed.ts SEED_VERSION.
"""
from __future__ import annotations
import argparse, subprocess, sys, json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SYNC = ROOT / 'scripts' / 'sync_config.py'
OUTPUT = ROOT / 'lib' / 'data' / 'datasets' / 'isa-config.json'
SEED = ROOT / 'lib' / 'data' / 'seed.ts'

def run_sync(xlsx: Path) -> int:
    cmd = [sys.executable, str(SYNC), '--xlsx', str(xlsx)]
    print('Running:', ' '.join(cmd))
    return subprocess.call(cmd)

def bump_seed_version(new_version: int) -> None:
    text = SEED.read_text(encoding='utf-8')
    m = re.search(r"export const SEED_VERSION = (\d+);", text)
    if not m:
        raise SystemExit('SEED_VERSION not found in seed.ts')
    old = int(m.group(1))
    if old >= new_version:
        print(f'SEED_VERSION already {old} >= {new_version}, no change')
        return
    new_text = text.replace(f'export const SEED_VERSION = {old};', f'export const SEED_VERSION = {new_version};')
    SEED.write_text(new_text, encoding='utf-8')
    print(f'Bumped SEED_VERSION: {old} -> {new_version}')

def read_generated_version() -> int:
    if not OUTPUT.exists():
        raise SystemExit('Output isa-config.json not found')
    payload = json.loads(OUTPUT.read_text(encoding='utf-8'))
    return int(payload.get('version', 2))

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--xlsx', help='master workbook to import', required=True)
    p.add_argument('--bump-seed', type=int, help='bump seed version after successful import', default=None)
    args = p.parse_args()

    rc = run_sync(Path(args.xlsx))
    if rc != 0:
        sys.exit(rc)

    # determine bump if not provided
    gen_version = read_generated_version()
    if args.bump_seed is None:
        target = gen_version + 1
    else:
        target = args.bump_seed
    try:
        bump_seed_version(int(target))
    except Exception as e:
        print('Warning: could not bump seed:', e)
        sys.exit(0)
    print('update-isa-config: done')
