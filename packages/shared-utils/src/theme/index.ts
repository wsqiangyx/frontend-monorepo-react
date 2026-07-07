import type { ThemeMode, ThemeName } from '../ui-contract'

export type ThemePreference = ThemeMode | 'system'

export interface ThemeRuntimeState {
  themeName: ThemeName
  preference: ThemePreference
  resolvedMode: ThemeMode
}

export interface ThemeResolver {
  (themeName: ThemeName, mode: ThemeMode): { colorBgPage: string }
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function resolveThemeMode(
  preference: ThemePreference,
  systemMode: ThemeMode = 'light',
): ThemeMode {
  if (preference === 'system') {
    return systemMode
  }

  return preference
}
