// ============================================================================
// @repo/design-tokens — 主题系统统一导出
// ============================================================================
// 主题系统分层：
//   types.ts       — ThemeSnapshot、ThemeDefinition 等类型定义
//   registry.ts    — 主题注册表（resolveTheme、themeRegistry）
//   derive-dark.ts — 暗色主题自动派生（deriveDarkFromLight）
//   compact.ts     — compact 主题变体
//   system.ts      — 运行时主题管理（检测系统偏好、持久化、DOM 注入）
//   tailwind.ts    — Tailwind CSS 主题适配（createTailwindPreset）
//
// 应用启动时调用 applyThemeToDocument 将 CSS 变量注入 <style>，
// 子组件通过 ThemeProvider（shared-ui）消费 ThemeSnapshot。
// ============================================================================

export type { ThemeMode, ThemeName } from '@repo/shared-utils/ui-contract'
export type { ThemePreference, ThemeRuntimeState, ThemeResolver } from '@repo/shared-utils/theme'
export { isThemePreference, resolveThemeMode } from '@repo/shared-utils/theme'
export type { ThemeDefinition, ThemeRegistry, ThemeSnapshot } from './types'
export { defaultDarkTheme, isThemeMode, isThemeName, resolveTheme, themeRegistry } from './registry'
export { deriveDarkFromLight } from './derive-dark'
export { compactLightTheme } from './compact'
export {
  applyThemeToDocument,
  createThemeRuntimeState,
  detectSystemThemeMode,
  getThemeInitScript,
  getStoredThemePreference,
  resolveInitialThemeMode,
  setStoredThemePreference,
  subscribeToSystemThemeChange,
} from './system'
export { createTailwindPreset } from './tailwind'
