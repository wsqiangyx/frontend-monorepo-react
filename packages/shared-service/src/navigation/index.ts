// ============================================================================
// @repo/shared-service — 菜单树与路由元数据
// ============================================================================
// 定义平台级菜单节点与路由元数据模型。
//
// PlatformMenuNode 描述菜单树结构：
//   type = 'directory' — 纯分组目录，无实际路由
//   type = 'route'     — 对应前端路由
//   type = 'external'  — 外部链接（新窗口打开）
//   type = 'iframe'    — 内嵌 iframe 页面
//
// PlatformRouteMeta 描述路由的平台语义（权限、缓存、面包屑等）。
// 宿主应用的路由守卫和菜单组件消费这些类型。
//
// 工具函数：
//   normalizeMenuNode  — 补全默认值，保证下游代码无需做空值判断
//   flattenMenuNodes   — 递归展平菜单树（过滤 hidden 节点），用于搜索/面包屑
//   sortMenuNodes      — 按 order 字段排序（递归）
//   normalizeRouteMeta — 补全路由元数据默认值
// ============================================================================

export type MenuNodeType = 'directory' | 'route' | 'external' | 'iframe'

export interface PlatformMenuNode {
  key: string
  parentKey?: string
  title: string
  icon?: string
  path?: string
  routeName?: string
  type: MenuNodeType
  order: number
  hidden?: boolean
  disabled?: boolean
  affix?: boolean
  permissionCodes?: string[]
  children?: PlatformMenuNode[]
}

export interface PlatformRouteMeta {
  key: string
  path: string
  title?: string
  icon?: string
  order?: number
  hidden?: boolean
  affix?: boolean
  keepAlive?: boolean
  requiresAuth: boolean
  permissionCodes?: string[]
  menuKey?: string
  activeMenu?: string
  breadcrumb?: boolean
  external?: boolean
  iframe?: boolean
  layout?: string
}

export function normalizeMenuNode(node: PlatformMenuNode): PlatformMenuNode {
  return {
    ...node,
    order: node.order ?? 0,
    hidden: node.hidden ?? false,
    disabled: node.disabled ?? false,
    affix: node.affix ?? false,
    permissionCodes: node.permissionCodes ?? [],
    children: node.children?.map(normalizeMenuNode),
  }
}

export function flattenMenuNodes(nodes: PlatformMenuNode[]): PlatformMenuNode[] {
  const result: PlatformMenuNode[] = []
  for (const node of nodes) {
    if (node.hidden !== true) {
      result.push(node)
    }
    if (node.children) {
      result.push(...flattenMenuNodes(node.children))
    }
  }
  return result
}

export function sortMenuNodes(nodes: PlatformMenuNode[]): PlatformMenuNode[] {
  return [...nodes]
    .sort((a, b) => a.order - b.order)
    .map((node) => (node.children ? { ...node, children: sortMenuNodes(node.children) } : node))
}

export function normalizeRouteMeta(meta: PlatformRouteMeta): PlatformRouteMeta {
  return {
    ...meta,
    hidden: meta.hidden ?? false,
    affix: meta.affix ?? false,
    keepAlive: meta.keepAlive ?? false,
    requiresAuth: meta.requiresAuth ?? true,
    permissionCodes: meta.permissionCodes ?? [],
    breadcrumb: meta.breadcrumb ?? true,
    external: meta.external ?? false,
    iframe: meta.iframe ?? false,
  }
}
