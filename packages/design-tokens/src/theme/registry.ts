import {
  themeModeValues,
  themeNameValues,
  type ThemeMode,
  type ThemeName,
} from '@repo/shared-types/ui-contract'
import {
  defaultDarkTheme,
  defaultLightTheme,
  type ThemeRegistry,
  type ThemeSnapshot,
} from './types'

const defaultThemeName: ThemeName = 'default'
const defaultThemeMode: ThemeMode = 'light'

export const themeRegistry: ThemeRegistry = {
  default: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
}

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && themeNameValues.includes(value as ThemeName)
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && themeModeValues.includes(value as ThemeMode)
}

export function resolveTheme(themeName: unknown, mode: unknown): ThemeSnapshot {
  const safeThemeName = isThemeName(themeName) ? themeName : defaultThemeName
  const safeMode = isThemeMode(mode) ? mode : defaultThemeMode
  const definition = themeRegistry[safeThemeName] ?? themeRegistry[defaultThemeName]

  return definition[safeMode] ?? themeRegistry[defaultThemeName][defaultThemeMode]
}
