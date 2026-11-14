#!/usr/bin/env python3
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CFG = ROOT / 'lib' / 'data' / 'datasets' / 'isa-config.json'

def set_media(episode_id, media_url, poster_url=None):
    cfg = json.loads(CFG.read_text(encoding='utf-8'))
    episodes = cfg.get('episodes', [])
    found = False
    for ep in episodes:
        if ep.get('id') == episode_id:
            ep['mediaUrl'] = media_url
            if poster_url is not None:
                ep['posterUrl'] = poster_url
            found = True
            break
    if not found:
        raise SystemExit(f'Episode {episode_id} not found')
    CFG.write_text(json.dumps(cfg, ensure_ascii=False, indent=1)+"\n", encoding='utf-8')
    print(f'Updated {episode_id}: mediaUrl -> {media_url}, posterUrl -> {poster_url}')

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        print('Usage: set_episode_media.py EPI-ID MEDIA_URL [POSTER_URL]')
        sys.exit(2)
    set_media(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
