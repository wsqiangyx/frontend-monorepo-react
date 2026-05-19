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

export function isSessionExpired(session: PlatformSession): boolean {
  return session.status === 'expired'
}
