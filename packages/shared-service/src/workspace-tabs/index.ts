// ============================================================================
// @repo/shared-service — 多标签页模型
// ============================================================================
// 定义工作区多标签页（Tab Workspace）的数据模型与操作函数。
// 宿主应用的 tabStore 消费这些类型来管理标签页状态。
//
// WorkspaceTab 关键字段：
//   key       — 唯一标识，通常为路由路径
//   closable  — 是否可关闭（首页等固定标签页为 false）
//   affix     — 是否固定在标签栏左侧
//   keepAlive — 是否缓存页面组件状态（切换标签时不销毁）
//   menuKey   — 关联的菜单节点 key，用于高亮侧边栏
// ============================================================================

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
