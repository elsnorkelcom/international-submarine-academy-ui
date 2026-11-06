/**
 * Repository pattern.
 *
 * `Repository<T>` is the contract the UI and business logic depend on.
 * `LocalRepository<T>` implements it over any `StorageAdapter`, so the same
 * contract can later be implemented by a Google Sheets or API adapter.
 */

import type {
  EntityBase,
  IsoDateString,
  LanguageCode,
  LocalizedText,
  Settings,
} from '../domain/types';
import {
  READABLE_ID_PREFIX,
  type CollectionName,
  type EntityByCollection,
  type EntityCollectionName,
} from '../domain/types';
import {
  compareValues,
  matchesSearch,
  readField,
  type StorageAdapter,
} from './storage';

export interface RepositoryOptions {
  /** Injected clock, so tests stay deterministic. */
  now?: () => IsoDateString;
  /** Actor recorded in the audit trail. */
  actor?: string;
  /** Language used for sorting localized fields. */
  language?: LanguageCode;
  /** Optional record validator. Returning messages rejects the write. */
  validate?: (record: unknown) => string[];
}

export interface ListOptions {
  search?: string;
  status?: string | string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
  predicate?: (record: unknown) => boolean;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ImportMode = 'create-only' | 'upsert' | 'replace';

export interface ImportIssue {
  index: number;
  id: string | null;
  message: string;
}

export interface ImportSummary {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  issues: ImportIssue[];
}

export type CreateInput<T extends EntityBase> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt'
> & { id?: string };

export type UpdateInput<T extends EntityBase> = Partial<
  Omit<T, 'id' | 'createdAt' | 'createdBy'>
>;

export interface Repository<T extends EntityBase> {
  list(options?: ListOptions): Promise<ListResult<T>>;
  get(id: string): Promise<T | null>;
  create(input: CreateInput<T>): Promise<T>;
  update(id: string, patch: UpdateInput<T>): Promise<T>;
  softDelete(id: string): Promise<T>;
  restore(id: string): Promise<T>;
  duplicate(id: string): Promise<T>;
  importRecords(records: unknown[], mode: ImportMode): Promise<ImportSummary>;
  count(options?: ListOptions): Promise<number>;
}

export class ValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues.join(' '));
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export class NotFoundError extends Error {
  constructor(id: string) {
    super(`Record "${id}" was not found.`);
    this.name = 'NotFoundError';
  }
}

const DEFAULT_PAGE_SIZE = 25;

export function createId(prefix: string): string {
  const random =
    typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto
      ? globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${random.toUpperCase()}`;
}

export class LocalRepository<T extends EntityBase> implements Repository<T> {
  private readonly storage: StorageAdapter;
  private readonly collection: CollectionName;
  private readonly options: Required<Pick<RepositoryOptions, 'now' | 'actor' | 'language'>> &
    Pick<RepositoryOptions, 'validate'>;

  constructor(
    storage: StorageAdapter,
    collection: CollectionName,
    options: RepositoryOptions = {},
  ) {
    this.storage = storage;
    this.collection = collection;
    this.options = {
      now: options.now ?? (() => new Date().toISOString()),
      actor: options.actor ?? 'local-admin',
      language: options.language ?? 'en',
      validate: options.validate,
    };
  }

  async list(options: ListOptions = {}): Promise<ListResult<T>> {
    const all = await this.storage.getAll<T>(this.collection);
    const includeDeleted = options.includeDeleted ?? false;
    const statuses = options.status
      ? Array.isArray(options.status)
        ? options.status
        : [options.status]
      : [];

    let items = all.filter((record) => includeDeleted || record.deletedAt === null);

    if (statuses.length > 0) {
      items = items.filter((record) => {
        const status = (record as unknown as { status?: string }).status;
        return status !== undefined && statuses.includes(status);
      });
    }

    if (options.search) {
      items = items.filter((record) => matchesSearch(record, options.search ?? ''));
    }

    if (options.predicate) {
      const predicate = options.predicate;
      items = items.filter((record) => predicate(record));
    }

    if (options.sortBy) {
      const direction = options.sortDirection === 'desc' ? -1 : 1;
      const path = options.sortBy;
      const language = this.options.language;

      items.sort(
        (left, right) =>
          direction * compareValues(readField(left, path), readField(right, path), language),
      );
    }

    const total = items.length;
    const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
    const page = Math.max(1, options.page ?? 1);
    const start = (page - 1) * pageSize;

    return {
      items: pageSize > 0 ? items.slice(start, start + pageSize) : items,
      total,
      page,
      pageSize,
    };
  }

  async count(options: ListOptions = {}): Promise<number> {
    const result = await this.list({ ...options, page: 1, pageSize: 0 });
    return result.total;
  }

  async get(id: string): Promise<T | null> {
    return this.storage.get<T>(this.collection, id);
  }

  async create(input: CreateInput<T>): Promise<T> {
    const timestamp = this.options.now();
    const record = {
      ...input,
      id: input.id ?? this.nextId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: this.options.actor,
      updatedBy: this.options.actor,
      deletedAt: null,
    } as unknown as T;

    this.assertValid(record);

    const existing = await this.get(record.id);

    if (existing) {
      throw new ValidationError([`A record with id "${record.id}" already exists.`]);
    }

    await this.storage.put(this.collection, record);
    return record;
  }

  async update(id: string, patch: UpdateInput<T>): Promise<T> {
    const current = await this.get(id);

    if (!current) {
      throw new NotFoundError(id);
    }

    const record = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      createdBy: current.createdBy,
      updatedAt: this.options.now(),
      updatedBy: this.options.actor,
    } as T;

    this.assertValid(record);
    await this.storage.put(this.collection, record);

    return record;
  }

  async softDelete(id: string): Promise<T> {
    const current = await this.get(id);

    if (!current) {
      throw new NotFoundError(id);
    }

    const record: T = {
      ...current,
      deletedAt: this.options.now(),
      updatedAt: this.options.now(),
      updatedBy: this.options.actor,
    };

    await this.storage.put(this.collection, record);
    return record;
  }

  async restore(id: string): Promise<T> {
    const current = await this.get(id);

    if (!current) {
      throw new NotFoundError(id);
    }

    const record: T = {
      ...current,
      deletedAt: null,
      updatedAt: this.options.now(),
      updatedBy: this.options.actor,
    };

    await this.storage.put(this.collection, record);
    return record;
  }

  async duplicate(id: string): Promise<T> {
    const current = await this.get(id);

    if (!current) {
      throw new NotFoundError(id);
    }

    const copy = structuredClone(current) as T;
    const timestamp = this.options.now();
    const record: T = {
      ...copy,
      ...copyLabel(copy),
      id: this.nextId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: this.options.actor,
      updatedBy: this.options.actor,
      deletedAt: null,
    };

    await this.storage.put(this.collection, record);
    return record;
  }

  /** Row-resilient import: one failing record never aborts the batch. */
  async importRecords(records: unknown[], mode: ImportMode): Promise<ImportSummary> {
    const summary: ImportSummary = {
      total: records.length,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      issues: [],
    };

    if (mode === 'replace') {
      await this.storage.clear(this.collection);
    }

    // One read for the whole batch keeps large imports (160+ rows) fast.
    const existingRecords = await this.storage.getAll<T>(this.collection);
    const existingById = new Map<string, T>(
      existingRecords.map((record) => [record.id, record]),
    );

    const batch: T[] = [];

    for (let index = 0; index < records.length; index += 1) {
      const raw = records[index] as Record<string, unknown>;
      const rawId = typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : null;

      try {
        const timestamp = this.options.now();
        const existing = rawId ? (existingById.get(rawId) ?? null) : null;

        if (existing && mode === 'create-only') {
          summary.skipped += 1;
          summary.issues.push({
            index,
            id: rawId,
            message: `Skipped: id "${rawId}" already exists.`,
          });
          continue;
        }

        const record = {
          ...raw,
          id: rawId ?? this.nextId(),
          createdAt: existing?.createdAt ?? timestamp,
          createdBy: existing?.createdBy ?? this.options.actor,
          updatedAt: timestamp,
          updatedBy: this.options.actor,
          deletedAt: null,
        } as unknown as T;

        const issues = this.options.validate?.(record) ?? [];

        if (issues.length > 0) {
          throw new ValidationError(issues);
        }

        batch.push(record);
        existingById.set(record.id, record);

        if (existing) {
          summary.updated += 1;
        } else {
          summary.created += 1;
        }
      } catch (error) {
        summary.failed += 1;
        summary.issues.push({
          index,
          id: rawId,
          message: error instanceof Error ? error.message : 'Unknown import error.',
        });
      }
    }

    await this.storage.putMany(this.collection, batch);

    return summary;
  }

  private nextId(): string {
    const prefix = READABLE_ID_PREFIX[this.collection as EntityCollectionName] ?? 'REC';
    return createId(prefix);
  }

  private assertValid(record: T): void {
    const issues = this.options.validate?.(record) ?? [];

    if (!record.id || !record.id.trim()) {
      issues.push('The record requires a non-empty id.');
    }

    if (!record.createdAt || !record.updatedAt) {
      issues.push('The record requires createdAt and updatedAt timestamps.');
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }
  }
}

/** Adds a readable suffix to a duplicated record when it has a name or title. */
function copyLabel(record: object): Partial<Record<'name' | 'title', LocalizedText>> {
  const localizedKeys = ['name', 'title'] as const;

  for (const key of localizedKeys) {
    const value = (record as Record<string, unknown>)[key];

    if (isLocalizedText(value)) {
      return {
        [key]: {
          en: `${value.en} (copy)`,
          es: `${value.es} (copia)`,
        },
      };
    }
  }

  return {};
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as LocalizedText).en === 'string' &&
    typeof (value as LocalizedText).es === 'string'
  );
}

/** Settings are a singleton record with a fixed id. */
export const SETTINGS_ID = 'settings';

export class SettingsStore {
  private readonly repository: LocalRepository<Settings>;

  constructor(storage: StorageAdapter, options: RepositoryOptions = {}) {
    this.repository = new LocalRepository<Settings>(storage, 'settings', options);
  }

  async get(): Promise<Settings | null> {
    return this.repository.get(SETTINGS_ID);
  }

  async save(settings: CreateInput<Settings>): Promise<Settings> {
    const existing = await this.get();

    if (existing) {
      return this.repository.update(SETTINGS_ID, settings as UpdateInput<Settings>);
    }

    return this.repository.create({ ...settings, id: SETTINGS_ID });
  }
}

/** Convenience factory that builds one typed repository per collection. */
export class LocalDatabase {
  readonly storage: StorageAdapter;
  readonly options: RepositoryOptions;

  constructor(storage: StorageAdapter, options: RepositoryOptions = {}) {
    this.storage = storage;
    this.options = options;
  }

  repository<K extends EntityCollectionName>(collection: K): LocalRepository<EntityByCollection[K]> {
    return new LocalRepository<EntityByCollection[K]>(this.storage, collection, this.options);
  }

  settings(): SettingsStore {
    return new SettingsStore(this.storage, this.options);
  }
}
