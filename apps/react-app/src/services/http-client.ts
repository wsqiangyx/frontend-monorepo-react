import { createHttpClient, type HttpClient } from '@repo/shared-utils/http'
import { ApiError } from '@repo/shared-utils/http'

// ============================================================================
// @repo/react-app — 平台 HTTP 客户端工厂
// ============================================================================
// 统一管理所有 API 客户端的创建与认证集成：
//   - token 提供函数由 auth-store 注册（registerTokenProvider）
//   - 401 自动处理由 auth-store 注册（setOnUnauthorized）
//   - 所有 API 请求通过 createPlatformClient() 创建的客户端发出
// ============================================================================

/**
 * 认证 token 提供函数。
 * 延迟读取 auth-store，避免模块循环依赖 — 该函数在请求时才执行，
 * 此时 useAuthStore 早已初始化完成。
 */
let _getToken: () => string | null = () => null

/**
 * 401 未授权处理器。
 * 延迟调用 auth-store 的登出逻辑，同样避免循环依赖。
 */
let _onUnauthorized: (() => void) | null = null

/**
 * 注册 token 提供函数，由 auth-store 初始化时调用。
 * 这打破了 shared.ts → auth-store → shared.ts 的模块循环。
 */
export function registerTokenProvider(provider: () => string | null): void {
  _getToken = provider
}

/**
 * 注册 401 未授权处理器，由 auth-store 初始化时调用。
 * 当任何 API 请求返回 401 时自动触发（清除会话并重定向登录页）。
 */
export function setOnUnauthorized(handler: () => void): void {
  _onUnauthorized = handler
}

/**
 * 包装 HttpClient，拦截 401 错误并触发全局处理器。
 * 捕获 ApiError(code='UNAUTHORIZED') 后调用 onUnauthorized，然后继续抛出错误。
 */
function withUnauthorizedHandler(client: HttpClient): HttpClient {
  function intercept401<T>(promise: Promise<T>): Promise<T> {
    return promise.catch((e: unknown) => {
      if (e instanceof ApiError && e.code === 'UNAUTHORIZED') {
        _onUnauthorized?.()
      }
      throw e
    })
  }

  return {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
      return intercept401(client.get<T>(url, params))
    },
    post<T>(url: string, data?: unknown): Promise<T> {
      return intercept401(client.post<T>(url, data))
    },
    put<T>(url: string, data?: unknown): Promise<T> {
      return intercept401(client.put<T>(url, data))
    },
    patch<T>(url: string, data?: unknown): Promise<T> {
      return intercept401(client.patch<T>(url, data))
    },
    delete<T>(url: string): Promise<T> {
      return intercept401(client.delete<T>(url))
    },
  }
}

/**
 * 创建平台标准 HTTP 客户端。
 * 所有 API 请求应通过此函数创建的客户端或 services/shared.ts 的 api 实例发出。
 * 自动注入 Authorization 头并拦截 401 响应。
 */
export function createPlatformClient(baseURL = '/api'): HttpClient {
  const client = createHttpClient({
    baseURL,
    getToken: () => _getToken(),
  })
  return withUnauthorizedHandler(client)
}
