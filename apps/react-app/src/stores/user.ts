// ============================================================================
// @repo/react-app — 用户状态 Store (Zustand)
// ============================================================================
// 使用 Zustand 管理用户状态，通过 @repo/shared-utils 的 HTTP 客户端获取数据。
// ============================================================================
import { create } from 'zustand'
import { createHttpClient } from '@repo/shared-utils/http'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  fetchUser: () => Promise<void>
}

const api = createHttpClient({ baseURL: '/api' })

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      const user = await api.get<User>('/user')
      set({ user })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '获取用户信息失败' })
    } finally {
      set({ loading: false })
    }
  },
}))
