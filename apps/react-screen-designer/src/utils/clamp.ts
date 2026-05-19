// ============================================================================
// @repo/shared — 数值钳制工具
// ============================================================================

/**
 * 将数值限制在 [min, max] 范围内。
 * 用于缩放范围限制、位置约束等场景。
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
