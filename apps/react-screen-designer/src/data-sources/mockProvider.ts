// ============================================================================
// Mock 数据源提供者
// ============================================================================
// 通过 fetch 调用 MSW 拦截的 /api/screen-mock/:endpoint 接口。
// Phase 1 只支持 GET 请求。
// ============================================================================

import type { DataProvider } from '@/utils'
import { registerProvider } from '@/utils'
import type { MockDataSourceConfig } from '@/types'

/**
 * Mock 数据源提供者。
 * fetch 调用会被 MSW handler 拦截并返回模拟数据。
 */
const mockProvider: DataProvider = {
  type: 'mock',

  async fetch(config: unknown) {
    const { endpoint } = config as MockDataSourceConfig

    if (!endpoint || !endpoint.startsWith('/api/')) {
      throw new Error(`无效的 Mock endpoint: ${endpoint}`)
    }

    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`Mock 请求失败: ${response.status} ${response.statusText}`)
    }

    const json = (await response.json()) as { success: boolean; data: unknown; message?: string }
    if (!json.success) {
      throw new Error(json.message ?? 'Mock 请求失败')
    }

    return json.data
  },
}

/** 注册 Mock 提供者到全局注册表 */
export function initMockProvider() {
  registerProvider(mockProvider)
}
