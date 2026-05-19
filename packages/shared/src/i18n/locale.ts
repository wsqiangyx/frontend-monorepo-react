import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from './constants'
import type { Locale } from './types'

export function normalizeLocale(input: string | null | undefined): Locale {
  if (!input) {
    return DEFAULT_LOCALE
  }

  const normalized = input.toLowerCase()

  if (normalized.startsWith('zh')) {
    return 'zh-CN'
  }

  if (normalized.startsWith('en')) {
    return 'en-US'
  }

  return DEFAULT_LOCALE
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE
  }

  const candidates =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate)

    if (locale === 'zh-CN' || locale === 'en-US') {
      if (candidate?.toLowerCase().startsWith('zh') || candidate?.toLowerCase().startsWith('en')) {
        return locale
      }
    }
  }

  return DEFAULT_LOCALE
}

export function readStoredLocale(): Locale | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null
    }

    const value = localStorage.getItem(LOCALE_STORAGE_KEY)

    if (value === 'zh-CN' || value === 'en-US') {
      return value
    }
  } catch {
    return null
  }

  return null
}

export function writeStoredLocale(locale: Locale): void {
  try {
    if (typeof localStorage === 'undefined') {
      return
    }

    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Ignore storage write failures and keep runtime usable.
  }
}

export function clearStoredLocale(): void {
  try {
    if (typeof localStorage === 'undefined') {
      return
    }

    localStorage.removeItem(LOCALE_STORAGE_KEY)
  } catch {
    // Ignore storage cleanup failures and keep runtime usable.
  }
}

export function resolveInitialLocale(): Locale {
  return readStoredLocale() ?? detectBrowserLocale()
}
