import { create } from 'zustand'
import type { PlatformMenuNode } from '@repo/shared-service'
import { sortMenuNodes, normalizeMenuNode } from '@repo/shared-service'
import { api } from '@/services/shared'

interface NavigationState {
  menuNodes: PlatformMenuNode[]
  loading: boolean
  error: string | null
  loadMenu: () => Promise<void>
}

export const useNavigationStore = create<NavigationState>((set) => ({
  menuNodes: [],
  loading: false,
  error: null,

  loadMenu: async () => {
    set({ loading: true, error: null })
    try {
      const nodes = await api.get<PlatformMenuNode[]>('/navigation/menu-tree')
      const normalized = nodes.map(normalizeMenuNode)
      set({ menuNodes: sortMenuNodes(normalized), error: null })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '获取菜单失败' })
      throw e
    } finally {
      set({ loading: false })
    }
  },
}))
