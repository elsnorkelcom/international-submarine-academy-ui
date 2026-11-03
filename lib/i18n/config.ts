/**
 * Configuración mínima de internacionalización.
 *
 * `en` es el idioma base de los diccionarios. `es` es el idioma visible
 * temporal de la Home mientras se completa la migración de la interfaz.
 * Este valor no define todavía rutas ni un selector de idioma.
 */
export const SUPPORTED_LOCALES = ['en', 'es'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const TRANSLATION_BASE_LOCALE: Locale = 'en'

/** Carácter temporal: la Home sigue mostrándose en español. */
export const TEMPORARY_VISIBLE_HOME_LOCALE: Locale = 'es'
