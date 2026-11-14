#!/usr/bin/env python3
"""Copy and normalize badge assets and regenerate per-folder manifest.json

Usage: python scripts/copy_assets.py --src path/to/artwork --dest public/images/badges

If src is omitted, the script will scan public/images/badges and regenerate manifests.
"""
from pathlib import Path
import argparse, json

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DEST = ROOT / 'public' / 'images' / 'badges'

def build_manifest(folder: Path):
    files = []
    for p in sorted(folder.rglob('*')):
        if p.is_file():
            rel = p.relative_to(folder)
            files.append(str(rel).replace('\\\\','/'))
    manifest = {'files': files}
    manifest_path = folder / 'manifest.json'
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1)+"\n", encoding='utf-8')
    print('Wrote', manifest_path)

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--src', help='source artwork dir', default='')
    p.add_argument('--dest', help='destination badges dir', default=str(DEFAULT_DEST))
    args = p.parse_args()
    dest = Path(args.dest)
    if args.src:
        src = Path(args.src)
        if not src.exists():
            raise SystemExit('src not found')
        # naive copy: copy files preserving structure
        for f in src.rglob('*'):
            if f.is_file():
                rel = f.relative_to(src)
                target = dest / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(f.read_bytes())
        print('Copied assets from', src)
    # regenerate manifests for every subfolder in dest
    for folder in dest.iterdir():
        if folder.is_dir():
            build_manifest(folder)
    print('Done')
