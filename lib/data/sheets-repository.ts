/**
 * Future remote adapters.
 *
 * This file contains contracts only. No network code runs in the current
 * local-first version: it exists so the UI can depend on the same interfaces
 * when a Google Sheets / Apps Script endpoint is connected later.
 */

import type { EntityBase, IsoDateString } from '../domain/types';
import type { Repository } from './repository';

/** Where a record was loaded from. The UI must surface this to the user. */
export type DataSourceKind = 'local' | 'remote' | 'seed';

export interface RemoteSession {
  institutionId: string;
  token: string;
  expiresAt: IsoDateString;
}

/** Client contract for the Apps Script endpoint described in docs/07. */
export interface SheetsClient {
  validateKey(key: string): Promise<RemoteSession>;
  fetchCollections(token: string): Promise<Record<string, unknown[]>>;
}

/** A repository that reads from a remote source and never writes to it. */
export interface SheetsRepository<T extends EntityBase> extends Repository<T> {
  readonly kind: 'remote';
  refresh(): Promise<number>;
}

/** Not implemented yet. Throws so misuse is loud instead of silent. */
export function createSheetsRepository<T extends EntityBase>(): SheetsRepository<T> {
  throw new Error(
    'SheetsRepository is not implemented. Connect the Apps Script endpoint first (docs/07_ENDPOINT_APPS_SCRIPT.md).',
  );
}
