import { describe, it, expect, vi } from 'vitest'
import { createTaroStorage } from '../storage/taro'

function mockTaro() {
  const store: Record<string, unknown> = {}
  return {
    getStorage: vi.fn(async <T>({ key }: { key: string }) => {
      if (key in store) return { data: store[key] as T }
      throw new Error('key not found')
    }),
    setStorage: vi.fn(async ({ key, data }: { key: string; data: unknown }) => {
      store[key] = data
    }),
    removeStorage: vi.fn(async ({ key }: { key: string }) => {
      delete store[key]
    }),
  }
}

describe('createTaroStorage', () => {
  it('returns null for missing keys', async () => {
    const taro = mockTaro()
    const storage = createTaroStorage(taro)
    const result = await storage.getItem('missing')
    expect(result).toBeNull()
  })

  it('stores and retrieves values', async () => {
    const taro = mockTaro()
    const storage = createTaroStorage(taro)
    await storage.setItem('key', 'value')
    const result = await storage.getItem('key')
    expect(result).toBe('value')
  })

  it('removes stored values', async () => {
    const taro = mockTaro()
    const storage = createTaroStorage(taro)
    await storage.setItem('key', 'value')
    await storage.removeItem('key')
    const result = await storage.getItem('key')
    expect(result).toBeNull()
  })

  it('ignores removal errors for non-existent keys', async () => {
    const taro = mockTaro()
    taro.removeStorage.mockRejectedValue(new Error('not found'))
    const storage = createTaroStorage(taro)
    await storage.removeItem('missing')
    expect(taro.removeStorage).toHaveBeenCalled()
  })
})
