// ============================================================================
// @repo/shared-service — 请求/响应契约
// ============================================================================
// 平台类型直接从 @repo/shared-utils 获取，不经由兼容层 @repo/shared。
// ============================================================================
export type {
  ApiResponse as PlatformApiResponse,
  PaginatedData as PlatformPageResult,
  PlatformError,
} from '@repo/shared-utils'

export { createPlatformError, isSuccessResponse, createPageResult } from '@repo/shared-utils'
