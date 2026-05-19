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
