import { defineConfig } from 'vitest/config'

// ============================================================================
// 根 Vitest 工作区配置
// ============================================================================
// 采用 Vitest projects 模式，将每个包和应用作为独立测试项目聚合。
// 项目列表与 STATUS.yaml 中 stable 成员一一对应，由 check-status.mjs 校验一致性。
//
// 注意：react-screen-designer 为 experimental 应用，不纳入默认测试矩阵。
// ============================================================================

export default defineConfig({
  test: {
    projects: [
      // 基础共享层（必须先于 shared 构建，因为 shared 重导出这两个包）
      'packages/shared-utils/vitest.config.ts',
      'packages/shared-i18n/vitest.config.ts',
      // 向后兼容重导出层
      'packages/shared/vitest.config.ts',
      // 平台内核层
      'packages/shared-service/vitest.config.ts',
      // 设计令牌与静态资源
      'packages/design-tokens/vitest.config.ts',
      'packages/resources/vitest.config.ts',
      // Mock 与 UI 适配层
      'packages/mock/vitest.config.ts',
      'packages/shared-ui/vitest.config.ts',
      // 正式宿主应用
      'apps/react-app/vitest.config.ts',
    ],
  },
})
