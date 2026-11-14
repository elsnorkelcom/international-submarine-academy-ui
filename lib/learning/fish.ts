/** Nick de pez: tradición de bautismo en el dominio de Neptuno. Se asigna una vez y queda estable en el dispositivo. */

export interface FishNick {
  es: string;
  en: string;
}

const NICK_KEY = 'isa-fish-nick-v1';

export const FISH_NICKS: FishNick[] = [
  { es: 'Pez Luna', en: 'Moonfish' },
  { es: 'Pez Espada', en: 'Swordfish' },
  { es: 'Pez Globo', en: 'Pufferfish' },
  { es: 'Pez Ángel', en: 'Angelfish' },
  { es: 'Pez Payaso', en: 'Clownfish' },
  { es: 'Pez Volador', en: 'Flying Fish' },
  { es: 'Pez Martillo', en: 'Hammerhead' },
  { es: 'Pez Sierra', en: 'Sawfish' },
  { es: 'Pez Gato', en: 'Catfish' },
  { es: 'Pez Tigre', en: 'Tigerfish' },
  { es: 'Pez Linterna', en: 'Lanternfish' },
  { es: 'Pez Trompeta', en: 'Trumpetfish' },
  { es: 'Pez Piedra', en: 'Stonefish' },
  { es: 'Pez Aguja', en: 'Needlefish' },
  { es: 'Pez Rey', en: 'Kingfish' },
  { es: 'Pez Murciélago', en: 'Batfish' },
  { es: 'Pez Ballesta', en: 'Triggerfish' },
  { es: 'Pez Vela', en: 'Sailfish' },
  { es: 'Pez Dama', en: 'Damselfish' },
  { es: 'Pez Farol', en: 'Lantern eye' },
];

/** Devuelve el nick guardado o asigna uno aleatorio estable en este dispositivo. */
export function getFishNick(): FishNick {
  if (typeof window === 'undefined') {
    return FISH_NICKS[0];
  }

  try {
    const stored = window.localStorage.getItem(NICK_KEY);
    const index = stored === null ? NaN : Number.parseInt(stored, 10);

    if (Number.isInteger(index) && index >= 0 && index < FISH_NICKS.length) {
      return FISH_NICKS[index];
    }

    const assigned = Math.floor(Math.random() * FISH_NICKS.length);
    window.localStorage.setItem(NICK_KEY, String(assigned));
    return FISH_NICKS[assigned];
  } catch {
    return FISH_NICKS[Math.floor(Math.random() * FISH_NICKS.length)];
  }
}
