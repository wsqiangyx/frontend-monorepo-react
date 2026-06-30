// ============================================================================
// @repo/shared-utils — ky HTTP 客户端封装
// ============================================================================
// 框架无关的 HTTP 客户端，基于 ky 封装。
//
// 核心设计：
//   请求钩子 — 自动从 getToken() 获取 token 并注入 Authorization 头
//   响应钩子 — 网络异常、超时、平台业务错误统一转化为 ApiError
//   unwrap 层 — 解包 ApiResponse<T>.data，消费者直接拿到 T
//
// 使用方式：
//   const http = createHttpClient({ baseURL: '/api', getToken: () => store.token })
//   const users = await http.get<User[]>('/users')
//
// 错误处理：
//   网络错误 → ApiError(code='NETWORK_ERROR')
//   业务错误 → ApiError(code=body.code, message=body.message)
//   消费者只需 catch ApiError 即可覆盖所有异常场景。
// ============================================================================

import ky, { type KyInstance, type Options as KyOptions } from 'ky'
import type { HttpClientConfig } from './types'
import { ApiError } from './types'
import type { ApiResponse } from '../api-contract'

export interface HttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>
  post<T>(url: string, data?: unknown): Promise<T>
  put<T>(url: string, data?: unknown): Promise<T>
  patch<T>(url: string, data?: unknown): Promise<T>
  delete<T>(url: string): Promise<T>
}

/**
 * 创建 HTTP 客户端实例。
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const { baseURL, timeout = 10_000, getToken = () => null } = config

  const client: KyInstance = ky.create({
    prefixUrl: baseURL.replace(/\/$/, ''),
    timeout,
    hooks: {
      beforeRequest: [
        (request) => {
          const token = getToken()
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        },
      ],
      afterResponse: [
        async (_request, _options, response) => {
          if (!response.ok) {
            let code = 'NETWORK_ERROR'
            let message = `HTTP ${response.status}`

            try {
              const body = (await response.json()) as ApiResponse<unknown>
              code = body.code ?? 'NETWORK_ERROR'
              message = body.message ?? message
            } catch {
              // 非 JSON 响应，使用默认值
            }

            // 401 Unauthorized — 令牌过期或无效
            if (response.status === 401) {
              code = 'UNAUTHORIZED'
              message = message || '认证已过期，请重新登录'
            }

            throw new ApiError(code, message, response.status)
          }
        },
      ],
    },
  })

  async function unwrap<T>(promise: Promise<Response>): Promise<T> {
    const response = await promise
    const body = (await response.json()) as ApiResponse<T>
    if (!body.success) {
      throw new ApiError(body.code, body.message, response.status)
    }
    return body.data
  }

  // ky 的 prefixUrl 要求后续路径不以 / 开头，统一去除
  function stripSlash(path: string): string {
    return path.replace(/^\//, '')
  }

  return {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
      const options: KyOptions = {}
      if (params) {
        options.searchParams = params as Record<string, string | number | boolean>
      }
      return unwrap<T>(client.get(stripSlash(url), options))
    },
    post<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.post(stripSlash(url), { json: data }))
    },
    put<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.put(stripSlash(url), { json: data }))
    },
    patch<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.patch(stripSlash(url), { json: data }))
    },
    delete<T>(url: string): Promise<T> {
      return unwrap<T>(client.delete(stripSlash(url)))
    },
  }
}

export { ApiError }
