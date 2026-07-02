import type { ThemeMode, ThemeName } from '@repo/shared-utils/ui-contract'

export type ThemePreference = ThemeMode | 'system'

export interface ThemeRuntimeState {
  themeName: ThemeName
  preference: ThemePreference
  resolvedMode: ThemeMode
}

export interface PlatformThemeRuntime {
  getState(): ThemeRuntimeState
  setPreference(preference: ThemePreference): void
  subscribe(listener: (state: ThemeRuntimeState) => void): () => void
  apply(): void
}
