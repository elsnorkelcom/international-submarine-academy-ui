/**
 * Minimal, dependency-free CSV reader/writer.
 *
 * Supports quoted fields, escaped quotes, embedded commas and newlines, and
 * both comma and semicolon delimiters.
 */

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
  delimiter: string;
}

export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const commas = (firstLine.match(/,/g) ?? []).length;
  const semicolons = (firstLine.match(/;/g) ?? []).length;

  return semicolons > commas ? ';' : ',';
}

export function parseCsv(text: string, delimiter = detectDelimiter(text)): ParsedCsv {
  const source = text.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let field = '';
  let row: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (insideQuotes) {
      if (character === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        field += character;
      }

      continue;
    }

    if (character === '"') {
      insideQuotes = true;
      continue;
    }

    if (character === delimiter) {
      row.push(field);
      field = '';
      continue;
    }

    if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') {
        index += 1;
      }

      row.push(field);
      records.push(row);
      row = [];
      field = '';
      continue;
    }

    field += character;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    records.push(row);
  }

  const cleaned = records.filter((record) => record.some((value) => value.trim().length > 0));
  const headers = (cleaned.shift() ?? []).map((header, position) => {
    const value = header.trim();
    return value.length > 0 ? value : `column_${position + 1}`;
  });

  return { headers, rows: cleaned, delimiter };
}

export function toObjects(csv: ParsedCsv): Record<string, string>[] {
  return csv.rows.map((row) => {
    const record: Record<string, string> = {};

    csv.headers.forEach((header, position) => {
      record[header] = (row[position] ?? '').trim();
    });

    return record;
  });
}

function escapeCell(value: string): string {
  const needsQuotes = /[",\n\r;]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const lines = [headers.map(escapeCell).join(',')];

  for (const row of rows) {
    lines.push(row.map((cell) => escapeCell(cell === null || cell === undefined ? '' : String(cell))).join(','));
  }

  return `${lines.join('\n')}\n`;
}

/** Normalizes a header for fuzzy matching: lowercase, no accents, no punctuation. */
export function normalizeHeader(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
