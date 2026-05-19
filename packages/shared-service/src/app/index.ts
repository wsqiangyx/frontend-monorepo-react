// ============================================================================
// @repo/shared-service — 应用启动状态机
// ============================================================================
// 描述应用启动过程的状态转换：
//   idle → bootstrapping → ready
//                        → error
//
// 宿主应用在 main.tsx 启动时将状态设为 bootstrapping，
// 完成 MSW 初始化、主题注入、i18n 加载后设为 ready。
// 任何阶段出错则设为 error，由 ErrorBoundary 兜底。
// ============================================================================

export type AppBootStatus = 'idle' | 'bootstrapping' | 'ready' | 'error'

export interface AppState {
  status: AppBootStatus
  error?: unknown
}

export function createAppState(overrides?: Partial<AppState>): AppState {
  return { status: 'idle', ...overrides }
}

export function isBootReady(state: AppState): boolean {
  return state.status === 'ready'
}

export function isBootError(state: AppState): boolean {
  return state.status === 'error'
}
