/**
 * Rotación diaria determinista de variantes.
 *
 * No hay sorteo en el cliente: el día y la celda definen la variante. Todos los
 * participantes ven la misma variante el mismo día y la celda cambia con el día.
 */

const DAY_MS = 86_400_000;
/** America/Argentina/Buenos_Aires (UTC-3, sin horario de verano). */
const TZ_OFFSET_MS = -3 * 60 * 60 * 1000;

export function dayNumber(now: number = Date.now()): number {
  return Math.floor((now + TZ_OFFSET_MS) / DAY_MS);
}

export function pickVariant<T>(items: T[], cellIndex = 0, now: number = Date.now()): T | null {
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return items[0];
  }

  const index = (((dayNumber(now) + cellIndex) % items.length) + items.length) % items.length;

  return items[index];
}
