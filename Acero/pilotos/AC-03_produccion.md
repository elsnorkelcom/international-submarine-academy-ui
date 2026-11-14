# AC-03 · Puesto central — ficha de producción v0.1

## Especificaciones

| Pieza | Formato | Duración | Peso objetivo |
|---|---|---|---|
| Máster | 16:9 · 1920×1080 · H.264 + AAC | 90 s | < 60 MB |
| Backup | 16:9 · 2560×1440 o 4K | 90 s | archivo |
| Shorts | 9:16 · 1080×1920 | 30–45 s | < 30 MB c/u |
| Miniatura | 16:9 · 1280×720 | — | < 500 KB |
| Subtítulos | `.vtt` ES/EN + quemados | — | — |
| Transcripción | `.md` o `.txt` | — | — |

Audio: voz −16 LUFS, ambiente −28 LUFS, sin clipping. Subtítulos: 42–48 px en 1080p,
blanco con sombra, máximo 2 líneas.

## Entregables

```
ISA-AC-03-ES-master-v0.1.mp4
ISA-AC-03-EN-master-v0.1.mp4
ISA-AC-03-ES-short-01-v0.1.mp4 … 03
ISA-AC-03-EN-short-01-v0.1.mp4 … 03
ISA-AC-03-poster-16x9-v0.1.webp
ISA-AC-03-subtitles-es.vtt
ISA-AC-03-subtitles-en.vtt
ISA-AC-03-transcript-es.md
ISA-AC-03-transcript-en.md
ISA-AC-03-credits.md
```

## Alojamiento

- Másters y Shorts: **CDN externo** (Cloudflare Stream/R2 o Vimeo). No en GitHub Pages.
- La app guarda solo la URL y los metadatos (`mediaKind`, `mediaCredit`,
  `mediaSourceUrl`, `posterUrl`).
- Placeholder hasta tener URL real: usar el still actual y la card “video en producción”.

## Créditos

- Guion: Guionista ISA.
- Documentación: Documentalista ISA.
- Dirección de arte / storyboard: Director de arte ISA.
- Imagen: IA (herramienta a definir) · recreación.
- Voz: IA (voz a definir) · recreación.
- Museo / voluntario: a definir cuando se firme el acuerdo.
- Música y ambiente: biblioteca ISA o IA, con licencia.

## QA antes de publicar

- [ ] Sin armas, explosivos, guerra, combate ni intención bélica.
- [ ] Sin nombres reales de submarinos ni museos.
- [ ] Etiqueta “recreación con IA” visible en video y ficha.
- [ ] Subtítulos ES/EN sincronizados y transcripción.
- [ ] Audio normalizado y sin clipping.
- [ ] Shorts con zona segura respetada.
- [ ] Créditos y derechos completos.
- [ ] Reproducción en móvil y escritorio; peso dentro del objetivo.
- [ ] La pregunta de la app no aparece resuelta en el video.

## Estado

`guion: borrador` · `storyboard: borrador` · `prompts: listos` · `media: pendiente`
`voz: pendiente` · `subtítulos: pendiente` · `QA: pendiente` · `publicación: pendiente`
