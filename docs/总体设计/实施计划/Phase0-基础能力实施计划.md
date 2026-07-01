# Phase 0 基础能力实施计划

> 制定日期：2026-05-15
> 最近修订：2026-06-30
> 适用阶段：Phase 0
> 上游设计：`docs/总体设计/详细设计/Phase0-基础能力详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 1. 文档定位

本计划统一承载 Phase 0 的工程基线、主题与共享 UI、国际化三类实施任务，确保基础能力按依赖顺序落地，并保持与总体设计一致。

## 2. 输入 / 前置条件

- 总体边界：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`
- 上游设计：`docs/总体设计/详细设计/Phase0-基础能力详细设计.md`
- 正式主线为 `apps/react-app`、`packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui`
- 根脚本继续使用包装器：`scripts/vite.cjs`、`scripts/vitest.cjs`、`scripts/run-vite-bin.cjs`、`scripts/write-theme-init.mjs`

## 3. 范围 / 非目标

### 范围

- 根级仓库约定、workspace 结构与验证链路
- `packages/shared-utils` 类型契约、通用运行时与国际化收敛
- `packages/design-tokens` 与 `packages/shared-ui` 的主题 / 共享 UI 基线
- `packages/shared-service` 平台共享内核基线
- 文档入口与导航关系收敛

### 非目标

- 平台共享内核
- Mock 数据域主链路
- 业务样例扩展
- 产品化发行闭环

## 4. 实施顺序

### M1 到 M5

- M1：工程基线与根级脚本契约稳定
- M2：`shared-utils` 收敛类型契约、通用运行时与国际化（合并 `shared-types`、`shared-i18n`）
- M3：主题内核与 React 共享 UI 契约稳定（`design-tokens` 依赖从 `shared-types` 改为 `shared-utils`）
- M4：`shared-service` 平台内核基线稳定，子目录扁平化
- M5：`shared` 包废弃、`shared-types`/`shared-i18n`/`resources` 合并与 import 路径全量迁移，根文档与全仓验证结果一致

## 5. 任务拆解

### 任务 1：工程基线

- 根级约定文件齐全
- workspace 结构与脚本编排稳定
- 根级校验链路可用
- app / package 基础目录约束满足
- 文档层级与索引关系清晰

验证命令：

- `pnpm check:alias`
- `pnpm verify`

### 任务 2：shared-utils 收敛（ADR-011）

- 将 `packages/shared-types/src/` 下的类型契约迁入 `packages/shared-utils/src/`
- 将 `packages/shared-i18n/src/` 下的国际化运行时迁入 `packages/shared-utils/src/i18n/`
- `design-tokens` 依赖从 `@repo/shared-types` 改为 `@repo/shared-utils`
- `shared-ui` 中 `@repo/shared-types/ui-contract` 引用改为 `@repo/shared-utils/ui-contract`
- 删除 `packages/shared-types/`、`packages/shared-i18n/` 目录

验证命令：

- `pnpm -F @repo/shared-utils test && pnpm -F @repo/shared-utils typecheck && pnpm -F @repo/shared-utils build`

### 任务 3：主题与共享 UI

- 在 `packages/design-tokens` 落地主题注册表、主题运行时、CSS 变量生成和 Tailwind CSS 主题配置
- 在 `packages/shared-utils` 收敛跨层主题文案契约（`ThemeName`、`ThemeMode` 等）
- 在 `packages/shared-ui` 落地 `ThemeProvider`（基于 CSS 变量 + Tailwind dark 变体）、shadcn/ui 组件基线和显式样式子路径 `./style.css`
- 在 `apps/react-app` 中接入主题 store、`theme-init.js` 预注入、`ThemeProvider` 和示例页面替换
- 配置 Tailwind CSS（`@tailwindcss/vite` 插件或 PostCSS 方案）、移除 UnoCSS 依赖
- 同步根级脚本、测试聚合和主文档约束

验证命令：

- `pnpm -F @repo/design-tokens test && pnpm -F @repo/design-tokens typecheck && pnpm -F @repo/design-tokens build`
- `pnpm -F @repo/shared-ui test && pnpm -F @repo/shared-ui typecheck && pnpm -F @repo/shared-ui build`

### 任务 4：国际化

- 在 `packages/shared-utils/i18n` 落地国际化运行时
- 在 `apps/react-app` 落地 locale store、provider/hook、页面级词典与语言切换入口
- 去除 `ThemeModeSwitch`、`DataPanel` 等共享组件的内部硬编码英文
- 同步主文档与仓库约束中的 i18n 说明

验证命令：

- `pnpm -F @repo/shared-utils test && pnpm -F @repo/react-app test && pnpm -F @repo/react-app typecheck`

### 任务 5：包合并与 import 路径全量迁移

- 将 `apps/react-app` 中所有 `@repo/shared-types/*` 引用迁移至 `@repo/shared-utils/*`
- 将 `apps/react-app` 中所有 `@repo/shared-i18n` 引用迁移至 `@repo/shared-utils/i18n`
- 将 `shared-service/src/request/` 重导出子模块清理，消费者直接引用 `@repo/shared-utils/api-contract`
- 将 `shared-service/src/contracts/` + `src/runtime/` 合并为 `src/platform.ts`
- 移除 `packages/resources/` 目录，静态资源由 react-app 自行管理
- 全仓 `pnpm typecheck && pnpm test && pnpm build:shared && pnpm build:react` 通过

验证命令：

- `pnpm typecheck && pnpm test && pnpm build:shared && pnpm build:react`

## 6. 完成标准

- 工程基线、类型契约包、主题、共享 UI 与国际化基线按阶段边界完成收敛
- `shared` 包已移除，所有 import 路径迁移完毕
- `main -> bootstrap -> App` 启动链路稳定
- 根文档、总体设计与分阶段文档入口一致

## 7. 总体验证命令

- `pnpm check:alias`
- `pnpm verify`
