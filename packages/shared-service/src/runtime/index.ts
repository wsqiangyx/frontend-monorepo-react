// ============================================================================
// @repo/shared-service — 运行时环境标识
// ============================================================================
// 提供平台运行时环境类型，供条件逻辑（如 Mock 启用、日志级别）使用。
// 默认为 development，宿主应用在初始化时传入实际值。
// ============================================================================

export interface PlatformRuntime {
  mode: 'development' | 'production' | 'test'
}

export function createRuntime(mode: PlatformRuntime['mode'] = 'development'): PlatformRuntime {
  return { mode }
}
