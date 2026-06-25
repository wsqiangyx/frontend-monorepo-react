// ============================================================================
// @repo/shared-ui — 主题 Provider
// ============================================================================
// 将 design-tokens 的主题系统接入 React 组件树。
//
// 职责：
//   1. 通过 ThemeContext 向子组件提供 ThemeSnapshot（当前主题快照）
//   2. 监听 themeName/mode 变化，调用 applyThemeToDocument 更新 CSS 变量
//   3. 同步 Tailwind darkMode class 到 <html> 元素
//
// 使用方式：
//   <ThemeProvider themeName="default" mode="light">
//     <App />
//   </ThemeProvider>
//
// 子组件通过 useThemeSnapshot() 获取当前主题快照。
// ============================================================================

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo } from 'react'
import {
  applyThemeToDocument,
  resolveTheme,
  type ThemeMode,
  type ThemeName,
  type ThemePreference,
  type ThemeSnapshot,
} from '@repo/design-tokens/theme'

const ThemeContext = createContext<ThemeSnapshot | null>(null)

export interface ThemeProviderProps {
  themeName: ThemeName
  mode: ThemeMode
  preference?: ThemePreference
  children: ReactNode
}

export function ThemeProvider({ themeName, mode, preference, children }: ThemeProviderProps) {
  const snapshot = useMemo(() => resolveTheme(themeName, mode), [mode, themeName])

  useEffect(() => {
    applyThemeToDocument({
      themeName,
      preference: preference ?? mode,
      resolvedMode: mode,
    })
  }, [mode, preference, themeName])

  useEffect(() => {
    // 同步 Tailwind darkMode class 到 <html> 元素
    const html = document.documentElement
    if (mode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [mode])

  return <ThemeContext.Provider value={snapshot}>{children}</ThemeContext.Provider>
}

export function useThemeSnapshot() {
  const snapshot = useContext(ThemeContext)

  if (!snapshot) {
    throw new Error('ThemeProvider is required before useThemeSnapshot().')
  }

  return snapshot
}
