import { type ThemeMode, type ThemeName } from '@repo/shared-utils/ui-contract'
import type { ThemeRegistry, ThemeSnapshot } from './types'
import { defaultLightTheme } from './types'
import { deriveDarkFromLight } from './derive-dark'
import { compactLightTheme } from './compact'

const defaultThemeName: ThemeName = 'default'
const defaultThemeMode: ThemeMode = 'light'

/** Backward-compatible export: dark theme derived from default light theme */
export const defaultDarkTheme = deriveDarkFromLight(defaultLightTheme)

export const themeRegistry: ThemeRegistry = {
  default: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  compact: {
    light: compactLightTheme,
    dark: deriveDarkFromLight(compactLightTheme),
  },
}

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && value in themeRegistry
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

export function resolveTheme(themeName: unknown, mode: unknown): ThemeSnapshot {
  const safeThemeName = isThemeName(themeName) ? themeName : defaultThemeName
  const safeMode = isThemeMode(mode) ? mode : defaultThemeMode
  const definition = themeRegistry[safeThemeName] ?? themeRegistry[defaultThemeName]

  return definition[safeMode] ?? themeRegistry[defaultThemeName][defaultThemeMode]
}
