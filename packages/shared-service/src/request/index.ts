// ============================================================================
// @repo/shared-service — 请求/响应契约
// ============================================================================
// 平台类型直接从 @repo/shared-utils/api-contract 获取，类型定义的唯一源头。
// ============================================================================
export type {
  ApiResponse as PlatformApiResponse,
  PaginatedData as PlatformPageResult,
  PlatformError,
} from '@repo/shared-utils/api-contract'

export {
  createPlatformError,
  isSuccessResponse,
  createPageResult,
} from '@repo/shared-utils/api-contract'
