import { create } from 'zustand'
import type { PermissionSet, PermissionCode } from '@repo/platform-core'
import { createPermissionSet, hasPermission, hasAnyPermission } from '@repo/platform-core'
import { createHttpClient } from '@repo/shared/http'

interface PermissionState {
  permissionSet: PermissionSet
  loadPermissions: () => Promise<void>
  check: (code: PermissionCode) => boolean
  checkAny: (codes: PermissionCode[]) => boolean
}

const api = createHttpClient({ baseURL: '/api' })

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissionSet: createPermissionSet(),

  loadPermissions: async () => {
    const result = await api.get<{ permissions: string[]; role: string }>('/navigation/permissions')
    set({ permissionSet: createPermissionSet(result.permissions) })
  },

  check: (code) => hasPermission(get().permissionSet, code),
  checkAny: (codes) => hasAnyPermission(get().permissionSet, codes),
}))
