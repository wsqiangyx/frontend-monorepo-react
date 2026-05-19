// ============================================================================
// @repo/shared — Screen 类型定义
// ============================================================================
// Screen 是系统核心对象，代表一个"大屏页面"。
// 状态机：draft -> published -> archived
// ============================================================================

import type { DataSource } from './data-source'
import type { Node } from './node'
import type { Permission } from './permission'
import type { Route } from './route'

/** 页面状态 */
export type ScreenStatus = 'draft' | 'published' | 'archived'

/** 画布配置 */
export interface CanvasConfig {
  /** 画布宽度（px），最小 100 */
  width: number
  /** 画布高度（px），最小 100 */
  height: number
  /** 背景颜色 */
  backgroundColor: string
  /** 背景图片 URL，支持相对路径或绝对 URL */
  backgroundImage?: string
}

/** 页面版本快照 */
export interface PageVersion {
  /** 节点集合，key 为 node id */
  nodes: Record<string, Node>
  /** 页面数据源定义 */
  dataSources: DataSource[]
  /** 保存时间 */
  savedAt: string
}

/** 大屏页面 */
export interface Screen {
  /** 唯一标识 */
  id: string
  /** 页面名称 */
  name: string
  /** 页面描述 */
  description: string
  /** 页面状态 */
  status: ScreenStatus
  /** 画布配置 */
  canvasConfig: CanvasConfig
  /** 路由集合 */
  routes: Route[]
  /** 页面级权限配置 */
  permission: Permission
  /** 页面级数据源定义 */
  dataSources: DataSource[]
  /** 草稿版本 */
  draftVersion: PageVersion
  /** 发布版本快照 */
  publishVersion?: PageVersion
  /** Schema 版本号，用于结构升级兼容 */
  schemaVersion: number
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
