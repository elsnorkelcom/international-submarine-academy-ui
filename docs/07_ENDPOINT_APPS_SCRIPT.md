# ISA · Endpoint de Apps Script

Contrato del endpoint read-only que permite a la web estática leer datos de una Google Sheet privada.

**Decisión de arquitectura:** camino B · GitHub Pages + Apps Script como endpoint controlado (5 de noviembre de 2026).
**Estado:** implementación de referencia en `apps-script/Code.gs`, **sin desplegar** y **sin consumir** desde la web.
**Relación:** complementa `docs/00_DOCUMENTO_BASE.md` (secciones 10 y 12) y `AGENTS.md`.

---

## 1. Qué resuelve y qué no

Resuelve:

- la Sheet permanece privada;
- el navegador nunca contiene claves ni credenciales;
- la verificación de claves ocurre fuera del bundle;
- la web recibe datos estructurados por encabezado, sin esquemas rígidos en el código.

No resuelve:

- autenticación individual ni cuentas de usuario;
- datos personales, métricas por persona o logs de usuarios;
- escritura desde la web (el endpoint es sólo lectura);
- protección contra abuso o scraping más allá de la cuota de Apps Script;
- reemplazo inmediato del gate de evaluación actual.

---

## 2. Requisitos previos en la Sheet

El proyecto debe ser propietario o tener acceso de edición a la spreadsheet, y **no** debe publicarla en la web.

### Hoja `Claves`

| Columna | Obligatoria | Contenido |
|---|---|---|
| `clave_hash` | Sí | SHA-256 en hexadecimal de la clave institucional, en minúsculas. |
| `institucion_id` | Sí | ID de la institución; debe coincidir con `Instituciones`. |
| `estado` | Sí | `activa` para habilitar; cualquier otro valor rechaza la clave. |
| `etiqueta` | No | Referencia interna legible, sin datos personales. |

La clave en texto plano se entrega a la institución fuera de la Sheet y **no** se guarda en ella.

Para generar el hash, el Apps Script incluye la función auxiliar `generarHashDeClave(clave)`, que se ejecuta manualmente desde el editor.

### Hoja `Instituciones`

| Columna | Obligatoria | Contenido |
|---|---|---|
| `id` | Sí | ID de la institución (`INS-001`, `MUS-U995`, …). |
| `nombre` | Sí | Nombre visible para la institución autenticada. |
| `tipo` | No | `museo`, `asociacion`, `aliado`, etc. |

### Hojas de contenido

Se exponen sólo si existen y tienen encabezados en la primera fila:

`Config`, `Museos`, `Episodios`, `Misiones`, `Reactivos`, `Contenidos`, `Propuestas`.

Nunca se exponen: `Claves`, `Logs`, `Metricas`, `Instituciones`, `Propiedad_Intelectual`.

---

## 3. Propiedades del script

Se configuran en *Configuración del proyecto → Propiedades del script*. No van en el código ni en el repositorio.

| Propiedad | Obligatoria | Ejemplo |
|---|---|---|
| `ISA_SHEET_ID` | Sí | ID de la spreadsheet privada. |
| `ISA_TOKEN_SECRET` | Sí | Cadena aleatoria de al menos 32 caracteres. |
| `ISA_TOKEN_TTL_SECONDS` | No | `21600` (6 horas) por defecto. |
| `ISA_MAX_ROWS` | No | Límite de filas leídas por hoja; `2000` por defecto. |

---

## 4. Contrato de la API

Base: la URL `/exec` del despliegue del Web App.

Todas las respuestas son JSON con `Content-Type: application/json`.

### 4.1 `GET ?action=ping`

Comprueba que el endpoint responde. No requiere token.

```json
{
  "ok": true,
  "service": "isa-endpoint",
  "version": "1.0.0",
  "time": "2026-11-05T13:00:00.000Z"
}
```

### 4.2 `POST` con cuerpo `{ "action": "validate", "key": "..." }`

Valida la clave institucional.

Recomendaciones del cliente:

- `Content-Type: text/plain;charset=utf-8` para evitar el preflight CORS;
- cuerpo JSON serializado como texto;
- no registrar la clave en consola ni en analítica.

Respuesta correcta:

```json
{
  "ok": true,
  "token": "<payload>.<firma>",
  "expiresIn": 21600,
  "institution": {
    "id": "MUS-U995",
    "nombre": "Submarino Museo U-995",
    "tipo": "museo"
  }
}
```

Respuesta de rechazo (siempre genérica):

```json
{ "ok": false, "error": "invalid_key" }
```

Otros errores: `source_unavailable`, `internal`, `unknown_action`.

### 4.3 `GET ?action=data&token=...`

Devuelve todas las hojas expuestas.

```json
{
  "ok": true,
  "institution": { "id": "MUS-U995" },
  "generatedAt": "2026-11-05T13:00:00.000Z",
  "sheets": {
    "Museos": [ { "id": "MUS-U995", "nombre": "..." } ],
    "Episodios": [ { "id": "EPI-ACERO-04", "titulo": "..." } ]
  }
}
```

### 4.4 `GET ?action=data&token=...&sheet=Museos`

Devuelve una sola hoja autorizada.

Sin token válido: `{ "ok": false, "error": "unauthorized" }`.

---

## 5. Seguridad

- Las claves se comparan por hash SHA-256; no se guardan en texto plano.
- El token es `base64url(payload).hmacSHA256(payload)` y caduca según `ISA_TOKEN_TTL_SECONDS`.
- La firma se compara en tiempo constante.
- La verificación de la firma se hace antes de interpretar el payload.
- El Web App se ejecuta como el usuario que lo despliega y es accesible sin sesión de Google: por eso el token y el hash son la única barrera.
- El endpoint no devuelve mensajes que distingan “clave inexistente” de “clave suspendida”.
- El endpoint no acepta escrituras.
- Los secretos se rotan cambiando `ISA_TOKEN_SECRET` y redesplegando.

Riesgos residuales aceptados en esta etapa:

- cualquiera puede llamar a `ping` o intentar `validate`; la protección es la entropía y longitud de las claves;
- no hay rate limiting propio; se depende de la cuota de Apps Script;
- el token viaja en la URL de `data`, por lo que puede quedar en historial o logs intermedios. Es una limitación conocida del diseño; si se requiere mayor rigor, el siguiente paso es mover `data` a `POST`.

---

## 6. Despliegue

Manual, por el responsable del proyecto:

1. Crear el proyecto en <https://script.google.com> o usar `clasp`.
2. Cargar `Code.gs` y `appsscript.json` de `apps-script/`.
3. Configurar `ISA_SHEET_ID` y `ISA_TOKEN_SECRET` en Propiedades del script.
4. Crear las hojas `Claves` e `Instituciones` con las columnas del punto 2.
5. Implementar → *Nueva implementación* → tipo *Aplicación web*:
   - ejecutar como: **Yo**;
   - acceso: **Cualquier persona**.
6. Copiar la URL `/exec` y compartirla con el proyecto para conectar el adaptador web.
7. Verificar `?action=ping` y una validación con clave de prueba.

Nunca se versiona la URL `/exec` con credenciales ni el secreto en el repositorio.

---

## 7. Integración prevista en la web

Todavía no implementada. Cuando se autorice:

1. agregar `lib/sheets/client.ts` con `validateKey()` y `fetchData()`;
2. leer la URL desde `NEXT_PUBLIC_ISA_ENDPOINT` (URL pública, no secreta);
3. guardar el token en `sessionStorage`, igual que el acceso actual;
4. mantener fallback a fixtures locales si el endpoint falla;
5. mostrar el estado de la fuente (`remota`, `local`, `error`);
6. no retirar el gate de evaluación hasta comprobar el flujo completo.

---

## 8. Comprobaciones realizadas

- Sintaxis de `Code.gs` validada como JavaScript.
- El endpoint no contiene claves, IDs de spreadsheet ni secretos.
- No se agregaron dependencias al proyecto web.
- No se modificó ninguna ruta ni componente de la interfaz.

Pendiente de comprobar por el responsable: despliegue real, CORS desde el dominio de producción, cuotas y comportamiento con la Sheet definitiva.
