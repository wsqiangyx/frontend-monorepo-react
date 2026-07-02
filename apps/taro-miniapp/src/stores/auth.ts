import { create } from 'zustand'
import type { PlatformSession } from '@repo/shared-service/auth'
import { createAnonymousSession } from '@repo/shared-service/auth'
import { api } from '@/services/http-client'
import { registerTokenProvider, setOnUnauthorized } from '@/services/http-client'
import { ROUTES } from '@/constants/routes'
import Taro from '@tarojs/taro'

interface AuthState {
  session: PlatformSession
  loading: boolean
  error: string | null
}

const useAuthStore = create<AuthState>(() => ({
  session: createAnonymousSession(),
  loading: false,
  error: null,
}))

registerTokenProvider(() => useAuthStore.getState().session.token ?? null)
setOnUnauthorized(() => {
  useAuthStore.setState({ session: createAnonymousSession(), error: '认证已过期' })
  Taro.redirectTo({ url: ROUTES.LOGIN })
})

export async function login(username: string, password: string): Promise<void> {
  useAuthStore.setState({ loading: true, error: null })
  try {
    const session = await api.post<PlatformSession>('/auth/login', { username, password })
    useAuthStore.setState({ session, loading: false })
  } catch (err) {
    useAuthStore.setState({ loading: false, error: String(err) })
    throw err
  }
}

export async function logout(): Promise<void> {
  useAuthStore.setState({ session: createAnonymousSession() })
  Taro.redirectTo({ url: ROUTES.LOGIN })
}

export { useAuthStore }
