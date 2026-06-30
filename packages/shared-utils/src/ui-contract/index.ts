// ============================================================================
// @repo/shared-utils — UI 层类型契约
// ============================================================================
// 跨包共享的 UI 类型契约，被 design-tokens、shared-ui、react-app 消费。
// 零运行时依赖，纯类型与常量导出。
// ============================================================================

export type ThemeName = 'default'

export const themeNameValues = ['default'] as const satisfies readonly ThemeName[]

export type ThemeMode = 'light' | 'dark'

export const themeModeValues = ['light', 'dark'] as const satisfies readonly ThemeMode[]

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export const statusToneValues = [
  'success',
  'warning',
  'error',
  'info',
  'neutral',
] as const satisfies readonly StatusTone[]

export type MetricTrend = 'up' | 'down' | 'flat'

export const metricTrendValues = ['up', 'down', 'flat'] as const satisfies readonly MetricTrend[]

export type ContentMaxWidth = 'fluid' | 'xl'

export const contentMaxWidthValues = ['fluid', 'xl'] as const satisfies readonly ContentMaxWidth[]

export interface ThemeModeSwitchCopy {
  label: string
  systemText: string
  lightText: string
  darkText: string
  ariaLabel?: string
}

export interface DataPanelCopy {
  loadingText?: string
}
