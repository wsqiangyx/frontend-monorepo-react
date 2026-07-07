import type { ThemeName, ThemeMode } from '@repo/shared-utils/ui-contract'
import type { ThemePreference, ThemeRuntimeState, ThemeResolver } from '@repo/shared-utils/theme'
import { resolveThemeMode } from '@repo/shared-utils/theme'
import type { PlatformStorage } from '../storage/types'
import type { PlatformThemeRuntime } from './types'

interface TaroThemeApi {
  getSystemInfo(): { theme?: string }
  onThemeChange(callback: (result: { theme: string }) => void): () => void
  setNavigationBarColor(options: { frontColor: string; backgroundColor: string }): Promise<void>
  setBackgroundColor(options: { backgroundColor: string }): Promise<void>
}

interface TaroThemeRuntimeOptions {
  storage: PlatformStorage
  taro: TaroThemeApi
  resolveTheme: ThemeResolver
  defaultPreference?: ThemePreference
  themeName?: ThemeName
  storageKey?: string
}

const DEFAULT_THEME_NAME: ThemeName = 'default'
const DEFAULT_PREFERENCE: ThemePreference = 'system'
const DEFAULT_STORAGE_KEY = 'repo-theme-preference'

function detectTaroSystemMode(taro: TaroThemeApi): ThemeMode {
  try {
    const info = taro.getSystemInfo()
    return info.theme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function createTaroThemeRuntime(options: TaroThemeRuntimeOptions): PlatformThemeRuntime {
  const {
    storage,
    taro,
    resolveTheme,
    themeName = DEFAULT_THEME_NAME,
    defaultPreference = DEFAULT_PREFERENCE,
    storageKey = DEFAULT_STORAGE_KEY,
  } = options

  let state: ThemeRuntimeState = {
    themeName,
    preference: defaultPreference,
    resolvedMode: resolveThemeMode(defaultPreference, detectTaroSystemMode(taro)),
  }

  const listeners = new Set<(state: ThemeRuntimeState) => void>()

  async function loadPreference(): Promise<void> {
    const stored = await storage.getItem<string>(storageKey)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      state = {
        ...state,
        preference: stored as ThemePreference,
        resolvedMode: resolveThemeMode(stored as ThemePreference, detectTaroSystemMode(taro)),
      }
      notify()
    }
  }

  function notify(): void {
    for (const listener of listeners) {
      listener(state)
    }
  }

  taro.onThemeChange((result) => {
    const systemMode = result.theme === 'dark' ? 'dark' : 'light'
    if (state.preference === 'system') {
      state = { ...state, resolvedMode: systemMode }
      notify()
    }
  })

  loadPreference()

  return {
    getState(): ThemeRuntimeState {
      return state
    },
    setPreference(preference: ThemePreference): void {
      state = {
        ...state,
        preference,
        resolvedMode: resolveThemeMode(preference, detectTaroSystemMode(taro)),
      }
      storage.setItem(storageKey, preference).catch(() => {})
      notify()
    },
    subscribe(listener: (state: ThemeRuntimeState) => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    apply(): void {
      const snapshot = resolveTheme(state.themeName, state.resolvedMode)
      const frontColor = state.resolvedMode === 'dark' ? '#ffffff' : '#000000'
      const backgroundColor = snapshot.colorBgPage

      try {
        taro.setBackgroundColor({ backgroundColor })
        taro.setNavigationBarColor({ frontColor, backgroundColor })
      } catch {
        // Platform may not support these APIs
      }
    },
  }
}
