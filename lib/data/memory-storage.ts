/**
 * In-memory storage adapter.
 *
 * Used by tests, by the Node smoke check and as a safe fallback when IndexedDB
 * is unavailable (private mode, restricted browser).
 */

import type { CollectionName } from '../domain/types';
import type { StorageAdapter } from './storage';

export class MemoryStorage implements StorageAdapter {
  private readonly stores = new Map<CollectionName, Map<string, unknown>>();

  async getAll<T>(collection: CollectionName): Promise<T[]> {
    return Array.from(this.store(collection).values()) as T[];
  }

  async get<T>(collection: CollectionName, id: string): Promise<T | null> {
    return (this.store(collection).get(id) as T | undefined) ?? null;
  }

  async put<T>(collection: CollectionName, value: T): Promise<void> {
    const record = value as { id?: string };

    if (!record.id) {
      throw new Error('Storage records require an "id".');
    }

    this.store(collection).set(record.id, structuredClone(value));
  }

  async putMany<T>(collection: CollectionName, values: T[]): Promise<void> {
    for (const value of values) {
      await this.put(collection, value);
    }
  }

  async delete(collection: CollectionName, id: string): Promise<void> {
    this.store(collection).delete(id);
  }

  async clear(collection: CollectionName): Promise<void> {
    this.store(collection).clear();
  }

  private store(collection: CollectionName): Map<string, unknown> {
    let store = this.stores.get(collection);

    if (!store) {
      store = new Map<string, unknown>();
      this.stores.set(collection, store);
    }

    return store;
  }
}
