// ============================================================================
// Screen CRUD Store
// ============================================================================
// 管理大屏页面列表的增删改查、草稿保存、发布快照。
// ============================================================================

import { create } from 'zustand'
import type { Screen } from '@/types'
import { createHttpClient } from '@repo/shared/http'

const api = createHttpClient({ baseURL: '/api' })

interface ScreenState {
  screens: Screen[]
  loading: boolean
  currentScreen: Screen | null

  fetchScreens: () => Promise<void>
  fetchScreen: (id: string) => Promise<Screen>
  createScreen: (name: string, description?: string) => Promise<Screen>
  updateScreen: (id: string, patch: Partial<Screen>) => Promise<void>
  deleteScreen: (id: string) => Promise<void>
  copyScreen: (id: string) => Promise<Screen>
  publishScreen: (id: string) => Promise<void>

  resetForTest: () => void
}

export const useScreenStore = create<ScreenState>((set, get) => ({
  screens: [],
  loading: false,
  currentScreen: null,

  fetchScreens: async () => {
    set({ loading: true })
    try {
      const result = await api.get<{ items: Screen[] }>('/screens')
      set({ screens: result.items })
    } finally {
      set({ loading: false })
    }
  },

  fetchScreen: async (id) => {
    const screen = await api.get<Screen>(`/screens/${id}`)
    set({ currentScreen: screen })
    return screen
  },

  createScreen: async (name, description = '') => {
    const screen = await api.post<Screen>('/screens', { name, description })
    set({ screens: [...get().screens, screen] })
    return screen
  },

  updateScreen: async (id, patch) => {
    const updated = await api.put<Screen>(`/screens/${id}`, patch)
    set({
      screens: get().screens.map((s) => (s.id === id ? updated : s)),
      currentScreen: get().currentScreen?.id === id ? updated : get().currentScreen,
    })
  },

  deleteScreen: async (id) => {
    await api.delete(`/screens/${id}`)
    set({ screens: get().screens.filter((s) => s.id !== id) })
  },

  copyScreen: async (id) => {
    const screen = await api.post<Screen>(`/screens/${id}/copy`)
    set({ screens: [...get().screens, screen] })
    return screen
  },

  publishScreen: async (id) => {
    const updated = await api.post<Screen>(`/screens/${id}/publish`)
    set({
      screens: get().screens.map((s) => (s.id === id ? updated : s)),
      currentScreen: get().currentScreen?.id === id ? updated : get().currentScreen,
    })
  },

  resetForTest: () => set({ screens: [], loading: false, currentScreen: null }),
}))
