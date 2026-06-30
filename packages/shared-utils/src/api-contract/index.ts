// ============================================================================
// @repo/shared-utils — API 响应契约
// ============================================================================
// 跨包共享的 API 响应类型契约，被 shared-service 消费。
// ============================================================================

/**
 * 标准 API 响应包装。平台接口统一返回此格式。
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  data: T
  message: string
  requestId?: string
  timestamp: string
}

/**
 * 分页查询参数。
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页数据响应。
 */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 平台业务错误。
 */
export interface PlatformError {
  code: string
  message: string
  details?: unknown
}

export function createPlatformError(
  code: string,
  message: string,
  details?: unknown,
): PlatformError {
  return { code, message, details }
}

export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.success
}

export function createPageResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedData<T> {
  return { items, total, page, pageSize }
}
