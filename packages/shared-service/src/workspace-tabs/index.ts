export interface WorkspaceTab {
  key: string
  routeName: string
  path: string
  title: string
  closable: boolean
  affix: boolean
  keepAlive: boolean
  query?: Record<string, string>
  params?: Record<string, string>
  menuKey?: string
}

export function createTab(
  overrides: Partial<WorkspaceTab> & Pick<WorkspaceTab, 'key' | 'routeName' | 'path'>,
): WorkspaceTab {
  return {
    title: overrides.key,
    closable: true,
    affix: false,
    keepAlive: false,
    ...overrides,
  }
}

export function closeTab(tabs: WorkspaceTab[], key: string): WorkspaceTab[] {
  return tabs.filter((tab) => tab.key !== key || !tab.closable)
}

export function findTabByKey(tabs: WorkspaceTab[], key: string): WorkspaceTab | undefined {
  return tabs.find((tab) => tab.key === key)
}

export function isTabActive(tab: WorkspaceTab, activeKey: string): boolean {
  return tab.key === activeKey
}
