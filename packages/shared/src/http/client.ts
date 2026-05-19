// ============================================================================
// @repo/shared — Axios HTTP 客户端封装
// ============================================================================
// 框架无关的 HTTP 客户端，基于 axios 封装。
// - 请求拦截器：自动注入 token
// - 响应拦截器：网络异常、超时、平台业务错误统一转化为 ApiError
// - 方法层解包 ApiResponse<T>.data，消费者直接拿到 T
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
 *
 * @param config - 客户端配置（baseURL 必填）
 * @returns 封装后的客户端，提供 get/post/put/patch/delete 方法
 *
 * 消费者使用方式：
 *   const api = createHttpClient({ baseURL: '/api' })
 *   const user = await api.get<User>('/user')  // 直接拿到 User，无需 .data
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const { baseURL, timeout = 10_000, getToken = () => null } = config

  const client: AxiosInstance = axios.create({
    baseURL,
    timeout,
  })

  // 请求拦截器：注入 token
  client.interceptors.request.use((req) => {
    const token = getToken()
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  })

  // 响应拦截器：提取平台业务错误信息
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
