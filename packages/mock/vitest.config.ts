// ============================================================================
// @repo/mock 的 Vitest 配置
// ============================================================================
// 使用 defineProject（非 defineConfig），因为本包是根 vitest.config.ts
// 中 projects 数组的一个子项目，由根配置聚合。
// ============================================================================
import { defineProject } from 'vitest/config'
import { resolve } from 'node:path'

export default defineProject({
  resolve: {
    alias: {
      '@repo/shared-utils/api-contract': resolve(
        __dirname,
        '../shared-utils/src/api-contract/index.ts',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
  },
})
