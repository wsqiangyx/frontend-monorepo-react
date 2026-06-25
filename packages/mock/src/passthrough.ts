// ============================================================================
// @repo/mock — Mock 请求透传工具
// ============================================================================
// 提供 shouldPassthrough 函数，让 MSW handler 判断当前请求是否需要透传到真实后端。
//
// 使用方式：
//   import { shouldPassthrough } from '@repo/mock/passthrough'
//
//   http.get('/api/user', async ({ request }) => {
//     if (shouldPassthrough(request)) {
//       return fetch(request)
//     }
//     return HttpResponse.json(mockData)
//   })
//
// 通过 VITE_MOCK_PASSTHROUGH 环境变量配置需要透传的路径（逗号分隔）：
//   VITE_MOCK_PASSTHROUGH=/api/user,/api/dashboard/summary
// ============================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

// 兼容浏览器（import.meta.env）和 Node（process.env）两种环境
declare const process: { env: Record<string, string | undefined> } | undefined

function getEnvVar(name: string): string | undefined {
  try {
    // Vite 浏览器端：import.meta.env 是 Vite 的编译时注入
    const meta = typeof import.meta !== 'undefined' ? (import.meta as any) : undefined
    if (meta?.env?.[name]) return meta.env[name]

    // Node.js / 测试环境
    if (typeof process !== 'undefined' && process.env?.[name]) {
      return process.env[name]
    }
  } catch {
    // 静默失败，视为未配置
  }
  return undefined
}

function getPassthroughPaths(): Set<string> {
  const raw = getEnvVar('VITE_MOCK_PASSTHROUGH')
  if (!raw) return new Set()

  return new Set(
    raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean),
  )
}

let cachedPassthroughPaths: Set<string> | null = null

function getPaths(): Set<string> {
  if (!cachedPassthroughPaths) {
    cachedPassthroughPaths = getPassthroughPaths()
  }
  return cachedPassthroughPaths
}

/**
 * 判断指定请求是否需要透传到真实后端（不走 Mock）。
 *
 * @param request - MSW handler 接收到的 Request 对象
 * @returns 如果请求路径在 VITE_MOCK_PASSTHROUGH 列表中，返回 true
 */
export function shouldPassthrough(request: Request): boolean {
  const paths = getPaths()
  if (paths.size === 0) return false

  const url = new URL(request.url)
  return paths.has(url.pathname)
}

/**
 * 重置内部缓存（主要用于测试）。
 */
export function resetPassthroughCache(): void {
  cachedPassthroughPaths = null
}
