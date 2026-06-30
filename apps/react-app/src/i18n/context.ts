import { createContext } from 'react'
import type { Locale } from '@repo/shared-utils/i18n'

export interface ReactI18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const ReactI18nContext = createContext<ReactI18nContextValue | null>(null)
