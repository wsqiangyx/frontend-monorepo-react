import { create } from 'zustand'
import type { PermissionSet, PermissionCode } from '@repo/shared-service'
import { createPermissionSet, hasPermission, hasAnyPermission } from '@repo/shared-service'
import { api } from '@/services/shared'

interface PermissionState {
  permissionSet: PermissionSet
  error: string | null
  loadPermissions: () => Promise<void>
  check: (code: PermissionCode) => boolean
  checkAny: (codes: PermissionCode[]) => boolean
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissionSet: createPermissionSet(),
  error: null,

  loadPermissions: async () => {
    set({ error: null })
    try {
      const result = await api.get<{ permissions: string[]; role: string }>(
        '/navigation/permissions',
      )
      set({ permissionSet: createPermissionSet(result.permissions) })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : '获取权限失败' })
    }
  },

  check: (code) => hasPermission(get().permissionSet, code),
  checkAny: (codes) => hasAnyPermission(get().permissionSet, codes),
}))
