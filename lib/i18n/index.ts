import { TRANSLATION_BASE_LOCALE, type Locale } from './config'
import { en } from './messages/en'
import { es } from './messages/es'
import type { Messages } from './messages/types'

const DICTIONARIES: Record<Locale, Messages> = { en, es }

/**
 * Devuelve el diccionario del idioma solicitado.
 * Si el idioma no existe en tiempo de ejecución, usa la base `en`.
 */
export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale] ?? DICTIONARIES[TRANSLATION_BASE_LOCALE]
}

/** Reemplaza los marcadores `{nombre}` de una plantilla. */
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key]
    return value === undefined ? match : String(value)
  })
}
