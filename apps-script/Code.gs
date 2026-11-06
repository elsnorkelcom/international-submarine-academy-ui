/**
 * ISA · Endpoint read-only para la Google Sheet privada.
 *
 * Contrato: docs/07_ENDPOINT_APPS_SCRIPT.md
 *
 * Reglas del endpoint:
 * - Sólo lectura: nunca escribe, crea ni borra filas.
 * - Nunca expone las hojas `Claves`, `Logs`, `Metricas` ni `Instituciones`.
 * - Valida claves institucionales contra un hash SHA-256 y responde con un token firmado.
 * - Los secretos viven en Propiedades del script, no en el código.
 */

var SERVICE_VERSION = '1.0.0';

var DEFAULTS = {
  tokenTtlSeconds: 6 * 60 * 60,
  maxRowsPerSheet: 2000,
  cacheSeconds: 300,
};

/** Hojas que el endpoint puede devolver al navegador. */
var EXPOSED_SHEETS = ['Config', 'Museos', 'Episodios', 'Misiones', 'Reactivos', 'Contenidos', 'Propuestas'];

/** Hojas que nunca se devuelven, aunque se soliciten por nombre. */
var NEVER_EXPOSED = ['Claves', 'Logs', 'Metricas', 'Instituciones', 'Propiedad_Intelectual'];

var PROPERTY_SHEET_ID = 'ISA_SHEET_ID';
var PROPERTY_TOKEN_SECRET = 'ISA_TOKEN_SECRET';

var KEY_SHEET = 'Claves';
var INSTITUTION_SHEET = 'Instituciones';

/**
 * GET
 *   ?action=ping
 *   ?action=data&token=...&sheet=Museos
 */
function doGet(event) {
  var params = (event && event.parameter) || {};
  var action = params.action || 'ping';

  try {
    if (action === 'ping') {
      return json_({
        ok: true,
        service: 'isa-endpoint',
        version: SERVICE_VERSION,
        time: new Date().toISOString(),
      });
    }

    if (action === 'data') {
      return handleData_(params);
    }

    return json_({ ok: false, error: 'unknown_action' });
  } catch (error) {
    return json_({ ok: false, error: 'internal' });
  }
}

/**
 * POST con cuerpo JSON o texto plano
 *   { "action": "validate", "key": "..." }
 */
function doPost(event) {
  try {
    var body = parseBody_(event);

    if (body.action === 'validate') {
      return handleValidate_(body);
    }

    return json_({ ok: false, error: 'unknown_action' });
  } catch (error) {
    return json_({ ok: false, error: 'internal' });
  }
}

/** Valida una clave institucional y devuelve un token de sesión. */
function handleValidate_(body) {
  var key = typeof body.key === 'string' ? body.key.trim() : '';

  if (!key || key.length > 200) {
    return json_({ ok: false, error: 'invalid_key' });
  }

  var sheet = readSheet_(KEY_SHEET);

  if (!sheet.ok) {
    return json_({ ok: false, error: 'source_unavailable' });
  }

  var hash = sha256Hex_(key);
  var match = null;

  for (var i = 0; i < sheet.rows.length; i += 1) {
    var row = sheet.rows[i];

    if (!row || !row.clave_hash) continue;
    if (String(row.clave_hash).trim().toLowerCase() !== hash) continue;

    if (String(row.estado || '').trim().toLowerCase() !== 'activa') {
      return json_({ ok: false, error: 'invalid_key' });
    }

    match = row;
    break;
  }

  if (!match) {
    return json_({ ok: false, error: 'invalid_key' });
  }

  var institutionId = String(match.institucion_id || '').trim();

  if (!institutionId) {
    return json_({ ok: false, error: 'invalid_key' });
  }

  var institution = findInstitution_(institutionId);

  return json_({
    ok: true,
    token: issueToken_(institutionId),
    expiresIn: getTtlSeconds_(),
    institution: {
      id: institutionId,
      nombre: institution.nombre || institutionId,
      tipo: institution.tipo || '',
    },
  });
}

/** Devuelve las hojas autorizadas. */
function handleData_(params) {
  var claims = verifyToken_(params.token);

  if (!claims) {
    return json_({ ok: false, error: 'unauthorized' });
  }

  var requested = String(params.sheet || '').trim();

  if (requested) {
    if (NEVER_EXPOSED.indexOf(requested) !== -1 || EXPOSED_SHEETS.indexOf(requested) === -1) {
      return json_({ ok: false, error: 'unauthorized' });
    }

    var single = readSheet_(requested);

    return json_({
      ok: single.ok,
      error: single.ok ? undefined : 'source_unavailable',
      institution: { id: claims.ins },
      generatedAt: new Date().toISOString(),
      sheets: single.ok ? wrapSheet_(requested, single) : {},
    });
  }

  var sheets = {};

  for (var i = 0; i < EXPOSED_SHEETS.length; i += 1) {
    var name = EXPOSED_SHEETS[i];
    var sheet = readSheet_(name);

    if (sheet.ok) {
      sheets[name] = sheet.rows;
    }
  }

  return json_({
    ok: true,
    institution: { id: claims.ins },
    generatedAt: new Date().toISOString(),
    sheets: sheets,
  });
}

/** Lee una hoja y devuelve filas como objetos usando la primera fila como encabezado. */
function readSheet_(name) {
  var cached = readCache_(name);

  if (cached) {
    return cached;
  }

  var spreadsheet = SpreadsheetApp.openById(sheetId_());
  var sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    return { ok: false, rows: [], headers: [] };
  }

  var values = sheet.getDataRange().getValues();

  if (!values.length) {
    return { ok: true, rows: [], headers: [], truncated: false };
  }

  var headers = values[0].map(function (header) {
    return String(header).trim();
  });

  var limit = Math.min(values.length, getMaxRows_());
  var rows = [];

  for (var r = 1; r < limit; r += 1) {
    var source = values[r];
    var empty = true;
    var row = {};

    for (var c = 0; c < headers.length; c += 1) {
      if (!headers[c]) continue;

      var value = source[c];

      if (value !== '' && value !== null && value !== undefined) {
        empty = false;
      }

      row[headers[c]] = value instanceof Date ? value.toISOString() : value;
    }

    if (!empty) {
      rows.push(row);
    }
  }

  var result = {
    ok: true,
    headers: headers,
    rows: rows,
    truncated: values.length > limit,
  };

  writeCache_(name, result);

  return result;
}

function wrapSheet_(name, sheet) {
  var wrapper = {};
  wrapper[name] = sheet.rows;
  return wrapper;
}

function findInstitution_(institutionId) {
  var sheet = readSheet_(INSTITUTION_SHEET);

  if (!sheet.ok) {
    return {};
  }

  for (var i = 0; i < sheet.rows.length; i += 1) {
    var row = sheet.rows[i];

    if (String(row.id || row.institucion_id || '').trim() === institutionId) {
      return row;
    }
  }

  return {};
}

/** Token: base64url(payload) + "." + hmacSHA256(payload). */
function issueToken_(institutionId) {
  var payload = base64UrlEncode_(
    JSON.stringify({
      ins: institutionId,
      exp: Math.floor(Date.now() / 1000) + getTtlSeconds_(),
    }),
  );

  return payload + '.' + hmacHex_(payload);
}

function verifyToken_(token) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 4096) {
    return null;
  }

  var parts = token.split('.');

  if (parts.length !== 2) {
    return null;
  }

  var payload = parts[0];
  var signature = parts[1];

  if (!safeEquals_(signature, hmacHex_(payload))) {
    return null;
  }

  var claims;

  try {
    claims = JSON.parse(base64UrlDecode_(payload));
  } catch (error) {
    return null;
  }

  if (!claims || typeof claims.ins !== 'string' || typeof claims.exp !== 'number') {
    return null;
  }

  if (claims.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return claims;
}

function parseBody_(event) {
  var contents = event && event.postData && event.postData.contents;

  if (!contents) {
    return {};
  }

  try {
    var parsed = JSON.parse(contents);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function sheetId_() {
  var id = PropertiesService.getScriptProperties().getProperty(PROPERTY_SHEET_ID);

  if (!id) {
    throw new Error('Falta la propiedad del script ' + PROPERTY_SHEET_ID);
  }

  return id;
}

function tokenSecret_() {
  var secret = PropertiesService.getScriptProperties().getProperty(PROPERTY_TOKEN_SECRET);

  if (!secret || secret.length < 32) {
    throw new Error('Falta la propiedad del script ' + PROPERTY_TOKEN_SECRET + ' (mínimo 32 caracteres)');
  }

  return secret;
}

function getTtlSeconds_() {
  var value = Number(PropertiesService.getScriptProperties().getProperty('ISA_TOKEN_TTL_SECONDS'));
  return value > 0 ? value : DEFAULTS.tokenTtlSeconds;
}

function getMaxRows_() {
  var value = Number(PropertiesService.getScriptProperties().getProperty('ISA_MAX_ROWS'));
  return value > 0 ? value : DEFAULTS.maxRowsPerSheet;
}

function cacheKey_(name) {
  return 'isa-sheet-' + name;
}

function readCache_(name) {
  try {
    var raw = CacheService.getScriptCache().get(cacheKey_(name));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeCache_(name, value) {
  try {
    CacheService.getScriptCache().put(cacheKey_(name), JSON.stringify(value), DEFAULTS.cacheSeconds);
  } catch (error) {
    // La caché es una optimización: si falla, se sigue leyendo la hoja.
  }
}

function sha256Hex_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
    .map(function (byte) {
      var value = (byte < 0 ? byte + 256 : byte).toString(16);
      return value.length === 1 ? '0' + value : value;
    })
    .join('');
}

function hmacHex_(text) {
  return Utilities.computeHmacSha256Signature(text, tokenSecret_(), Utilities.Charset.UTF_8)
    .map(function (byte) {
      var value = (byte < 0 ? byte + 256 : byte).toString(16);
      return value.length === 1 ? '0' + value : value;
    })
    .join('');
}

function base64UrlEncode_(text) {
  return Utilities.base64EncodeWebSafe(text, Utilities.Charset.UTF_8).replace(/=+$/, '');
}

function base64UrlDecode_(text) {
  var padded = text + new Array((4 - (text.length % 4)) % 4 + 1).join('=');
  return Utilities.newBlob(Utilities.base64DecodeWebSafe(padded)).getDataAsString();
}

/** Comparación de longitud constante para firmas. */
function safeEquals_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) {
    return false;
  }

  var diff = 0;

  for (var i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }

  return diff === 0;
}

/** Utilidad manual: genera el hash que debe guardarse en la hoja `Claves`. */
function generarHashDeClave(clave) {
  return sha256Hex_(String(clave || '').trim());
}
