// ============================================================================
// @repo/shared-ui 入口 — React 共享 UI 组件
// ============================================================================
// 本包提供两类组件：
//   1. .repo-* 封装组件 — 基于 design-tokens CSS 变量的自定义业务组件
//   2. shadcn/ui 组件 — 基于 Radix UI + Tailwind CSS 的标准 UI 原子组件
//
// shadcn/ui 组件放在 components/ui/ 目录，通过 cn() + cva + CSS 变量实现主题联动。
// 两类组件共存互不冲突，各自遵循其设计规范。
// ============================================================================

export { ThemeProvider, useThemeSnapshot } from './provider'
export { useThemeMode, useToast } from './hooks'
export { cn } from './lib/utils'
export {
  AppShell,
  DataPanel,
  EmptyState,
  FilterBar,
  MetricCard,
  PageHeader,
  StatusTag,
  ThemeModeSwitch,
  AdminShell,
  TopNav,
  SideMenu,
  AppBreadcrumb,
  TabWorkspace,
  PageContainer,
  PermissionGate,
  ExceptionState,
} from './components'

// shadcn/ui components — re-exported from components/ui barrel
export * from './components/ui'
