// ============================================================================
// @repo/design-tokens 的 Vitest 配置
// ============================================================================
// 使用 defineProject（非 defineConfig），因为本包是根 vitest.config.ts
// 中 projects 数组的一个子项目，由根配置聚合。
// ============================================================================
import { defineProject } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineProject({
  test: {
    // 启用全局 API：允许直接使用 describe/it/expect 而无需 import
    globals: true,
    // 测试环境：Node。ui-tokens 包无 DOM 依赖（token 值是纯数据）
    environment: 'node',
    // 使用线程池并行执行测试
    pool: 'threads',
  },
  resolve: {
    alias: {
      '@repo/shared/ui-contract': fileURLToPath(
        new URL('../shared/src/ui-contract/index.ts', import.meta.url),
      ),
    },
  },
})
