// ============================================================================
// @repo/shared — React Router 路由适配
// ============================================================================
// 将框架无关的 RouteDefinition 转换为 react-router 的 RouteObject 数组。
// 组件由消费方（app）通过 viewResolver 提供，避免共享包依赖 React。
// ============================================================================

import type { RouteDefinition } from './definitions'
import type { ReactElement } from 'react'

// react-router-dom 类型延迟导入，避免 shared 包对 react 的硬依赖。
// 实际消费方（react-app）已安装 react-router-dom，此处仅声明类型。
import type { RouteObject } from 'react-router-dom'

/**
 * 将 RouteDefinition 数组转换为 React Router 的 RouteObject 数组。
 *
 * @param definitions - 框架无关的路由定义
 * @param viewResolver - 根据路由 name 返回对应的 React 元素
 * @returns React Router 路由配置
 *
 * 消费方使用方式：
 *   import { routeDefinitions } from '@repo/shared/routes'
 *   import { createReactRoutes } from '@repo/shared/routes/react'
 *   import HomeView from '@/views/HomeView'
 *
 *   const viewResolver = (name: string) => <HomeView />
 *
 *   createBrowserRouter(createReactRoutes(routeDefinitions, viewResolver))
 */
export function createReactRoutes(
  definitions: readonly RouteDefinition[],
  viewResolver: (name: string) => ReactElement,
): RouteObject[] {
  return definitions.map((def) => ({
    path: def.path,
    id: def.name,
    element: viewResolver(def.name),
    handle: def.meta ?? {},
    children: def.children ? createReactRoutes(def.children, viewResolver) : undefined,
  }))
}
