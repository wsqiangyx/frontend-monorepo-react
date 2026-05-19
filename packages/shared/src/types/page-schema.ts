// ============================================================================
// @repo/shared — PageSchema 与 Schema 版本迁移
// ============================================================================
// PageSchema 是页面配置的序列化结构。
// SCHEMA_VERSION 记录当前系统最新版本号，每次结构变更递增。
// 迁移函数链将旧版本页面逐步升级到最新版本。
// ============================================================================

import type { CanvasConfig } from './screen'
import type { Node } from './node'
import type { DataSource } from './data-source'

/** 当前系统最新 schema 版本 */
export const SCHEMA_VERSION = 1

/** 页面配置序列化结构 */
export interface PageSchema {
  schemaVersion: number
  screenId: string
  routeId: string
  canvasConfig: CanvasConfig
  nodes: Record<string, Node>
  dataSources: DataSource[]
  savedAt: string
}

/** 迁移函数类型：将页面从当前版本升级到下一版本 */
export type MigrateFn = (page: PageSchema) => PageSchema

/**
 * 迁移函数注册表：key 为源版本号，value 为迁移到下一版本的函数。
 * 例如 migrations.set(1, migrateV1ToV2) 表示从 v1 迁移到 v2。
 */
export const migrations = new Map<number, MigrateFn>()

/**
 * 执行迁移链：将页面从其当前版本逐步升级到最新版本。
 * 如果缺少某个版本的迁移函数，抛出错误。
 */
export function migratePage(page: PageSchema): PageSchema {
  if (page.schemaVersion > SCHEMA_VERSION) {
    throw new Error(`页面版本 (${page.schemaVersion}) 高于系统版本 (${SCHEMA_VERSION})，请升级系统`)
  }

  let current = page
  while (current.schemaVersion < SCHEMA_VERSION) {
    const fn = migrations.get(current.schemaVersion)
    if (!fn) {
      throw new Error(`缺少版本 ${current.schemaVersion} 的迁移函数`)
    }
    current = fn(current)
  }
  return current
}
