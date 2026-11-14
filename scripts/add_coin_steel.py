import json, io
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CFG = ROOT / 'lib' / 'data' / 'datasets' / 'isa-config.json'

cfg = json.loads(CFG.read_text(encoding='utf-8'))
awards = cfg.get('awards', [])
ids = {a.get('badgeId') for a in awards}
if 'BDG-COIN-STEEL' in ids:
    print('BDG-COIN-STEEL already present')
else:
    new = {
        "badgeId": "BDG-COIN-STEEL",
        "nameEn": "Coin · Steel Season",
        "nameEs": "Coin · Temporada Acero",
        "type": "coin",
        "seasonId": "SEA-STEEL",
        "missionId": "",
        "criteriaEn": "Complete all missions of the Steel season.",
        "criteriaEs": "Completar todas las misiones de la temporada Acero.",
        "ruleType": "season-count",
        "ruleCount": 8,
        "color": "#8FA3B0",
        "status": "published",
        "icon": "/images/badges/acero/coins/coin-steel.png"
    }
    awards.append(new)
    cfg['awards'] = awards
    CFG.write_text(json.dumps(cfg, ensure_ascii=False, indent=1)+"\n", encoding='utf-8')
    print('BDG-COIN-STEEL added')
