// ============================================================================
// @repo/mock 入口 — 统一导出 mock 能力
// ============================================================================
// 统一导出 mock 能力，保证浏览器和 Node 侧使用同一套公开入口。
// 消费者可以选择：
//   - 全量导入：import { worker, server, handlers } from '@repo/mock'
//   - 按需导入：import { worker } from '@repo/mock/browser'
// ============================================================================
export { worker } from './browser'
export { server } from './server'
export { handlers } from './handlers'
export { shouldPassthrough, resetPassthroughCache } from './passthrough'
