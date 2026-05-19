// ============================================================================
// @repo/shared-utils — Axios HTTP 客户端封装
// ============================================================================
// 框架无关的 HTTP 客户端，基于 axios 封装。
//
// 核心设计：
//   请求拦截器 — 自动从 getToken() 获取 token 并注入 Authorization 头
//   响应拦截器 — 网络异常、超时、平台业务错误统一转化为 ApiError
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

import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { HttpClientConfig } from './types'
import { ApiError } from './types'
import type { ApiResponse } from '../types'

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

  const client: AxiosInstance = axios.create({
    baseURL,
    timeout,
  })

  client.interceptors.request.use((req) => {
    const token = getToken()
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  })

  client.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0
        const body = error.response?.data as ApiResponse<unknown> | undefined
        const code = body?.code ?? 'NETWORK_ERROR'
        const message = body?.message ?? error.message
        throw new ApiError(code, message, status)
      }
      throw error
    },
  )

  async function unwrap<T>(promise: Promise<AxiosResponse>): Promise<T> {
    const res = await promise
    const body = res.data as ApiResponse<T>
    if (!body.success) {
      throw new ApiError(body.code, body.message, res.status)
    }
    return body.data
  }

  return {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
      return unwrap<T>(client.get(url, { params }))
    },
    post<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.post(url, data))
    },
    put<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.put(url, data))
    },
    patch<T>(url: string, data?: unknown): Promise<T> {
      return unwrap<T>(client.patch(url, data))
    },
    delete<T>(url: string): Promise<T> {
      return unwrap<T>(client.delete(url))
    },
  }
}

export { ApiError }
