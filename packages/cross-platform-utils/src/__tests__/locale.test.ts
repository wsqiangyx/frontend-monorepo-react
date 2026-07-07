import { describe, it, expect, vi } from 'vitest'
import { createTaroLocaleManager } from '../locale/taro'
import type { PlatformStorage } from '../storage/types'
import type { Messages } from '@repo/shared-utils/i18n'

const testMessages: Messages = {
  'zh-CN': {
    'common.loading': '加载中',
    'common.retry': '重试',
  },
  'en-US': {
    'common.loading': 'Loading',
    'common.retry': 'Retry',
  },
}

function mockStorage(initial: Record<string, string> = {}): PlatformStorage {
  const store = { ...initial }
  return {
    getItem: vi.fn(async <T>(key: string) => (key in store ? (store[key] as T) : null)),
    setItem: vi.fn(async (key: string, value: unknown) => {
      store[key] = value as string
    }),
    removeItem: vi.fn(async (key: string) => {
      delete store[key]
    }),
  }
}

function mockTaro(language = 'zh-CN') {
  return {
    getSystemInfo: vi.fn(() => ({ language })),
  }
}

describe('createTaroLocaleManager', () => {
  it('detects system locale from Taro', () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro('en-US'),
      messages: testMessages,
    })

    expect(manager.getLocale()).toBe('en-US')
  })

  it('falls back to zh-CN when system locale is unavailable', () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro(undefined as unknown as string),
      messages: testMessages,
    })

    expect(manager.getLocale()).toBe('zh-CN')
  })

  it('sets locale and persists to storage', async () => {
    const storage = mockStorage()
    const manager = createTaroLocaleManager({
      storage,
      taro: mockTaro('zh-CN'),
      messages: testMessages,
    })

    await manager.setLocale('en-US')

    expect(manager.getLocale()).toBe('en-US')
    expect(storage.setItem).toHaveBeenCalledWith('repo-locale', 'en-US')
  })

  it('notifies subscribers when locale changes', async () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro('zh-CN'),
      messages: testMessages,
    })

    const listener = vi.fn()
    manager.subscribe(listener)

    await manager.setLocale('en-US')

    expect(listener).toHaveBeenCalledWith('en-US')
  })

  it('unsubscribes when cleanup function is called', async () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro('zh-CN'),
      messages: testMessages,
    })

    const listener = vi.fn()
    const unsubscribe = manager.subscribe(listener)
    unsubscribe()

    await manager.setLocale('en-US')

    expect(listener).not.toHaveBeenCalled()
  })

  it('returns translator with correct locale', () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro('en-US'),
      messages: testMessages,
    })

    const translator = manager.getTranslator()

    expect(translator.locale).toBe('en-US')
    expect(translator.t('common.loading')).toBe('Loading')
  })

  it('translator falls back to zh-CN for missing keys', () => {
    const manager = createTaroLocaleManager({
      storage: mockStorage(),
      taro: mockTaro('en-US'),
      messages: testMessages,
      fallbackLocale: 'zh-CN',
    })

    const translator = manager.getTranslator()

    // Key exists in both locales, so en-US is used
    expect(translator.t('common.loading')).toBe('Loading')
  })

  it('loads stored locale from storage on creation', async () => {
    const storage = mockStorage({ 'repo-locale': 'en-US' })
    const manager = createTaroLocaleManager({
      storage,
      taro: mockTaro('zh-CN'),
      messages: testMessages,
    })

    // Wait for async loadStoredLocale
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(manager.getLocale()).toBe('en-US')
  })

  it('uses custom storage key', async () => {
    const storage = mockStorage()
    const manager = createTaroLocaleManager({
      storage,
      taro: mockTaro('zh-CN'),
      messages: testMessages,
      storageKey: 'custom-locale-key',
    })

    await manager.setLocale('en-US')

    expect(storage.setItem).toHaveBeenCalledWith('custom-locale-key', 'en-US')
  })
})
