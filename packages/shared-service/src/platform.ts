// ============================================================================
// @repo/shared-service — 平台契约与运行时标识
// ============================================================================
// 合并原 contracts/ 和 runtime/ 子模块（ADR-011 扁平化）。
// ============================================================================

// --- 平台版本契约 ---
// 用于校验前后端接口版本是否匹配。
// 当后端接口发生不兼容变更时，前端可通过 version 字段检测并提示用户。

export interface PlatformContract {
  version: string
}

export function createContract(version: string): PlatformContract {
  return { version }
}

// --- 运行时环境标识 ---
// 提供平台运行时环境类型，供条件逻辑（如 Mock 启用、日志级别）使用。
// 默认为 development，宿主应用在初始化时传入实际值。

export interface PlatformRuntime {
  mode: 'development' | 'production' | 'test'
}

export function createRuntime(mode: PlatformRuntime['mode'] = 'development'): PlatformRuntime {
  return { mode }
}
