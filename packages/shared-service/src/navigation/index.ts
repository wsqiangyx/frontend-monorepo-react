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
