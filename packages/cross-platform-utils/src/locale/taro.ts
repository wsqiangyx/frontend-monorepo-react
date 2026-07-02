import type { Locale, Translator, Messages } from '@repo/shared-utils/i18n'
import { normalizeLocale, createTranslator } from '@repo/shared-utils/i18n'
import type { PlatformLocaleManager } from './types'
import type { PlatformStorage } from '../storage/types'

interface TaroLocaleApi {
  getSystemInfo(): { language?: string }
}

interface TaroLocaleManagerOptions {
  storage: PlatformStorage
  taro: TaroLocaleApi
  messages: Messages
  fallbackLocale?: Locale
  storageKey?: string
}

const DEFAULT_STORAGE_KEY = 'repo-locale'

export function createTaroLocaleManager(options: TaroLocaleManagerOptions): PlatformLocaleManager {
  const {
    storage,
    taro,
    messages,
    fallbackLocale = 'zh-CN',
    storageKey = DEFAULT_STORAGE_KEY,
  } = options

  let currentLocale: Locale = detectTaroLocale()
  const listeners = new Set<(locale: Locale) => void>()

  function detectTaroLocale(): Locale {
    try {
      const info = taro.getSystemInfo()
      return normalizeLocale(info.language ?? null)
    } catch {
      return fallbackLocale
    }
  }

  async function loadStoredLocale(): Promise<void> {
    const stored = await storage.getItem<string>(storageKey)
    if (stored === 'zh-CN' || stored === 'en-US') {
      currentLocale = stored as Locale
      notify()
    }
  }

  function notify(): void {
    for (const listener of listeners) {
      listener(currentLocale)
    }
  }

  loadStoredLocale()

  return {
    getLocale(): Locale {
      return currentLocale
    },
    async setLocale(locale: Locale): Promise<void> {
      currentLocale = locale
      await storage.setItem(storageKey, locale)
      notify()
    },
    getTranslator(): Translator {
      return createTranslator({ locale: currentLocale, fallbackLocale, messages })
    },
    subscribe(listener: (locale: Locale) => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
