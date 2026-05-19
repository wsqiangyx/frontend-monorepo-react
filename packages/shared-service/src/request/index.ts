// ============================================================================
// @repo/shared-service — 请求/响应契约
// ============================================================================
// 类型从 @repo/shared 统一导出，本模块提供向后兼容别名。
// ============================================================================
export type {
  ApiResponse as PlatformApiResponse,
  PaginatedData as PlatformPageResult,
  PlatformError,
} from '@repo/shared'

export { createPlatformError, isSuccessResponse, createPageResult } from '@repo/shared'
