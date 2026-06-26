// ============================================================================
// @repo/shared-utils — 共享 API 响应类型（re-export from shared-types）
// ============================================================================
// 类型定义的唯一源头在 @repo/shared-types/api-contract，
// 此处 re-export 以保持向后兼容。
// ============================================================================

export type {
  ApiResponse,
  PaginationParams,
  PaginatedData,
  PlatformError,
} from '@repo/shared-types/api-contract'

export {
  createPlatformError,
  isSuccessResponse,
  createPageResult,
} from '@repo/shared-types/api-contract'
