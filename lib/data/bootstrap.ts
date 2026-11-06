/**
 * First-run bootstrap.
 *
 * Writes the seed dataset once, only when the local database is empty, so user
 * edits are never overwritten on subsequent visits.
 */

import { seedCollections, SEED_SETTINGS, SEED_VERSION } from './seed';
import { applyConfig } from './config';
import type { LocalDatabase } from './repository';

export interface BootstrapResult {
  seeded: boolean;
  version: number;
}

export const SEED_MARKER_KEY = 'isa-seed-version';

export async function ensureSeed(
  database: LocalDatabase,
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void } | null,
): Promise<BootstrapResult> {
  const seasons = await database.repository('seasons').count();

  if (seasons > 0) {
    return { seeded: false, version: SEED_VERSION };
  }

  for (const collection of seedCollections()) {
    const repository = database.repository(collection.name);
    await repository.importRecords(collection.records, 'upsert');
  }

  const settings = await database.settings().get();

  if (!settings) {
    await database.settings().save(SEED_SETTINGS);
  }

  // Accreditation rules come from the configuration table, not from the seed.
  try {
    await applyConfig(database);
  } catch {
    // Configuration is optional on first run.
  }

  storage?.setItem(SEED_MARKER_KEY, String(SEED_VERSION));

  return { seeded: true, version: SEED_VERSION };
}
