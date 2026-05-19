// ============================================================================
// @repo/shared-service — 平台版本契约
// ============================================================================
// 用于校验前后端接口版本是否匹配。
// 当后端接口发生不兼容变更时，前端可通过 version 字段检测并提示用户。
// ============================================================================

export interface PlatformContract {
  version: string
}

export function createContract(version: string): PlatformContract {
  return { version }
}
