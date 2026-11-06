/**
 * IndexedDB storage adapter.
 *
 * One object store per collection, all keyed by `id`. The database is versioned
 * so future collections can be added with an upgrade migration.
 *
 * Every operation resolves when its transaction completes. Completion handlers
 * are attached before the request is issued, so a fast transaction can never
 * leave a pending promise behind.
 */

import { COLLECTIONS, type CollectionName } from '../domain/types';
import type { StorageAdapter } from './storage';

const DATABASE_NAME = 'isa';
const DATABASE_VERSION = 1;

export class IndexedDbStorage implements StorageAdapter {
  private database: Promise<IDBDatabase> | null = null;

  async getAll<T>(collection: CollectionName): Promise<T[]> {
    const result = await this.run<T[]>(collection, 'readonly', (store) => store.getAll());
    return result ?? [];
  }

  async get<T>(collection: CollectionName, id: string): Promise<T | null> {
    const result = await this.run<T>(collection, 'readonly', (store) => store.get(id));
    return result ?? null;
  }

  async put<T>(collection: CollectionName, value: T): Promise<void> {
    await this.run(collection, 'readwrite', (store) =>
      store.put(value as unknown as Record<string, unknown>),
    );
  }

  async putMany<T>(collection: CollectionName, values: T[]): Promise<void> {
    if (values.length === 0) {
      return;
    }

    await this.run(collection, 'readwrite', (store) => {
      for (const value of values) {
        store.put(value as unknown as Record<string, unknown>);
      }

      return undefined;
    });
  }

  async delete(collection: CollectionName, id: string): Promise<void> {
    await this.run(collection, 'readwrite', (store) => store.delete(id));
  }

  async clear(collection: CollectionName): Promise<void> {
    await this.run(collection, 'readwrite', (store) => store.clear());
  }

  private async run<T>(
    collection: CollectionName,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest | undefined,
  ): Promise<T | undefined> {
    const database = await this.open();

    return new Promise<T | undefined>((resolve, reject) => {
      let transaction: IDBTransaction;

      try {
        transaction = database.transaction(collection, mode);
      } catch (error) {
        reject(error);
        return;
      }

      let value: T | undefined;

      transaction.oncomplete = () => resolve(value);
      transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));

      const request = operation(transaction.objectStore(collection));

      if (request) {
        request.onsuccess = () => {
          value = request.result as T;
        };
      }
    });
  }

  private open(): Promise<IDBDatabase> {
    if (!this.database) {
      this.database = new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
          reject(new Error('IndexedDB is not available in this environment.'));
          return;
        }

        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = () => {
          const database = request.result;

          for (const collection of COLLECTIONS) {
            if (!database.objectStoreNames.contains(collection)) {
              database.createObjectStore(collection, { keyPath: 'id' });
            }
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'));
        request.onblocked = () => reject(new Error('IndexedDB upgrade is blocked by another tab.'));
      });
    }

    return this.database;
  }
}
