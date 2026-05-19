import { create } from 'zustand'
import {
  detectSystemThemeMode,
  createThemeRuntimeState,
  resolveThemeMode,
  setStoredThemePreference,
  subscribeToSystemThemeChange,
  type ThemePreference,
} from '@repo/design-tokens/theme'
import type { ThemeMode, ThemeName } from '@repo/shared/ui-contract'

const DEFAULT_THEME_NAME: ThemeName = 'default'

interface ThemeState {
  themeName: ThemeName
  preference: ThemePreference
  mode: ThemeMode
  setPreference: (preference: ThemePreference) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  startSystemSync: () => void
  stopSystemSync: () => void
  resetForTest: () => void
}

let stopSystemSyncHandler: (() => void) | null = null
const initialRuntimeState = createThemeRuntimeState({
  themeName: DEFAULT_THEME_NAME,
})

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeName: initialRuntimeState.themeName,
  preference: initialRuntimeState.preference,
  mode: initialRuntimeState.resolvedMode,
  setPreference: (nextPreference) => {
    get().stopSystemSync()

    const resolvedMode = resolveThemeMode(nextPreference, detectSystemThemeMode())

    set({
      preference: nextPreference,
      mode: resolvedMode,
    })

    setStoredThemePreference(nextPreference)

    if (nextPreference === 'system') {
      get().startSystemSync()
    }
  },
  setMode: (nextMode) => {
    get().setPreference(nextMode)
  },
  toggleMode: () => {
    get().setMode(get().mode === 'dark' ? 'light' : 'dark')
  },
  startSystemSync: () => {
    if (get().preference !== 'system' || stopSystemSyncHandler) {
      return
    }

    stopSystemSyncHandler = subscribeToSystemThemeChange((nextMode) => {
      if (get().preference !== 'system') {
        return
      }

      set({
        mode: resolveThemeMode('system', nextMode),
      })
    })
  },
  stopSystemSync: () => {
    stopSystemSyncHandler?.()
    stopSystemSyncHandler = null
  },
  resetForTest: () => {
    stopSystemSyncHandler?.()
    stopSystemSyncHandler = null

    const runtimeState = createThemeRuntimeState({
      themeName: DEFAULT_THEME_NAME,
    })

    set({
      themeName: runtimeState.themeName,
      preference: runtimeState.preference,
      mode: runtimeState.resolvedMode,
    })
  },
}))
