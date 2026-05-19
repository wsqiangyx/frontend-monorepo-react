// ============================================================================
// @repo/shared — Route 类型定义
// ============================================================================
// Route 是 Screen 下的子对象，代表一个独立的展示入口。
// 每个 Route 拥有独立的 slug、预览链接、分享 token。
// ============================================================================

import type { Permission } from './permission'

/** 展示路由 */
export interface Route {
  /** 唯一标识 */
  id: string
  /** 所属 Screen id */
  screenId: string
  /** 路由名称 */
  name: string
  /** URL slug，Screen 内唯一，由系统自动生成 */
  slug: string
  /** 可选的权限覆盖；省略时继承 Screen 级权限 */
  permission?: Permission
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
