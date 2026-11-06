/**
 * Import execution.
 *
 * Merges mapped records with entity defaults, hands them to the repository and
 * combines row-level validation errors with repository-level results.
 */

import type { EntityCollectionName } from '../domain/types';
import type { LocalDatabase, ImportMode, ImportSummary } from '../data/repository';
import { buildRecords, type RowIssue } from './mapping';
import type { EntityImportSpec } from './schemas';

type Defaults = Record<string, unknown>;

const MUSEUM_DEFAULTS: Defaults = {
  museumName: { en: '', es: '' },
  country: '',
  city: '',
  website: '',
  vesselType: '',
  propulsion: '',
  origin: '',
  description: { en: '', es: '' },
  compartmentIds: [],
  episodeIds: [],
  status: 'draft',
  source: '',
  notes: '',
  latitude: null,
  longitude: null,
  launchYear: null,
  address: '',
  mediaUrl: '',
  validation: 'pending',
};

const INSTITUTION_DEFAULTS: Defaults = {
  type: 'other',
  country: '',
  city: '',
  website: '',
  contactName: '',
  contactEmail: '',
  status: 'active',
  notes: '',
};

const QUESTION_DEFAULTS: Defaults = {
  missionId: '',
  episodeId: '',
  museumId: '',
  compartmentId: '',
  equipmentId: '',
  area: '',
  timssDomain: 'knowing',
  gsaCompetency: '',
  topic: '',
  level: '',
  feedback: { en: '', es: '' },
  civilSocietyConnection: { en: '', es: '' },
  source: '',
  status: 'proposal',
  notes: '',
};

function defaultsFor(collection: EntityCollectionName): Defaults {
  if (collection === 'museums') return MUSEUM_DEFAULTS;
  if (collection === 'institutions') return INSTITUTION_DEFAULTS;
  if (collection === 'questions') return QUESTION_DEFAULTS;
  return {};
}

export interface ImportReport {
  mode: ImportMode;
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  issues: RowIssue[];
}

/** Natural key used when the source file has no ID column. */
function naturalKey(record: Record<string, unknown>): string | null {
  for (const key of ['name', 'title', 'text']) {
    const value = record[key];

    if (value && typeof value === 'object' && 'en' in (value as Record<string, unknown>)) {
      const text = String((value as { en?: string }).en ?? '').trim().toLowerCase();

      if (text.length > 0) {
        return text;
      }
    }
  }

  return null;
}

export interface RunImportInput {
  database: LocalDatabase;
  spec: EntityImportSpec;
  objects: Record<string, string>[];
  mapping: Record<string, string>;
  mode: ImportMode;
}

export async function runImport({
  database,
  spec,
  objects,
  mapping,
  mode,
}: RunImportInput): Promise<ImportReport> {
  const built = buildRecords(objects, mapping, spec);
  const defaults = defaultsFor(spec.collection);

  const records = built.records.map((record) => {
    const merged: Record<string, unknown> = { ...defaults, ...record };

    if (spec.collection === 'questions') {
      merged.options = [
        { id: 'A', text: record.optionA ?? { en: '', es: '' } },
        { id: 'B', text: record.optionB ?? { en: '', es: '' } },
        { id: 'C', text: record.optionC ?? { en: '', es: '' } },
        { id: 'D', text: record.optionD ?? { en: '', es: '' } },
      ];

      if (typeof merged.correctOptionId === 'string') {
        merged.correctOptionId = merged.correctOptionId.toUpperCase();
      }

      delete merged.optionA;
      delete merged.optionB;
      delete merged.optionC;
      delete merged.optionD;
    }

    return merged;
  });

  const repository = database.repository(spec.collection);

  // Without an ID column, match existing rows by their natural key so importing
  // the same source twice updates instead of duplicating.
  if (!mapping.id) {
    try {
      const existing = await repository.list({ pageSize: 0, includeDeleted: true });
      const idByKey = new Map<string, string>();

      for (const item of existing.items) {
        const key = naturalKey(item as unknown as Record<string, unknown>);
        const id = (item as { id?: string }).id;

        if (key && id) {
          idByKey.set(key, id);
        }
      }

      for (const record of records) {
        const key = naturalKey(record);
        const match = key ? idByKey.get(key) : undefined;

        if (match) {
          record.id = match;
        }
      }
    } catch {
      // Matching is an optimization; a failure only means new records are created.
    }
  }

  const summary: ImportSummary = await repository.importRecords(records, mode);

  const issues: RowIssue[] = [...built.issues];

  for (const issue of summary.issues) {
    const line = built.rows[issue.index];
    issues.push({ row: line ?? issue.index + 2, message: issue.message, severity: 'error' });
  }

  return {
    mode,
    total: objects.length,
    created: summary.created,
    updated: summary.updated,
    skipped: built.skipped + summary.skipped,
    failed: summary.failed,
    issues,
  };
}

export function templateCsv(spec: EntityImportSpec): string {
  const headers = spec.fields.map((field) => field.key);
  const example = spec.fields.map((field) => field.example);
  return `${headers.join(',')}\n${example.map((value) => (/,/.test(value) ? `"${value}"` : value)).join(',')}\n`;
}
