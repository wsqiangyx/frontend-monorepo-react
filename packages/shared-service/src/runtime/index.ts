export interface PlatformRuntime {
  mode: 'development' | 'production' | 'test'
}

export function createRuntime(mode: PlatformRuntime['mode'] = 'development'): PlatformRuntime {
  return { mode }
}
