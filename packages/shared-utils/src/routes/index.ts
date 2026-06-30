// ============================================================================
// @repo/shared-utils — 路由定义契约（框架无关）
// ============================================================================
// 所有路由路径、名称、元信息在此统一定义。
// React 通过适配函数消费此配置，后续新增路由只需修改本文件。
// ============================================================================

/**
 * 单个路由的定义（框架无关）。
 * - path: URL 路径
 * - name: 路由名称（用于编程式导航和组件映射）
 * - meta: 仅承载框架无关的通用元信息（如页面标题）
 * - children: 子路由
 *
 * 平台语义（permissionCodes、menuKey 等）由 app 层直接定义在
 * 框架专属路由配置（如 react-router 的 handle）中，不在此透传。
 */
export interface RouteDefinition {
  path: string
  name: string
  meta?: { title?: string }
  children?: RouteDefinition[]
}

/**
 * 全局路由配置表。
 * React 通过适配函数消费此配置，后续新增路由只需修改本文件。
 */
export const routeDefinitions = Object.freeze([
  {
    path: '/',
    name: 'home',
    meta: { title: '首页' },
  },
] satisfies RouteDefinition[]) as readonly RouteDefinition[]
