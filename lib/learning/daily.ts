/** Cuadro de honor diario: local, sin datos personales, se reinicia a las 24 h. */

export interface DailyRecord {
  dayKey: string;
  points: number;
  missions: number;
  bestStreak: number;
}

const DAILY_KEY = 'isa-daily-honor-v1';

/** Clave de día local (YYYY-MM-DD); el ranking reinicia cada 24 h. */
export function dailyKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaily(now: Date = new Date()): DailyRecord | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DAILY_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DailyRecord;
    if (parsed.dayKey !== dailyKey(now)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function recordDaily(points: number, streak: number, now: Date = new Date()): DailyRecord | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const current = getDaily(now) ?? { dayKey: dailyKey(now), points: 0, missions: 0, bestStreak: 0 };
  const next: DailyRecord = {
    dayKey: current.dayKey,
    points: current.points + Math.max(0, points),
    missions: current.missions + 1,
    bestStreak: Math.max(current.bestStreak, streak),
  };

  try {
    window.localStorage.setItem(DAILY_KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento, el cuadro de honor vive solo en memoria de la sesión.
  }

  return next;
}
