# ISA · Investigación de museos

Cómo se completan los campos faltantes de las 160 fichas con fuentes verificables.

---

## 1. Punto de partida (verificado)

`lib/data/datasets/museums-snk-2025.json`: 160 museos, **499 campos vacíos** en 152 registros.

| Campo | Vacíos |
|---|---|
| `website` | 140 |
| `situation` | 140 |
| `mediaUrl` | 133 |
| `launchYear` | 65 |
| `city` | 20 |
| `origin` | 1 |

Solo 8 registros están marcados como validados.

## 2. Pipeline

```text
1. scripts/museum_research_worklist.py
   → research/museums_worklist.csv (160 filas, ordenadas por prioridad)

2. Investigación por lotes de 8–10 museos
   agentes con web_search / web_fetch
   → research/results/<lote>.json (un objeto por museo)

3. scripts/merge_museum_research.py
   → research/review.csv      (actual vs propuesto, fuente, confianza, estado)
   → research/proposals.json  (propuestas aceptables)

4. Revisión humana

5. scripts/merge_museum_research.py --apply
   → actualiza el dataset y marca el museo como `pending` con la fuente registrada
```

Ningún agente escribe directamente en el dataset ni en la Sheet.

## 3. Reglas de fuentes

| Prioridad | Fuente |
|---|---|
| 1 | Sitio oficial del museo o de la institución que custodia el casco |
| 2 | Registro patrimonial oficial, museo naval nacional, Historic Naval Ships Association |
| 3 | Wikipedia **solo** si cita una fuente primaria, y se registra la cita |
| ❌ | Blogs, agregadores turísticos, wikis sin referencias |

Reglas duras:

- Sin URL de fuente, el dato no se propone (`status: no-source`).
- Si no hay dato confiable → `not-found`, nunca una estimación.
- Si dos fuentes se contradicen, se documenta en `notes` y se elige la más oficial.
- Un museo con `validation: validated` está protegido: solo se cambia con `--force`.

## 4. Estados del merge

| Estado | Significado |
|---|---|
| `proposed` | Dato nuevo, con fuente y confianza suficiente |
| `same` | Coincide con el valor actual |
| `not-found` | No se encontró fuente confiable |
| `low-confidence` | Encontrado, pero sin respaldo suficiente |
| `no-source` | Hay valor pero no URL |
| `protected` | El museo está validado; requiere `--force` |

## 5. Piloto ejecutado (3 museos)

| Museo | Campos resueltos |
|---|---|
| `MUS-SNK-087` Shch-307 | año 1934, Museo de la Victoria (Moscú), situación `monumento` |
| `MUS-SNK-101` DSRV-1 Mystic | año 1970, U.S. Naval Undersea Museum (Keyport), situación `tierra` |
| `MUS-SNK-102` Fenian Ram | año 1881, situación `cerrado` |

Resultado del merge: **12 propuestas**, todas `proposed`, dataset intacto.

### Dos errores del dataset detectados

1. **DSRV-1 Mystic** no está en Mystic Seaport: se exhibe en el **U.S. Naval Undersea Museum** (Keyport, Washington). El nombre homenajea al pueblo de Mystic.
2. **Fenian Ram** no está en el National Museum of the US Navy: está en el **Paterson Museum** (Paterson, Nueva Jersey) desde 1980.

Estos casos justifican el pipeline: investigar no solo completa campos, también detecta atribuciones incorrectas que hoy se publican en `/museums`.

## 6. Escala

- 152 museos pendientes, 4 campos prioritarios → ~600 datos por investigar.
- Lotes de 8–10 → **16–19 lotes**.
- Tras cada lote: merge en modo revisión y aprobación por bloque.

Recomendación: empezar por los 40 museos con más campos faltantes (prioridad alta del worklist) y revisar antes de seguir.

## 7. Límites

- Un agente puede no poder abrir un sitio (bloqueo de red, sitio caído): en ese caso baja la confianza y lo anota.
- La disponibilidad de un sitio cambia; conviene reverificar antes de marcar `validated`.
- El piloto no cubrió `mediaUrl` (video oficial) ni `description` redactada: quedan para una segunda fase.
- Aplicar propuestas cambia `validation` a `pending`: validar es una decisión humana posterior.
