import { FALLBACK_LOCALE } from './constants'
import type { Locale, Messages, Translator } from './types'

export function createTranslator(options: {
  locale: Locale
  fallbackLocale?: Locale
  messages: Messages
}): Translator {
  const fallbackLocale = options.fallbackLocale ?? FALLBACK_LOCALE

  return {
    locale: options.locale,
    fallbackLocale,
    t(key) {
      return options.messages[options.locale][key] ?? options.messages[fallbackLocale][key] ?? key
    },
  }
}
