#!/usr/bin/env python3
"""Generate isa-master.xlsx from lib/data/datasets/isa-config.json
Creates tabs: Temporadas, Episodios, Misiones, Reactivos, Insignias (minimal), Config
"""
import json
from pathlib import Path
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'lib' / 'data' / 'datasets' / 'isa-config.json'
OUT = ROOT / 'isa-master.xlsx'

def write_sheet(ws, headers, rows):
    ws.append(headers)
    for r in rows:
        ws.append([r.get(h,'') for h in headers])
    for i, h in enumerate(headers, start=1):
        ws.column_dimensions[get_column_letter(i)].width = max(12, min(40, len(h)*1.2))

if __name__ == '__main__':
    cfg = json.loads(CONFIG.read_text(encoding='utf-8'))
    wb = Workbook()
    # Temporadas
    ws = wb.active
    ws.title = 'Temporadas'
    seasons = cfg.get('seasons', [])
    headers = ['id','titleEn','titleEs','colorTheme','timssDomain','order','status']
    rows = []
    for s in seasons:
        rows.append({
            'id': s.get('id',''),
            'titleEn': s.get('titleEn',''),
            'titleEs': s.get('titleEs',''),
            'colorTheme': s.get('colorTheme',''),
            'timssDomain': s.get('timssDomain',''),
            'order': s.get('order',''),
            'status': s.get('status',''),
        })
    write_sheet(ws, headers, rows)

    # Episodios
    ws = wb.create_sheet('Episodios')
    headers = ['id','titleEn','titleEs','seasonId','descriptionEn','descriptionEs','order','status']
    rows = []
    for e in cfg.get('episodes', []):
        rows.append({h: e.get(h,'') for h in headers})
    write_sheet(ws, headers, rows)

    # Misiones
    ws = wb.create_sheet('Misiones')
    headers = ['id','titleEn','titleEs','episodeId','seasonId','descriptionEn','descriptionEs','objectiveEn','objectiveEs','order','status']
    rows = []
    for m in cfg.get('missions', []):
        row = {h: m.get(h,'') for h in headers}
        rows.append(row)
    write_sheet(ws, headers, rows)

    # Reactivos (questions)
    ws = wb.create_sheet('Reactivos')
    headers = ['id','missionId','episodeId','variantIndex','textEn','textEs','A_en','A_es','B_en','B_es','C_en','C_es','D_en','D_es','correctOptionId','feedbackEn','feedbackEs','timssItemId']
    rows = []
    for q in cfg.get('questions', []):
        opts = q.get('options', {})
        rows.append({
            'id': q.get('id',''),
            'missionId': q.get('missionId',''),
            'episodeId': q.get('episodeId',''),
            'variantIndex': q.get('variantIndex',''),
            'textEn': q.get('textEn',''),
            'textEs': q.get('textEs',''),
            'A_en': opts.get('A',{}).get('en',''),
            'A_es': opts.get('A',{}).get('es',''),
            'B_en': opts.get('B',{}).get('en',''),
            'B_es': opts.get('B',{}).get('es',''),
            'C_en': opts.get('C',{}).get('en',''),
            'C_es': opts.get('C',{}).get('es',''),
            'D_en': opts.get('D',{}).get('en',''),
            'D_es': opts.get('D',{}).get('es',''),
            'correctOptionId': q.get('correctOptionId',''),
            'feedbackEn': q.get('feedbackEn',''),
            'feedbackEs': q.get('feedbackEs',''),
            'timssItemId': q.get('timssItemId',''),
        })
    write_sheet(ws, headers, rows)

    # Insignias minimal
    ws = wb.create_sheet('Insignias')
    headers = ['badge_id','badge_name_en','badge_name_es','type','season_id','mission_id','rule_type','rule_count','color','status']
    # attempt to read awards from config if present
    rows = []
    for a in cfg.get('awards', []):
        rows.append({
            'badge_id': a.get('badgeId',''),
            'badge_name_en': a.get('nameEn',''),
            'badge_name_es': a.get('nameEs',''),
            'type': a.get('type',''),
            'season_id': a.get('seasonId',''),
            'mission_id': a.get('missionId',''),
            'rule_type': a.get('ruleType',''),
            'rule_count': a.get('ruleCount',''),
            'color': a.get('color',''),
            'status': a.get('status',''),
        })
    write_sheet(ws, headers, rows)

    # Config
    ws = wb.create_sheet('Config')
    headers = ['key','value']
    settings = cfg.get('settings', {})
    rows = []
    for k, v in settings.items():
        rows.append({'key': k, 'value': str(v)})
    write_sheet(ws, headers, rows)

    wb.save(OUT)
    print('Wrote', OUT)
