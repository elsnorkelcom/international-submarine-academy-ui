import csv, io, os, json
from PIL import Image, ImageDraw, ImageFont

ROOT = r'C:\Users\MDQdam\Proyectos\international-submarine-academy-ui'
BANK = os.path.join(ROOT, 'TIMSS/banco-preguntas/salidas/banco_cobre.csv')
OUT_DIR = os.path.join(ROOT, 'artifacts/grilla-cobre')
PALETTE_JSON = os.path.join(ROOT, 'lib/data/datasets/palette.json')
os.makedirs(OUT_DIR, exist_ok=True)

BG = '#0A0A0A'
CARD = '#141414'
BORDER = '#262626'
TEXT = '#EDEDED'
MUTED = '#9A9EA3'
COPPER = '#B87333'

# --- base: metales de temporada (seed) y colores STEM provisionales (logo pendiente) ---
METALS = {
    'STEEL':  {'name': 'Acero',  'hex': '#8FA3B0'},
    'COPPER': {'name': 'Cobre',  'hex': '#B87333'},
    'BRONZE': {'name': 'Bronce', 'hex': '#CD7F32'},
    'SILVER': {'name': 'Plata',  'hex': '#C0C7CE'},
    'GOLD':   {'name': 'Oro',    'hex': '#D4AF37'},
}
STEM = {
    'SCI': {'name': 'Ciencia',      'hex': '#E5C34B'},
    'TEC': {'name': 'Tecnología',   'hex': '#3F86C4'},
    'ING': {'name': 'Ingeniería',   'hex': '#D9773F'},
    'MAT': {'name': 'Matemática',   'hex': '#9A78C9'},
    'HUM': {'name': 'Factor Humano','hex': '#D08AA4'},
}
SPECS = [
    ('MAQ', 'Maquinista', 0),
    ('ELE', 'Electricista', 1),
    ('ELN', 'Electrónico', 2),
    ('NAV', 'Ingeniero Naval', 3),
    ('LOG', 'Logístico', 4),
]
DIMS = ['SCI', 'TEC', 'ING', 'MAT', 'HUM']
METAL_WEIGHT = 0.28

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def rgb_hex(c):
    return '#%02X%02X%02X' % tuple(max(0, min(255, int(round(v)))) for v in c)

def mix(a, b, t):
    ca, cb = hex_rgb(a), hex_rgb(b)
    return rgb_hex(tuple(ca[i] * (1 - t) + cb[i] * t for i in range(3)))

def sat_boost(h, factor):
    import colorsys
    r, g, b = [v / 255 for v in hex_rgb(h)]
    hh, ss, vv = colorsys.rgb_to_hsv(r, g, b)
    ss = min(1.0, ss * factor)
    r, g, b = colorsys.hsv_to_rgb(hh, ss, vv)
    return rgb_hex((r * 255, g * 255, b * 255))

def lum(h):
    def f(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = hex_rgb(h)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    l1, l2 = sorted((lum(a), lum(b)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

def ensure_contrast(c, bg=BG, minimum=4.5):
    for _ in range(40):
        if contrast(c, bg) >= minimum:
            return c
        c = mix(c, '#FFFFFF', 0.06)
    return c

def season_discipline(metal_hex, stem_hex):
    """Color de dimensión metalizado: mezcla del tono STEM con el metal, con saturación conservada."""
    c = mix(stem_hex, metal_hex, METAL_WEIGHT)
    c = sat_boost(c, 1.22)
    return ensure_contrast(c)

def specialty_ramp(metal_hex):
    """5 pasos metálicos de la especialidad dentro de la temporada."""
    out = []
    for _, _, step in SPECS:
        delta = (step - 2) * 0.16
        c = mix(metal_hex, '#000000', -delta) if delta < 0 else mix(metal_hex, '#FFFFFF', delta)
        out.append(ensure_contrast(c, CARD, 3.0))
    return out

palette = {'version': 1, 'status': 'provisional-stem-colors', 'metal_weight': METAL_WEIGHT,
           'metals': METALS, 'stem': STEM, 'seasons': {}}
ramps = {}
for code, metal in METALS.items():
    if code == 'STEEL':
        discs = {}
        ramp = specialty_ramp(metal['hex'])
        ramps[code] = ramp
        palette['seasons'][code] = {'metal': metal['hex'], 'disciplines': discs, 'specialty_ramp': ramp,
                                    'note': 'Acero no usa dimensiones STEM: se representa solo con su metal.'}
        continue
    discs = {d: season_discipline(metal['hex'], STEM[d]['hex']) for d in DIMS}
    ramp = specialty_ramp(metal['hex'])
    ramps[code] = ramp
    palette['seasons'][code] = {'metal': metal['hex'], 'disciplines': discs, 'specialty_ramp': ramp}

io.open(PALETTE_JSON, 'w', encoding='utf-8').write(json.dumps(palette, ensure_ascii=False, indent=1))
print('palette.json ->', PALETTE_JSON)
for code in METALS:
    discs = palette['seasons'][code]['disciplines']
    print(code, {d: discs[d] for d in DIMS} if discs else 'sin dimensiones STEM',
          '| ramp:', palette['seasons'][code]['specialty_ramp'])

# ---------------- datos del banco ----------------
rows = list(csv.DictReader(io.open(BANK, encoding='utf-8-sig')))
CODE_DOM = {'CHEMISTRY': 'QUÍ', 'PHYSICS': 'FÍS', 'BIOLOGY': 'BIO', 'EARTH SCIENCE': 'TIE',
            'ALGEBRA': 'ÁLG', 'NUMBER': 'NÚM', 'GEOMETRY': 'GEO', 'DATA AND CHANCE': 'DAT'}
cells, revisar, fh, fh_revisar = {}, set(), {}, {}
for r in rows:
    if r['kind'].strip().upper() == 'STEM':
        key = (r['discipline_id'].strip(), r['specialty_id'].strip())
        dom = next((v for k, v in CODE_DOM.items() if r['timss_content_domain'].strip().startswith(k)), '—')
        cells.setdefault(key, []).append(dom)
        if r['confidence'].strip() == 'revisar':
            revisar.add(key)
    else:
        spec = r['specialty_id'].strip()
        fh.setdefault(spec, []).append(r)
        if r['confidence'].strip() == 'revisar':
            fh_revisar[spec] = fh_revisar.get(spec, 0) + 1

F = 'C:/Windows/Fonts/'
mono = lambda s: ImageFont.truetype(F + 'consola.ttf', s)
monob = lambda s: ImageFont.truetype(F + 'consolab.ttf', s)
reg = lambda s: ImageFont.truetype(F + 'segoeui.ttf', s)
bold = lambda s: ImageFont.truetype(F + 'segoeuib.ttf', s)

season = palette['seasons']['COPPER']
DIM_COLORS = {d: season['disciplines'][d] for d in DIMS}
SPEC_COLORS = {s: ramps['COPPER'][i] for i, (s, _, _) in enumerate(SPECS)}

def draw_grid():
    W, H = 1640, 1380
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((64, 48), 'ISA  //  TEMPORADA COBRE  ·  NIVEL 1', font=mono(16), fill=COPPER)
    d.text((64, 78), 'Grilla Cobre · 5 × 5', font=bold(46), fill=TEXT)
    d.text((64, 142), '25 celdas · 3 preguntas por celda · 75 en total · colores STEM metalizados en cobre',
           font=reg(19), fill=MUTED)
    d.rounded_rectangle([W - 220, 52, W - 64, 88], radius=6, outline=COPPER)
    d.text((W - 206, 60), 'v1.0  ·  propuesta', font=mono(13), fill=COPPER)

    X0, Y0 = 64, 210
    ROW_W, COL_W, HDR_H, ROW_H, GAP = 250, 238, 80, 152, 10

    def cell_rect(r_i, c_i):
        return (X0 + ROW_W + GAP + c_i * (COL_W + GAP), Y0 + HDR_H + GAP + r_i * (ROW_H + GAP))

    d.rounded_rectangle([X0, Y0, X0 + ROW_W, Y0 + HDR_H], radius=8, fill=CARD, outline=BORDER)
    d.text((X0 + 18, Y0 + 32), 'ESPECIALIDAD × DIMENSIÓN', font=mono(12), fill=MUTED)

    for c_i, dcode in enumerate(DIMS):
        x = X0 + ROW_W + GAP + c_i * (COL_W + GAP)
        color = DIM_COLORS[dcode]
        d.rounded_rectangle([x, Y0, x + COL_W, Y0 + HDR_H], radius=8, fill=CARD, outline=BORDER)
        d.rectangle([x, Y0, x + COL_W, Y0 + 4], fill=color)
        d.text((x + 16, Y0 + 12), dcode, font=monob(14), fill=color)
        d.text((x + 16, Y0 + 30), STEM[dcode]['name'].upper(), font=reg(14), fill=TEXT)
        count = '5 celdas · 15 temas' if dcode == 'HUM' else '5 celdas · 15 preguntas'
        d.text((x + 16, Y0 + 54), count, font=mono(10), fill=MUTED)

    for r_i, (scode, sname, _) in enumerate(SPECS):
        y = Y0 + HDR_H + GAP + r_i * (ROW_H + GAP)
        d.rounded_rectangle([X0, y, X0 + ROW_W, y + ROW_H], radius=8, fill=CARD, outline=BORDER)
        d.rectangle([X0, y, X0 + 4, y + ROW_H], fill=SPEC_COLORS[scode])
        d.text((X0 + 20, y + 22), scode, font=monob(22), fill=TEXT)
        d.text((X0 + 20, y + 54), sname, font=reg(16), fill=MUTED)
        d.text((X0 + 20, y + ROW_H - 34), '4 celdas × 3 = 12 STEM · 3 FH', font=mono(10), fill=MUTED)

        for c_i, dcode in enumerate(DIMS):
            x, cy = cell_rect(r_i, c_i)
            color = DIM_COLORS[dcode]
            d.rounded_rectangle([x, cy, x + COL_W, cy + ROW_H], radius=8, fill=CARD, outline=BORDER)
            d.rectangle([x, cy, x + COL_W, cy + 3], fill=color)
            if dcode == 'HUM':
                d.text((x + 16, cy + 14), f'{len(fh.get(scode, []))} temas', font=bold(20), fill=TEXT)
                d.text((x + 16, cy + 42), 'vida a bordo · historia', font=reg(12), fill=MUTED)
                for k in range(3):
                    d.ellipse([x + 16 + k * 22, cy + 72, x + 28 + k * 22, cy + 84], fill=mix(color, BG, k * 0.22))
                d.text((x + 16, cy + 96), 'V1  V2  V3', font=mono(10), fill=MUTED)
                d.text((x + 16, cy + 116), 'sin ancla TIMSS', font=mono(10), fill=MUTED)
                if fh_revisar.get(scode):
                    d.rounded_rectangle([x + COL_W - 34, cy + 12, x + COL_W - 12, cy + 34], radius=5, outline=COPPER)
                    d.text((x + COL_W - 28, cy + 15), 'R', font=monob(13), fill=COPPER)
            else:
                items = cells.get((dcode, scode), [])
                d.text((x + 16, cy + 14), '3 variantes', font=bold(20), fill=TEXT)
                for k in range(3):
                    d.ellipse([x + 16 + k * 22, cy + 72, x + 28 + k * 22, cy + 84], fill=mix(color, BG, k * 0.22))
                d.text((x + 16, cy + 96), 'V1  V2  V3', font=mono(10), fill=MUTED)
                d.text((x + 16, cy + 118), ' · '.join(items), font=mono(11), fill=color)
                if (dcode, scode) in revisar:
                    d.rounded_rectangle([x + COL_W - 34, cy + 12, x + COL_W - 12, cy + 34], radius=5, outline=COPPER)
                    d.text((x + COL_W - 28, cy + 15), 'R', font=monob(13), fill=COPPER)

    ly = Y0 + HDR_H + GAP + 5 * (ROW_H + GAP) + 10
    d.text((X0, ly), 'COLORES DE LA GRILLA · COBRE', font=mono(14), fill=TEXT)
    for i, dcode in enumerate(DIMS):
        x = X0 + i * 300
        y = ly + 34
        color = DIM_COLORS[dcode]
        d.rounded_rectangle([x, y, x + 22, y + 22], radius=4, fill=color)
        d.text((x + 32, y + 1), STEM[dcode]['name'], font=reg(14), fill=TEXT)
        d.text((x + 32, y + 20), f'{dcode} · {color} (mezcla con cobre)', font=mono(10), fill=MUTED)
    d.text((X0, ly + 70), 'Barra de fila = paso metálico de la especialidad dentro de la temporada.', font=reg(14), fill=MUTED)

    fy = ly + 116
    d.line([X0, fy, W - 64, fy], fill=BORDER)
    d.text((X0, fy + 16), 'Cada celda tiene 3 preguntas; la implementación elige una por día (bucket ALFA / BRAVO / CHARLY).',
           font=reg(14), fill=MUTED)
    d.text((X0, fy + 42), 'R = celda con preguntas marcadas para revisión (5 en total), aceptadas en la versión 1.0.',
           font=reg(14), fill=MUTED)
    d.text((X0, fy + 68), 'Paleta generada desde lib/data/datasets/palette.json · colores STEM provisionales hasta el logo oficial.',
           font=mono(10), fill=MUTED)
    img.save(os.path.join(OUT_DIR, 'grilla-cobre.png'))
    print('imagen grid:', os.path.join(OUT_DIR, 'grilla-cobre.png'))

def draw_seasons():
    W, H = 1640, 880
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((64, 48), 'ISA  //  SISTEMA DE COLOR POR TEMPORADA', font=mono(16), fill=COPPER)
    d.text((64, 78), 'Metales, dimensiones y especialidades', font=bold(40), fill=TEXT)
    d.text((64, 140), 'Cada temporada toma su metal. Las dimensiones STEM se mezclan con ese metal; las especialidades usan pasos metálicos.',
           font=reg(18), fill=MUTED)

    x0, y0 = 64, 220
    dim_w, ramp_w = 210, 250
    row_h = 96
    for i, dcode in enumerate(DIMS):
        x = x0 + 150 + i * dim_w
        d.text((x, y0 - 40), stem_code := dcode, font=monob(13), fill=MUTED)
        d.text((x + 44, y0 - 40), STEM[dcode]['name'], font=reg(13), fill=MUTED)

    for r_i, (mcode, metal) in enumerate(METALS.items()):
        y = y0 + r_i * row_h
        d.rounded_rectangle([x0, y, x0 + 120, y + 72], radius=8, fill=CARD, outline=BORDER)
        d.rectangle([x0, y, x0 + 6, y + 72], fill=metal['hex'])
        d.text((x0 + 18, y + 12), mcode, font=monob(15), fill=TEXT)
        d.text((x0 + 18, y + 36), metal['name'], font=reg(14), fill=MUTED)
        for c_i, dcode in enumerate(DIMS):
            cx = x0 + 150 + c_i * dim_w
            d.rounded_rectangle([cx, y, cx + dim_w - 24, y + 72], radius=8, fill=CARD, outline=BORDER)
            if mcode == 'STEEL':
                ramp = palette['seasons']['STEEL']['specialty_ramp']
                color = ramp[c_i]
                d.rectangle([cx, y, cx + dim_w - 24, y + 4], fill=color)
                d.text((cx + 14, y + 14), 'sin dimensión STEM', font=reg(12), fill=MUTED)
                d.text((cx + 14, y + 40), color, font=mono(11), fill=color)
            else:
                color = palette['seasons'][mcode]['disciplines'][dcode]
                d.rectangle([cx, y, cx + dim_w - 24, y + 4], fill=color)
                d.text((cx + 14, y + 14), STEM[dcode]['name'], font=reg(13), fill=TEXT)
                d.text((cx + 14, y + 38), color, font=mono(11), fill=color)
        rx = x0 + 150 + 5 * dim_w + 20
        d.text((rx, y0 - 40), 'RAMPA DE ESPECIALIDAD', font=monob(12), fill=MUTED)
        for s_i, s_hex in enumerate(palette['seasons'][mcode]['specialty_ramp']):
            sx = rx + s_i * 46
            d.rounded_rectangle([sx, y + 8, sx + 38, y + 64], radius=5, fill=s_hex)
            d.text((sx + 4, y + 66), SPECS[s_i][0], font=mono(9), fill=MUTED)

    y = y0 + 5 * row_h + 30
    d.line([x0, y, W - 64, y], fill=BORDER)
    d.text((x0, y + 18), 'Acero no lleva dimensiones STEM: se representa con su metal, sin codificación de disciplina.', font=reg(15), fill=MUTED)
    d.text((x0, y + 44), 'Colores STEM actuales = provisionales (reemplazables por los del logo). Nada está hardcodeado: se edita palette.json.', font=reg(15), fill=MUTED)
    d.text((x0, y + 72), 'Nivel = metal · Disciplina = mezcla STEM + metal · Especialidad = paso metálico · Variante = matiz.', font=mono(11), fill=COPPER)
    img.save(os.path.join(OUT_DIR, 'paleta-temporadas.png'))
    print('imagen temporadas:', os.path.join(OUT_DIR, 'paleta-temporadas.png'))

draw_grid()
draw_seasons()
