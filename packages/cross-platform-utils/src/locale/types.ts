import type { Locale, Translator } from '@repo/shared-utils/i18n'

export interface PlatformLocaleManager {
  getLocale(): Locale
  setLocale(locale: Locale): Promise<void>
  getTranslator(): Translator
  subscribe(listener: (locale: Locale) => void): () => void
}
