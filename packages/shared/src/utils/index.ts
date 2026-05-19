// ============================================================================
// @repo/shared — 纯工具函数
// ============================================================================
// 所有函数保持无副作用、无框架依赖，可被任何 workspace 安全引用。
// ============================================================================

/**
 * 把普通对象转换成 URL 查询字符串，并自动跳过 `undefined` 字段。
 *
 * 示例：buildQueryString({ page: 1, keyword: undefined }) → "page=1"
 * 使用 URLSearchParams 构造，自动处理 URL 编码。
 *
 * @param params - 键值对对象，值为 undefined 的字段会被忽略
 * @returns 编码后的查询字符串（不含前导 ?）
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
 *
 * 示例：await sleep(1000) — 等待 1 秒后继续执行
 * 在测试中模拟异步延迟，或在 UI 交互中做简易防抖。
 *
 * @param ms - 等待时间（毫秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// --- 可视化大屏设计器工具 ---
export * from './id'
export * from './clamp'
export * from './data-binding'
