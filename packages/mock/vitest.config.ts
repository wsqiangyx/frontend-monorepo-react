// ============================================================================
// @repo/mock 的 Vitest 配置
// ============================================================================
// 使用 defineProject（非 defineConfig），因为本包是根 vitest.config.ts
// 中 projects 数组的一个子项目，由根配置聚合。
// ============================================================================
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    // 启用全局 API：允许直接使用 describe/it/expect 而无需 import
    globals: true,
    // 测试环境：Node。mock 包的 handler 逻辑不依赖 DOM
    environment: 'node',
    // 使用线程池并行执行测试
    pool: 'threads',
  },
})
