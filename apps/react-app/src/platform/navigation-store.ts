import { create } from 'zustand'
import type { PlatformMenuNode } from '@repo/platform-core'
import { sortMenuNodes, normalizeMenuNode } from '@repo/platform-core'
import { createHttpClient } from '@repo/shared/http'

interface NavigationState {
  menuNodes: PlatformMenuNode[]
  loading: boolean
  loadMenu: () => Promise<void>
}

const api = createHttpClient({ baseURL: '/api' })

export const useNavigationStore = create<NavigationState>((set) => ({
  menuNodes: [],
  loading: false,

  loadMenu: async () => {
    set({ loading: true })
    try {
      const nodes = await api.get<PlatformMenuNode[]>('/navigation/menu-tree')
      const normalized = nodes.map(normalizeMenuNode)
      set({ menuNodes: sortMenuNodes(normalized) })
    } finally {
      set({ loading: false })
    }
  },
}))
