import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearStoredLocale,
  createTranslator,
  detectBrowserLocale,
  mergeMessages,
  normalizeLocale,
  readStoredLocale,
  resolveInitialLocale,
  sharedMessages,
  writeStoredLocale,
  type Messages,
} from '../i18n'

function createMemoryStorage(seed: Record<string, string> = {}) {
  const store = new Map(Object.entries(seed))

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
}

describe('i18n runtime', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('normalizes supported locale inputs and falls back to zh-CN', () => {
    expect(normalizeLocale('zh')).toBe('zh-CN')
    expect(normalizeLocale('zh-Hans')).toBe('zh-CN')
    expect(normalizeLocale('en')).toBe('en-US')
    expect(normalizeLocale('en-GB')).toBe('en-US')
    expect(normalizeLocale('fr-FR')).toBe('zh-CN')
    expect(normalizeLocale(undefined)).toBe('zh-CN')
  })

  it('detects the first supported locale from navigator.languages', () => {
    vi.stubGlobal('navigator', {
      languages: ['fr-FR', 'en-GB'],
      language: 'zh-CN',
    })

    expect(detectBrowserLocale()).toBe('en-US')
  })

  it('reads and writes stored locale using exact supported locale values only', () => {
    const storage = createMemoryStorage({ 'repo-locale': 'en-US' })
    vi.stubGlobal('localStorage', storage)

    expect(readStoredLocale()).toBe('en-US')

    storage.setItem('repo-locale', 'en')
    expect(readStoredLocale()).toBeNull()

    writeStoredLocale('zh-CN')
    expect(storage.getItem('repo-locale')).toBe('zh-CN')

    clearStoredLocale()
    expect(storage.getItem('repo-locale')).toBeNull()
  })

  it('prefers stored locale over browser locale during initialization', () => {
    vi.stubGlobal('localStorage', createMemoryStorage({ 'repo-locale': 'en-US' }))
    vi.stubGlobal('navigator', {
      languages: ['zh-CN'],
      language: 'zh-CN',
    })

    expect(resolveInitialLocale()).toBe('en-US')
  })

  it('falls back to zh-CN messages and finally the key itself', () => {
    const messages: Messages = mergeMessages(sharedMessages, {
      'zh-CN': {
        'demo.greeting': '你好',
      },
      'en-US': {},
    })

    const translator = createTranslator({
      locale: 'en-US',
      messages,
    })

    expect(translator.t('demo.greeting')).toBe('你好')
    expect(translator.t('demo.missing')).toBe('demo.missing')
  })
})
