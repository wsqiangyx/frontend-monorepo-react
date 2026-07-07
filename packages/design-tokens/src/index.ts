// ============================================================================
// @repo/design-tokens 入口 — 桶导出（barrel export）
// ============================================================================
// 统一从单一入口导出 tokens，降低 app 和 package 的接入成本。
// 模块结构：
//   11 个 token 模块：colors、spacing、typography、breakpoints、shadows、radius、
//   motion、zIndex、opacity、transitions、to-css
//   shadcn 桥接：shadcn-bridge
//   主题适配器：theme/tailwind（react-app 用）
// 应用按需引入子路径（如 @repo/design-tokens/css）而非全量导入。
// ============================================================================
export * from './colors'
export * from './spacing'
export * from './typography'
export * from './breakpoints'
export * from './shadows'
export * from './radius'
export * from './motion'
export * from './zIndex'
export * from './opacity'
export * from './transitions'
export * from './to-css'
export * from './shadcn-bridge'
export * from './theme/tailwind'
