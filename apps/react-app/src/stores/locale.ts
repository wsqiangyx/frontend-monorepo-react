import { create } from 'zustand'
import { resolveInitialLocale, writeStoredLocale, type Locale } from '@repo/shared-utils/i18n'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  resetForTest: () => void
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: resolveInitialLocale(),
  setLocale: (locale) => {
    set({ locale })
    writeStoredLocale(locale)
  },
  resetForTest: () => {
    set({ locale: resolveInitialLocale() })
  },
}))
