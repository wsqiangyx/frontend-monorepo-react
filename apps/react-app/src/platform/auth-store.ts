import { create } from 'zustand'
import type { PlatformSession, AuthStatus, PlatformUser } from '@repo/shared-service'
import { createAnonymousSession, isAuthenticated } from '@repo/shared-service'
import { registerTokenProvider, setOnUnauthorized } from '@/services/http-client'
import { api } from '@/services/shared'

interface LoginParams {
  username: string
  password: string
}

interface AuthState {
  session: PlatformSession
  error: string | null
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: createAnonymousSession(),
  error: null,

  login: async ({ username, password }) => {
    set({ error: null })
    try {
      const result = await api.post<{ token: string; userId: string; role: string }>(
        '/auth/login',
        { username, password },
      )

      const user: PlatformUser = {
        id: result.userId,
        username,
        roles: [result.role],
      }

      set({
        session: {
          user,
          status: 'authenticated' as AuthStatus,
          token: result.token,
        },
      })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '登录失败' })
      throw e
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {})
    } catch {
      // 登出失败仍然清除本地状态
    } finally {
      set({ session: createAnonymousSession(), error: null })
    }
  },

  fetchProfile: async () => {
    try {
      const profile = await api.get<{ id: string; name: string; email: string; role: string }>(
        '/account/profile',
      )

      const user: PlatformUser = {
        id: profile.id,
        username: profile.name,
        displayName: profile.name,
        roles: [profile.role],
      }

      set({
        session: {
          user,
          status: isAuthenticated(get().session)
            ? get().session.status
            : ('authenticated' as AuthStatus),
          token: get().session.token,
        },
      })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '获取用户资料失败' })
    }
  },
}))

// 注册 token 提供函数，使所有 HTTP 客户端实例自动获取最新 token
registerTokenProvider(() => useAuthStore.getState().session.token ?? null)

// 注册 401 未授权处理器 — 清除会话并重定向到登录页
setOnUnauthorized(() => {
  useAuthStore.setState({ session: createAnonymousSession(), error: '认证已过期，请重新登录' })
  window.location.href = '/login'
})
