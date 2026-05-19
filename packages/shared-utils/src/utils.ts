// ============================================================================
// @repo/shared-utils — 纯工具函数
// ============================================================================
// 所有函数保持无副作用、无框架依赖，可被任何 workspace 安全引用。
// ============================================================================

/**
 * 把普通对象转换成 URL 查询字符串，并自动跳过 `undefined` 字段。
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  return searchParams.toString()
}

/**
 * 最小化的异步等待工具，常用于测试或简单节流场景。
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
