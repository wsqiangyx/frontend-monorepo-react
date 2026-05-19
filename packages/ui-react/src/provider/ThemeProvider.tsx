import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { ConfigProvider, theme as antdThemeAlgorithms } from 'antd'
import {
  applyThemeToDocument,
  resolveTheme,
  type ThemeMode,
  type ThemeName,
  type ThemePreference,
  type ThemeSnapshot,
} from '@repo/design-tokens/theme'
import { createAntdTheme } from '@repo/design-tokens/theme/antd'

const ThemeContext = createContext<ThemeSnapshot | null>(null)

export interface ThemeProviderProps {
  themeName: ThemeName
  mode: ThemeMode
  preference?: ThemePreference
  children: ReactNode
}

export function ThemeProvider({ themeName, mode, preference, children }: ThemeProviderProps) {
  const snapshot = useMemo(() => resolveTheme(themeName, mode), [mode, themeName])
  const antdTheme = useMemo(
    () => ({
      ...createAntdTheme(snapshot),
      algorithm:
        mode === 'dark' ? antdThemeAlgorithms.darkAlgorithm : antdThemeAlgorithms.defaultAlgorithm,
    }),
    [mode, snapshot],
  )

  useEffect(() => {
    applyThemeToDocument({
      themeName,
      preference: preference ?? mode,
      resolvedMode: mode,
    })
  }, [mode, preference, themeName])

  return (
    <ThemeContext.Provider value={snapshot}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useThemeSnapshot() {
  const snapshot = useContext(ThemeContext)

  if (!snapshot) {
    throw new Error('ThemeProvider is required before useThemeSnapshot().')
  }

  return snapshot
}
