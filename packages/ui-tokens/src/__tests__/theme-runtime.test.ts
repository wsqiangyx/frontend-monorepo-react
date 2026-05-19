// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
// @ts-expect-error Test-only parity check against the root theme-init generator.
import { getThemeInitScript as getThemeInitScriptSource } from '../../../../scripts/write-theme-init.mjs'
import {
  applyThemeToDocument,
  createThemeRuntimeState,
  getStoredThemePreference,
  getThemeInitScript,
  resolveThemeMode,
} from '../theme/system'

function createMediaQueryList(matches: boolean) {
  return {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

describe('theme runtime', () => {
  it('resolves system preference into a concrete mode', () => {
    expect(resolveThemeMode('system', 'dark')).toBe('dark')
    expect(resolveThemeMode('system', 'light')).toBe('light')
    expect(resolveThemeMode('dark', 'light')).toBe('dark')
  })

  it('reads stored theme preference and ignores invalid values', () => {
    const storage = {
      getItem: vi.fn<(key: string) => string | null>((key: string) =>
        key === 'repo-theme-preference' ? 'system' : null,
      ),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }

    vi.stubGlobal('localStorage', storage)

    expect(getStoredThemePreference()).toBe('system')

    storage.getItem = vi.fn<(key: string) => string | null>(() => 'invalid')

    expect(getStoredThemePreference()).toBeNull()
  })

  it('creates a runtime state from preference, storage and system mode', () => {
    const storage = {
      getItem: vi.fn<(key: string) => string | null>((key: string) =>
        key === 'repo-theme-preference' ? 'system' : null,
      ),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }

    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('window', {
      matchMedia: vi.fn(() => createMediaQueryList(true)),
    })

    expect(
      createThemeRuntimeState({
        defaultPreference: 'light',
      }),
    ).toEqual({
      preference: 'system',
      resolvedMode: 'dark',
      themeName: 'default',
    })
  })

  it('applies theme snapshot and root metadata to the document before mount', () => {
    document.head.innerHTML = ''
    document.documentElement.removeAttribute('data-theme-name')
    document.documentElement.removeAttribute('data-theme-mode')
    document.documentElement.classList.remove('dark')

    applyThemeToDocument({
      themeName: 'default',
      preference: 'system',
      resolvedMode: 'dark',
    })

    expect(document.documentElement.dataset.themeName).toBe('default')
    expect(document.documentElement.dataset.themeMode).toBe('dark')
    expect(document.documentElement.dataset.themePreference).toBe('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.getElementById('repo-theme-style')?.textContent).toContain(
      '--theme-color-bg-page: #141414;',
    )
  })

  it('exposes a serializable theme init script for html pre-injection', () => {
    const script = getThemeInitScript()

    expect(getThemeInitScriptSource()).toBe(script)
    expect(script).toContain('repo-theme-preference')
    expect(script).toContain('dataset.themePreference')
    expect(script).toContain('prefers-color-scheme: dark')
  })
})
