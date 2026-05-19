import { create } from 'zustand'
import type { WorkspaceTab } from '@repo/platform-core'
import { createTab, closeTab, findTabByKey } from '@repo/platform-core'

interface TabState {
  tabs: WorkspaceTab[]
  activeKey: string
  openTab: (tab: Partial<WorkspaceTab> & Pick<WorkspaceTab, 'key' | 'routeName' | 'path'>) => void
  removeTab: (key: string) => void
  setActiveKey: (key: string) => void
  getActiveTab: () => WorkspaceTab | undefined
}

const DASHBOARD_TAB: WorkspaceTab = {
  key: 'dashboard',
  routeName: 'Dashboard',
  path: '/dashboard',
  title: 'Dashboard',
  closable: false,
  affix: true,
  keepAlive: false,
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [DASHBOARD_TAB],
  activeKey: DASHBOARD_TAB.key,

  openTab: (overrides) => {
    const { tabs } = get()
    const existing = findTabByKey(tabs, overrides.key)

    if (existing) {
      set({ activeKey: overrides.key })
      return
    }

    const newTab = createTab(overrides)
    set({ tabs: [...tabs, newTab], activeKey: newTab.key })
  },

  removeTab: (key) => {
    const { tabs, activeKey } = get()
    const updated = closeTab(tabs, key)

    if (activeKey === key && updated.length > 0) {
      const idx = tabs.findIndex((t) => t.key === key)
      const next = updated[Math.min(idx, updated.length - 1)]
      set({ tabs: updated, activeKey: next.key })
    } else {
      set({ tabs: updated })
    }
  },

  setActiveKey: (key) => set({ activeKey: key }),

  getActiveTab: () => findTabByKey(get().tabs, get().activeKey),
}))
