// ============================================================================
// @repo/shared-service — 认证会话模型
// ============================================================================
// 定义平台级用户与会话类型，不依赖任何 UI 框架。
// 宿主应用的 userStore 消费这些类型来管理登录状态。
//
// AuthStatus 状态机：anonymous → authenticated → expired
//   anonymous     — 未登录或已登出
//   authenticated — 有效登录态
//   expired       — Token 过期，需刷新或重新登录
// ============================================================================

export type AuthStatus = 'anonymous' | 'authenticated' | 'expired'

export interface PlatformUser {
  id: string
  username: string
  displayName?: string
  avatar?: string
  roles?: string[]
}

export interface PlatformSession {
  user: PlatformUser
  status: AuthStatus
  token?: string
  expiresAt?: number
}

export function createAnonymousSession(): PlatformSession {
  return { user: { id: '', username: '' }, status: 'anonymous' }
}

export function isAuthenticated(session: PlatformSession): boolean {
  return session.status === 'authenticated'
}

/** @deprecated 暂无消费者，预计在未来 token 刷新流程中使用 */
export function isSessionExpired(session: PlatformSession): boolean {
  return session.status === 'expired'
}
