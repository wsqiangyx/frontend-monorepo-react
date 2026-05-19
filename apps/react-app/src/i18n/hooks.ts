import { useContext } from 'react'
import { ReactI18nContext } from './context'

export function useI18n() {
  const context = useContext(ReactI18nContext)

  if (!context) {
    throw new Error('I18nProvider is required before useI18n().')
  }

  return context
}

export function useLocale() {
  const { locale, setLocale } = useI18n()

  return {
    locale,
    setLocale,
  }
}
