import type { PlatformStorage } from './types'

interface TaroStorageApi {
  getStorage<T>(options: { key: string }): Promise<{ data: T }>
  setStorage(options: { key: string; data: unknown }): Promise<void>
  removeStorage(options: { key: string }): Promise<void>
}

export function createTaroStorage(taro: TaroStorageApi): PlatformStorage {
  return {
    async getItem<T = string>(key: string): Promise<T | null> {
      try {
        const { data } = await taro.getStorage<T>({ key })
        return data ?? null
      } catch {
        return null
      }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
      await taro.setStorage({ key, data: value })
    },
    async removeItem(key: string): Promise<void> {
      try {
        await taro.removeStorage({ key })
      } catch {
        // Ignore removal failures for non-existent keys
      }
    },
  }
}
