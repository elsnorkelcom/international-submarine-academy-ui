/**
 * Local administration gate.
 *
 * This is a local deterrent, not server-side security: the passphrase hash lives
 * in localStorage and the session flag in sessionStorage. Real institutional
 * verification is a separate, pending stage (Apps Script endpoint).
 */

export const ADMIN_HASH_KEY = 'isa-admin-hash';
export const ADMIN_SESSION_KEY = 'isa-admin-session';

export async function sha256Hex(value: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto is not available in this browser.');
  }

  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function hasAdminSession(): boolean {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'open';
  } catch {
    return false;
  }
}

export function openAdminSession(): void {
  try {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'open');
  } catch {
    // The session flag is a convenience; the gate stays closed on reload.
  }
}

export function closeAdminSession(): void {
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function readAdminHash(): string | null {
  try {
    return window.localStorage.getItem(ADMIN_HASH_KEY);
  } catch {
    return null;
  }
}

export function writeAdminHash(hash: string): void {
  try {
    window.localStorage.setItem(ADMIN_HASH_KEY, hash);
  } catch {
    // Without storage the gate cannot persist; the session still works.
  }
}
