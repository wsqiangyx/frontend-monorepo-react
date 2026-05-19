// ============================================================================
// @repo/shared — 共享类型定义
// ============================================================================
// 共享类型保持与框架无关，避免 app 在类型层产生额外耦合。
// @repo/mock 的 handler 返回值也遵循 ApiResponse<T>，确保前后端契约一致。
// ============================================================================

/**
 * 标准 API 响应包装。平台接口统一返回此格式。
 * - success: 是否成功
 * - code: 平台业务状态码，成功时通常为 'OK'
 * - data: 响应数据，泛型参数 T 指定具体类型
 * - message: 人类可读的提示信息
 *
 * @repo/mock 的 handler 使用此类型构造 mock 响应，
 * @repo/react-app 的 API 层通过此类型解析响应。
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
 * 分页查询参数。与后端分页接口的请求参数对应。
 * - page: 当前页码（从 1 开始）
 * - pageSize: 每页条数
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页数据响应。后端分页接口的 data 字段使用此类型。
 * - items: 当前页的数据列表
 * - total: 总记录数（用于计算总页数）
 * - page / pageSize: 回传当前分页参数，方便前端使用
 */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 平台业务错误。适用于非网络层面的业务逻辑错误。
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

// --- 可视化大屏设计器类型 ---
export * from './screen'
export * from './route'
export * from './node'
export * from './data-source'
export * from './permission'
export * from './share'
export * from './data-binding'
export * from './component-registry'
export * from './page-schema'
