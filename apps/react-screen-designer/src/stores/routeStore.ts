// ============================================================================
// Route 管理 Store
// ============================================================================
// 管理 Screen 下的 Route 增删改。
// ============================================================================

import { create } from 'zustand'
import type { Route } from '@repo/shared'
import { createHttpClient } from '@repo/shared/http'

const api = createHttpClient({ baseURL: '/api' })

interface RouteState {
  routes: Route[]
  loading: boolean

  fetchRoutes: (screenId: string) => Promise<void>
  createRoute: (screenId: string, name: string) => Promise<Route>
  updateRoute: (id: string, patch: Partial<Route>) => Promise<void>
  deleteRoute: (id: string) => Promise<void>

  resetForTest: () => void
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  loading: false,

  fetchRoutes: async (screenId) => {
    set({ loading: true })
    try {
      const result = await api.get<{ items: Route[] }>(`/screens/${screenId}/routes`)
      set({ routes: result.items })
    } finally {
      set({ loading: false })
    }
  },

  createRoute: async (screenId, name) => {
    const route = await api.post<Route>(`/screens/${screenId}/routes`, { name })
    set({ routes: [...get().routes, route] })
    return route
  },

  updateRoute: async (id, patch) => {
    const updated = await api.put<Route>(`/routes/${id}`, patch)
    set({ routes: get().routes.map((r) => (r.id === id ? updated : r)) })
  },

  deleteRoute: async (id) => {
    await api.delete(`/routes/${id}`)
    set({ routes: get().routes.filter((r) => r.id !== id) })
  },

  resetForTest: () => set({ routes: [], loading: false }),
}))
