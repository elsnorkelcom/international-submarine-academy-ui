/**
 * Column mapping, coercion and row validation.
 *
 * The importer never assumes fixed column names: the user maps CSV headers to
 * entity fields, and this module only applies the mapping plus type rules.
 */

import { normalizeHeader } from './csv';
import type { EntityImportSpec, FieldSpec } from './schemas';

export type IssueSeverity = 'error' | 'warning';

export interface RowIssue {
  row: number;
  column?: string;
  message: string;
  severity: IssueSeverity;
}

export interface BuildResult {
  records: Record<string, unknown>[];
  /** 1-based row numbers matching `records`, used to report repository errors. */
  rows: number[];
  issues: RowIssue[];
  skipped: number;
}

export function guessMapping(headers: string[], spec: EntityImportSpec): Record<string, string> {
  const normalized = headers.map((header) => ({ header, key: normalizeHeader(header) }));
  const mapping: Record<string, string> = {};

  for (const field of spec.fields) {
    const candidates = [field.key, field.label, ...(field.aliases ?? [])].map(normalizeHeader);
    const hit = normalized.find((candidate) => candidates.includes(candidate.key));

    if (hit && !Object.values(mapping).includes(hit.header)) {
      mapping[field.key] = hit.header;
    }
  }

  return mapping;
}

export function missingRequiredFields(
  mapping: Record<string, string>,
  spec: EntityImportSpec,
): FieldSpec[] {
  return spec.fields.filter((field) => field.required && !mapping[field.key]);
}

function coerce(field: FieldSpec, raw: string): { value: unknown; warning?: string } {
  const value = raw.trim();

  if (field.type === 'localized') {
    return { value: { en: value, es: value } };
  }

  if (field.type === 'number') {
    if (value === '') {
      return { value: null };
    }

    const parsed = Number(value.replace(',', '.'));

    if (Number.isNaN(parsed)) {
      return { value: null, warning: `"${value}" is not a number; the value was left empty.` };
    }

    return { value: parsed };
  }

  if (field.type === 'enum') {
    const allowed = field.enumValues ?? [];

    if (value === '') {
      return { value: allowed[0] ?? '' };
    }

    const normalized = normalizeHeader(value);
    const match = allowed.find((option) => normalizeHeader(option) === normalized)
      ?? allowed.find((option) => {
        const optionKey = normalizeHeader(option);
        return optionKey.length > 0 && normalized.includes(optionKey);
      });

    if (!match) {
      return {
        value: allowed[0] ?? '',
        warning: `"${value}" is not one of: ${allowed.join(', ')}. Defaulted to "${allowed[0] ?? ''}".`,
      };
    }

    return { value: match };
  }

  if (field.type === 'list') {
    return { value: value ? value.split(/[|;]/).map((item) => item.trim()).filter(Boolean) : [] };
  }

  return { value };
}

/** Builds entity records from mapped objects, collecting every row problem. */
export function buildRecords(
  objects: Record<string, string>[],
  mapping: Record<string, string>,
  spec: EntityImportSpec,
): BuildResult {
  const result: BuildResult = { records: [], rows: [], issues: [], skipped: 0 };
  const seenIds = new Map<string, number>();

  objects.forEach((object, index) => {
    const line = index + 2; // header is line 1
    const record: Record<string, unknown> = {};
    const problems: RowIssue[] = [];
    const warnings: RowIssue[] = [];

    for (const field of spec.fields) {
      const header = mapping[field.key];

      if (!header) {
        continue;
      }

      const raw = object[header] ?? '';
      const { value, warning } = coerce(field, raw);

      if (warning) {
        warnings.push({ row: line, column: field.key, message: warning, severity: 'warning' });
      }

      if (field.required && raw.trim() === '') {
        problems.push({ row: line, column: field.key, message: 'Required value is missing.', severity: 'error' });
        continue;
      }

      record[field.key] = value;
    }

    const id = record.id;

    if (typeof id === 'string' && id.length > 0) {
      const previous = seenIds.get(id);

      if (previous !== undefined) {
        problems.push({
          row: line,
          column: 'id',
          message: `Duplicate ID "${id}" inside the file (first seen on line ${previous}).`,
          severity: 'error',
        });
      } else {
        seenIds.set(id, line);
      }
    }

    result.issues.push(...warnings);

    if (problems.length > 0) {
      result.issues.push(...problems);
      result.skipped += 1;
      return;
    }

    result.records.push(record);
    result.rows.push(line);
  });

  return result;
}
