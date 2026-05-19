import { create } from 'zustand'
import type { PlatformSession, AuthStatus, PlatformUser } from '@repo/shared-service'
import { createAnonymousSession, isAuthenticated } from '@repo/shared-service'
import { createHttpClient } from '@repo/shared/http'

interface LoginParams {
  username: string
  password: string
}

interface AuthState {
  session: PlatformSession
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

const api = createHttpClient({ baseURL: '/api' })

export const useAuthStore = create<AuthState>((set, get) => ({
  session: createAnonymousSession(),

  login: async ({ username, password }) => {
    const result = await api.post<{ token: string; userId: string; role: string }>('/auth/login', {
      username,
      password,
    })

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
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      set({ session: createAnonymousSession() })
    }
  },

  fetchProfile: async () => {
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
  },
}))
