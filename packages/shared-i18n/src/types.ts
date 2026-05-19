export type Locale = 'zh-CN' | 'en-US'

export type MessageKey = string

export type LocaleMessages = Record<MessageKey, string>

export type Messages = Record<Locale, LocaleMessages>

export interface Translator {
  locale: Locale
  fallbackLocale: Locale
  t: (key: MessageKey) => string
}
