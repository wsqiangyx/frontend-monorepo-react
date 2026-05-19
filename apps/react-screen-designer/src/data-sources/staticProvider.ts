// ============================================================================
// 静态数据源提供者
// ============================================================================
// 直接返回配置中的静态数据，无网络请求。
// ============================================================================

import type { DataProvider } from '@repo/shared'
import { registerProvider } from '@repo/shared'
import type { StaticDataSourceConfig } from '@repo/shared'

/**
 * 静态数据源提供者。
 * 直接返回 config.data，不发起任何请求。
 */
const staticProvider: DataProvider = {
  type: 'static',

  async fetch(config: unknown) {
    const { data } = config as StaticDataSourceConfig
    return data
  },
}

/** 注册静态提供者到全局注册表 */
export function initStaticProvider() {
  registerProvider(staticProvider)
}
