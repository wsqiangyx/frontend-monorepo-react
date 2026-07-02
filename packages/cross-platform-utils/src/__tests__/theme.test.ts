import { describe, it, expect, vi } from 'vitest'
import { createTaroThemeRuntime } from '../theme/taro'
import type { PlatformStorage } from '../storage/types'

function mockTaroTheme() {
  return {
    getSystemInfo: vi.fn(() => ({ theme: 'light' })),
    onThemeChange: vi.fn(() => () => {}),
    setNavigationBarColor: vi.fn(async () => {}),
    setBackgroundColor: vi.fn(async () => {}),
  }
}

function mockStorage(): PlatformStorage {
  return {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => {}),
    removeItem: vi.fn(async () => {}),
  }
}

describe('createTaroThemeRuntime', () => {
  it('initializes with default preference and system mode', () => {
    const taro = mockTaroTheme()
    const storage = mockStorage()
    const runtime = createTaroThemeRuntime({
      storage,
      taro: taro as unknown as Parameters<typeof createTaroThemeRuntime>[0]['taro'],
    })

    const state = runtime.getState()
    expect(state.preference).toBe('system')
    expect(state.resolvedMode).toBe('light')
  })

  it('changes preference and resolves mode', () => {
    const taro = mockTaroTheme()
    const storage = mockStorage()
    const runtime = createTaroThemeRuntime({
      storage,
      taro: taro as unknown as Parameters<typeof createTaroThemeRuntime>[0]['taro'],
    })

    runtime.setPreference('dark')
    const state = runtime.getState()
    expect(state.preference).toBe('dark')
    expect(state.resolvedMode).toBe('dark')
  })

  it('notifies subscribers on state change', () => {
    const taro = mockTaroTheme()
    const storage = mockStorage()
    const runtime = createTaroThemeRuntime({
      storage,
      taro: taro as unknown as Parameters<typeof createTaroThemeRuntime>[0]['taro'],
    })
    const listener = vi.fn()

    runtime.subscribe(listener)
    runtime.setPreference('light')
    expect(listener).toHaveBeenCalled()
  })

  it('calls Taro APIs on apply', () => {
    const taro = mockTaroTheme()
    const storage = mockStorage()
    const runtime = createTaroThemeRuntime({
      storage,
      taro: taro as unknown as Parameters<typeof createTaroThemeRuntime>[0]['taro'],
    })

    runtime.apply()
    expect(taro.setBackgroundColor).toHaveBeenCalled()
    expect(taro.setNavigationBarColor).toHaveBeenCalled()
  })
})
