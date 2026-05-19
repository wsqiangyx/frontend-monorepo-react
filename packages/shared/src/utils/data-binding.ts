// ============================================================================
// @repo/shared — 数据绑定解析器
// ============================================================================
// 提供字段路径访问、数据绑定解析、DataProvider 注册机制。
// 纯 TypeScript，无框架依赖，React 和 Vue 3 可直接复用。
// ============================================================================

import type { DataSource, DataSourceType } from '../types/data-source'
import type { DataBinding, DataResult } from '../types/data-binding'

/**
 * 按点号路径访问嵌套属性，支持数组索引语法。
 *
 * 路径规则：
 * - "name" → data.name（一级属性）
 * - "sales.total" → data.sales.total（嵌套属性）
 * - "items[0].name" → data.items[0].name（数组索引 + 嵌套）
 * - "" → data（空字符串返回整个对象）
 *
 * @param data - 源数据
 * @param path - 点号分隔的路径
 * @returns 路径对应的值，路径不存在时返回 undefined
 */
export function getFieldByPath(data: unknown, path: string): unknown {
  if (!path || data == null) return data

  const segments = path.split('.')
  let current: unknown = data

  for (const segment of segments) {
    if (current === undefined || current === null) return undefined

    // 支持数组索引语法：items[0] → items, 0
    const match = segment.match(/^(.+?)\[(\d+)\]$/)
    if (match) {
      current = (current as Record<string, unknown>)?.[match[1]]
      current = (current as unknown[])?.[Number(match[2])]
    } else {
      current = (current as Record<string, unknown>)?.[segment]
    }
  }

  return current
}

/**
 * 对原始数据应用字段映射。
 * 根据 DataBinding.fieldMapping 配置，从原始数据中提取各字段值。
 *
 * @param rawData - 原始数据
 * @param fieldMapping - 字段映射配置 { 组件属性名: 数据路径 }
 * @returns 映射后的数据对象
 */
export function applyFieldMapping(
  rawData: unknown,
  fieldMapping?: Record<string, string>,
): unknown {
  if (!fieldMapping || Object.keys(fieldMapping).length === 0) {
    return rawData
  }

  const result: Record<string, unknown> = {}
  for (const [propKey, dataPath] of Object.entries(fieldMapping)) {
    result[propKey] = getFieldByPath(rawData, dataPath)
  }
  return result
}

// ---------------------------------------------------------------------------
// DataProvider 注册机制
// ---------------------------------------------------------------------------

/** 数据源提供者接口 — 每种数据源类型实现此接口 */
export interface DataProvider {
  type: DataSourceType
  /** 获取原始数据 */
  fetch(config: unknown): Promise<unknown>
}

/** 提供者注册表 */
const providerRegistry = new Map<DataProvider['type'], DataProvider>()

/** 注册数据源提供者 */
export function registerProvider(provider: DataProvider): void {
  providerRegistry.set(provider.type, provider)
}

/** 获取数据源提供者 */
export function getProvider(type: DataSourceType): DataProvider | undefined {
  return providerRegistry.get(type)
}

/**
 * 解析数据绑定：根据 DataBinding 和 DataSource 配置获取数据并应用字段映射。
 *
 * 工作流：
 * 1. 根据 dataSourceId 查找 DataSource
 * 2. 根据 DataSource.type 查找 DataProvider
 * 3. 调用 DataProvider.fetch(config) 获取原始数据
 * 4. 应用 fieldMapping 进行字段映射
 * 5. 输出 DataResult
 *
 * @param binding - 数据绑定配置
 * @param dataSources - 页面数据源列表
 * @returns 解析结果
 */
export async function resolveDataBinding(
  binding: DataBinding | undefined,
  dataSources: DataSource[],
): Promise<DataResult> {
  if (!binding) {
    return { status: 'idle', data: null }
  }

  const dataSource = dataSources.find((ds) => ds.id === binding.dataSourceId)
  if (!dataSource) {
    return { status: 'error', data: null, error: '数据源不存在' }
  }

  const provider = getProvider(dataSource.type)
  if (!provider) {
    return { status: 'error', data: null, error: `未注册的数据源类型: ${dataSource.type}` }
  }

  try {
    const rawData = await provider.fetch(dataSource.config)
    const mappedData = applyFieldMapping(rawData, binding.fieldMapping)

    return {
      status: 'success',
      data: mappedData,
      meta: {
        source: `${dataSource.type}:${'endpoint' in dataSource.config ? dataSource.config.endpoint : 'static'}`,
        updatedAt: new Date().toISOString(),
      },
    }
  } catch (err) {
    return {
      status: 'error',
      data: null,
      error: err instanceof Error ? err.message : '数据获取失败',
    }
  }
}
