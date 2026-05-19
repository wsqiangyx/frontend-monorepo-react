import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { createTranslator } from '@repo/shared/i18n'
import { ReactI18nContext } from './context'
import { reactAppI18nMessages } from './messages'
import { useLocaleStore } from '@/stores/locale'

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)

  const translator = useMemo(
    () =>
      createTranslator({
        locale,
        messages: reactAppI18nMessages,
      }),
    [locale],
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translator.t,
    }),
    [locale, setLocale, translator.t],
  )

  return <ReactI18nContext.Provider value={value}>{children}</ReactI18nContext.Provider>
}
