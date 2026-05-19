// ============================================================================
// 组件注册中心
// ============================================================================
// 维护 Map<string, { meta, renderer }>，提供 register/get 方法。
// 组件元数据必须是纯 JSON 可序列化，跨框架可复用。
// ============================================================================

import type { ComponentMeta, Node } from '@/types'
import type { ComponentType } from 'react'

interface RegistryEntry {
  meta: ComponentMeta
  renderer: ComponentType<{ node: Node }>
}

const registry = new Map<string, RegistryEntry>()

/**
 * 注册一个组件。
 * 如果 componentType 已存在，覆盖并打印警告。
 */
export function registerComponent(meta: ComponentMeta, renderer: ComponentType<{ node: Node }>) {
  if (registry.has(meta.componentType)) {
    console.warn(`组件 "${meta.componentType}" 已注册，将被覆盖`)
  }
  registry.set(meta.componentType, { meta, renderer })
}

/** 获取组件元数据 */
export function getComponentMeta(type: string): ComponentMeta | undefined {
  return registry.get(type)?.meta
}

/** 获取组件渲染器 */
export function getComponentRenderer(type: string): ComponentType<{ node: Node }> | undefined {
  return registry.get(type)?.renderer
}

/** 获取所有已注册组件的元数据（用于物料面板） */
export function getAllComponentMetas(): ComponentMeta[] {
  return Array.from(registry.values()).map((entry) => entry.meta)
}

/** 按分组获取组件元数据 */
export function getComponentMetasByGroup(group: string): ComponentMeta[] {
  return getAllComponentMetas().filter((m) => m.group === group)
}

/**
 * 注册所有内置组件。
 * 在应用启动时调用一次。
 */
export async function registerBuiltinComponents() {
  // 动态导入内置组件，避免循环依赖
  const mods = await Promise.all([
    import('./builtin/text'),
    import('./builtin/image'),
    import('./builtin/decor'),
    import('./builtin/metric-card'),
    import('./builtin/table'),
    import('./builtin/chart'),
  ])

  registerComponent(mods[0].TEXT_META, mods[0].TextRenderer)
  registerComponent(mods[1].IMAGE_META, mods[1].ImageRenderer)
  registerComponent(mods[2].DECOR_META, mods[2].DecorRenderer)
  registerComponent(mods[3].METRIC_CARD_META, mods[3].MetricCardRenderer)
  registerComponent(mods[4].TABLE_META, mods[4].TableRenderer)
  registerComponent(mods[5].CHART_META, mods[5].ChartRenderer)
}
