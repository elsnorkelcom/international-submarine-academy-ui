/**
 * Storage abstraction.
 *
 * `LocalRepository` never talks to IndexedDB or localStorage directly: it uses a
 * `StorageAdapter`. That keeps the repository testable in Node (memory adapter)
 * and swappable for a future Sheets or API adapter.
 */

import type { CollectionName, LanguageCode, LocalizedText } from '../domain/types';

export interface StorageAdapter {
  getAll<T>(collection: CollectionName): Promise<T[]>;
  get<T>(collection: CollectionName, id: string): Promise<T | null>;
  put<T>(collection: CollectionName, value: T): Promise<void>;
  putMany<T>(collection: CollectionName, values: T[]): Promise<void>;
  delete(collection: CollectionName, id: string): Promise<void>;
  clear(collection: CollectionName): Promise<void>;
}

/** Reads bilingual values and plain strings from any record shape. */
export function collectStrings(value: unknown, bucket: string[] = []): string[] {
  if (typeof value === 'string') {
    bucket.push(value.toLowerCase());
    return bucket;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, bucket);
    }

    return bucket;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectStrings(item, bucket);
    }
  }

  return bucket;
}

/** Case-insensitive search across every string in the record. */
export function matchesSearch(record: unknown, query: string): boolean {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  return collectStrings(record).some((value) => value.includes(needle));
}

export function readField(record: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, record);
}

/** Sorts primitives, numbers, booleans, localized text and ISO dates. */
export function compareValues(left: unknown, right: unknown, language: LanguageCode): number {
  const normalize = (value: unknown): string | number => {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return Number(value);
    }

    if (typeof value === 'object' && 'en' in (value as LocalizedText)) {
      const text = value as LocalizedText;
      return (language === 'es' ? text.es : text.en).toLowerCase();
    }

    if (Array.isArray(value)) {
      return value.length;
    }

    return String(value).toLowerCase();
  };

  const a = normalize(left);
  const b = normalize(right);

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return String(a).localeCompare(String(b));
}
