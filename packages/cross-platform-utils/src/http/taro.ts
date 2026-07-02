import type { HttpClient } from '@repo/shared-utils/http'
import type { ApiResponse } from '@repo/shared-utils/api-contract'
import { ApiError } from '@repo/shared-utils/http'

interface TaroRequestApi {
  request<T>(options: TaroRequestOptions): Promise<TaroRequestResult<T>>
}

interface TaroRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: unknown
  header?: Record<string, string>
  timeout?: number
}

interface TaroRequestResult<T> {
  statusCode: number
  data: T
  header?: Record<string, string>
}

export interface TaroHttpClientConfig {
  baseURL: string
  timeout?: number
  getToken?: () => string | null
}

function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  return entries.length > 0 ? `?${entries.join('&')}` : ''
}

function stripLeadingSlash(path: string): string {
  return path.replace(/^\//, '')
}

export function createTaroHttpClient(
  config: TaroHttpClientConfig,
  taro: TaroRequestApi,
): HttpClient {
  const { baseURL, timeout = 10_000, getToken = () => null } = config
  const base = baseURL.replace(/\/$/, '')

  async function request<T>(
    method: string,
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const fullUrl = `${base}/${stripLeadingSlash(url)}${params ? buildQueryString(params) : ''}`
    const token = getToken()

    const options: TaroRequestOptions = {
      url: fullUrl,
      method: method as TaroRequestOptions['method'],
      timeout,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }

    if (data !== undefined && method !== 'GET') {
      options.data = data
    }

    let result: TaroRequestResult<ApiResponse<T>>

    try {
      result = await taro.request<ApiResponse<T>>(options)
    } catch {
      throw new ApiError('NETWORK_ERROR', '网络请求失败', 0)
    }

    if (result.statusCode === 401) {
      throw new ApiError('UNAUTHORIZED', '认证已过期，请重新登录', 401)
    }

    if (result.statusCode >= 400) {
      const body = result.data as ApiResponse<T>
      throw new ApiError(
        body?.code ?? 'NETWORK_ERROR',
        body?.message ?? `HTTP ${result.statusCode}`,
        result.statusCode,
      )
    }

    const body = result.data as ApiResponse<T>
    if (!body?.success) {
      throw new ApiError(
        body?.code ?? 'UNKNOWN_ERROR',
        body?.message ?? '未知错误',
        result.statusCode,
      )
    }

    return body.data
  }

  return {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
      return request<T>('GET', url, undefined, params)
    },
    post<T>(url: string, data?: unknown): Promise<T> {
      return request<T>('POST', url, data)
    },
    put<T>(url: string, data?: unknown): Promise<T> {
      return request<T>('PUT', url, data)
    },
    patch<T>(url: string, data?: unknown): Promise<T> {
      return request<T>('PATCH', url, data)
    },
    delete<T>(url: string): Promise<T> {
      return request<T>('DELETE', url)
    },
  }
}
