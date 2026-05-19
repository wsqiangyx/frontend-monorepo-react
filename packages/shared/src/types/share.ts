// ============================================================================
// @repo/shared — Share 类型定义
// ============================================================================
// 分享对象，让外部用户通过 token 访问指定 Route 的已发布快照。
// token 由 crypto.randomUUID() 生成，不可猜测。
// ============================================================================

/** 分享配置 */
export interface Share {
  /** 分享 token，由 crypto.randomUUID() 生成，UUID v4 格式 */
  token: string
  /** 关联的 Route id */
  routeId: string
  /** 是否启用 */
  enabled: boolean
  /** 失效时间，ISO 8601 格式，如 "2026-06-15T00:00:00Z"，undefined 表示永不失效 */
  expiresAt?: string
  /** Phase 2 预留：访问次数 */
  accessCount?: number
  /** Phase 2 预留：最后访问时间 */
  lastAccessedAt?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
