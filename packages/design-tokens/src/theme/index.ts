// ============================================================================
// @repo/design-tokens — 主题系统统一导出
// ============================================================================
// 主题系统分层：
//   types.ts    — ThemeSnapshot、ThemeDefinition 等类型定义
//   registry.ts — 主题注册表（resolveTheme、themeRegistry）
//   system.ts   — 运行时主题管理（检测系统偏好、持久化、DOM 注入）
//   tailwind.ts — Tailwind CSS 主题适配（createTailwindPreset）
//
// 应用启动时调用 applyThemeToDocument 将 CSS 变量注入 <style>，
// 子组件通过 ThemeProvider（shared-ui）消费 ThemeSnapshot。
// ============================================================================

export type { ThemeMode, ThemeName } from '@repo/shared-types/ui-contract'
export type { ThemeDefinition, ThemeRegistry, ThemeSnapshot } from './types'
export { isThemeMode, isThemeName, resolveTheme, themeRegistry } from './registry'
export type { ThemePreference, ThemeRuntimeState } from './system'
export {
  applyThemeToDocument,
  createThemeRuntimeState,
  detectSystemThemeMode,
  getThemeInitScript,
  getStoredThemePreference,
  isThemePreference,
  resolveInitialThemeMode,
  resolveThemeMode,
  setStoredThemePreference,
  subscribeToSystemThemeChange,
} from './system'
export { createTailwindPreset } from './tailwind'
