// ============================================================================
// Share 管理 Store
// ============================================================================
// 管理分享链接的生成、更新、查询。
// ============================================================================

import { create } from 'zustand'
import type { Share } from '@repo/shared'
import { createHttpClient } from '@repo/shared/http'

const api = createHttpClient({ baseURL: '/api' })

interface ShareState {
  currentShare: Share | null
  loading: boolean

  /** 为指定 Route 生成或更新分享链接 */
  createShare: (routeId: string) => Promise<Share>
  /** 更新分享配置（启用/禁用、过期时间） */
  updateShare: (token: string, patch: Partial<Share>) => Promise<void>
  /** 通过 token 获取分享信息（分享页使用） */
  fetchShareByToken: (token: string) => Promise<Share>

  resetForTest: () => void
}

export const useShareStore = create<ShareState>((set) => ({
  currentShare: null,
  loading: false,

  createShare: async (routeId) => {
    const share = await api.post<Share>(`/routes/${routeId}/share`)
    set({ currentShare: share })
    return share
  },

  updateShare: async (token, patch) => {
    const updated = await api.put<Share>(`/share/${token}`, patch)
    set({ currentShare: updated })
  },

  fetchShareByToken: async (token) => {
    set({ loading: true })
    try {
      const share = await api.get<Share>(`/share/${token}`)
      set({ currentShare: share })
      return share
    } finally {
      set({ loading: false })
    }
  },

  resetForTest: () => set({ currentShare: null, loading: false }),
}))
