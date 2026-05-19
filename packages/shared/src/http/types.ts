// ============================================================================
// @repo/shared — HTTP 客户端类型定义
// ============================================================================
// 框架无关的 HTTP 层类型，供共享包与 React 应用共同消费。
// ============================================================================

/**
 * HTTP 客户端配置。
 */
export interface HttpClientConfig {
  /** API 基础地址 */
  baseURL: string
  /** 请求超时时间（毫秒），默认 10000 */
  timeout?: number
  /** 获取认证 token 的函数，返回 null 表示不注入 token */
  getToken?: () => string | null
}

/**
 * 业务错误类。
 * 当平台响应返回 success === false 或网络异常时抛出，携带完整的错误信息。
 */
export class ApiError extends Error {
  /** 平台业务状态码 */
  code: string
  /** HTTP 状态码 */
  status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
