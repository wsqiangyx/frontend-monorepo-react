// ============================================================================
// @repo/shared-utils — HTTP 客户端类型定义
// ============================================================================

export interface HttpClientConfig {
  baseURL: string
  timeout?: number
  getToken?: () => string | null
}

export class ApiError extends Error {
  code: string
  status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
