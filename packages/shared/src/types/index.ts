// ============================================================================
// @repo/shared — 平台类型重导出（向后兼容）
// ============================================================================
// 平台类型已收敛到 @repo/shared-utils，此处保留重导出以维持现有 import 路径。
// ============================================================================
export type {
  ApiResponse,
  PaginationParams,
  PaginatedData,
  PlatformError,
} from '@repo/shared-utils'

export { createPlatformError, isSuccessResponse, createPageResult } from '@repo/shared-utils'
