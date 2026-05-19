// ============================================================================
// @repo/shared-ui 入口 — React 共享 UI 组件
// ============================================================================
// 本包提供基于 Ant Design 5 二次封装的 React 组件，遵循三层封装模式：
//   直接透传  — Props 与 Ant Design 完全一致（如 Button）
//   Props 重组 — 注入平台语义（如 SidebarMenu 接收 MenuItem[] 自动过滤权限）
//   组合封装  — 多个 Ant Design 组件组装（如 PageContainer = Layout + Title + 样式）
//
// 所有组件样式通过 design-tokens CSS 变量和 ConfigProvider 主题控制，
// 禁止在组件内硬编码颜色、字号等视觉属性。
// ============================================================================

export { ThemeProvider, useThemeSnapshot } from './provider'
export { useThemeMode } from './hooks'
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
