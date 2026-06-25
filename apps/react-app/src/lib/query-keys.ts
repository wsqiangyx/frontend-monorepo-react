// ============================================================================
// TanStack Query — Query Key 工厂
// ============================================================================
// 集中管理所有 query key，确保缓存隔离和失效操作的类型安全。
//
// 约定：
//   - 每个业务域一个 key 工厂对象
//   - all() 返回该域的基础 key（用于失效整个域）
//   - detail/list 等返回带参数的 key（用于精确缓存和失效）
// ============================================================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
}

export const userKeys = {
  all: ['users'] as const,
  list: (params?: { keyword?: string; page?: number; pageSize?: number }) =>
    [...userKeys.all, 'list', params] as const,
}

export const roleKeys = {
  all: ['roles'] as const,
  list: (params?: Record<string, unknown>) => [...roleKeys.all, 'list', params] as const,
}

export const dictionaryKeys = {
  all: ['dictionaries'] as const,
  list: (params?: Record<string, unknown>) => [...dictionaryKeys.all, 'list', params] as const,
}

export const menuKeys = {
  all: ['menus'] as const,
  list: (params?: Record<string, unknown>) => [...menuKeys.all, 'list', params] as const,
}

export const systemMetaKeys = {
  all: ['system-meta'] as const,
  detail: () => [...systemMetaKeys.all, 'detail'] as const,
}

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
}
