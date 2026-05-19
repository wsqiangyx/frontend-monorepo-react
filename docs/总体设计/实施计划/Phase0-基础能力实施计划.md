# Phase 0 基础能力实施计划

> 制定日期：2026-05-15
> 适用阶段：Phase 0
> 上游设计：`docs/专题文档/设计/Phase0-基础能力详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 1. 文档定位

本计划统一承载 Phase 0 的工程基线、主题与共享 UI、国际化三类实施任务，确保基础能力按依赖顺序落地，并保持与总体设计一致。

## 2. 输入 / 前置条件

- 总体边界：`docs/总体设计/项目总体设计方案.md`
- 上游设计：`docs/专题文档/设计/Phase0-基础能力详细设计.md`
- 正式主线为 `apps/react-app`、`packages/shared`、`packages/platform-core`、`packages/ui-tokens`、`packages/resources`、`packages/mock`、`packages/ui-react`
- 根脚本继续使用包装器：`scripts/vite.cjs`、`scripts/vitest.cjs`、`scripts/run-vite-bin.cjs`、`scripts/write-theme-init.mjs`

## 3. 范围 / 非目标

### 范围

- 根级仓库约定、workspace 结构与验证链路
- `packages/ui-tokens` 与 `packages/ui-react` 的主题 / 共享 UI 基线
- `packages/shared` 与 `apps/react-app` 的国际化基线
- 文档入口与导航关系收敛

### 非目标

- 平台共享内核
- Mock 数据域主链路
- 业务样例扩展
- 产品化发行闭环

## 4. 实施顺序

### M1 到 M4

- M1：工程基线与根级脚本契约稳定
- M2：主题内核与 React 共享 UI 契约稳定
- M3：共享 i18n 运行时与 React app 接线稳定
- M4：根文档与全仓验证结果一致

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

### 任务 2：主题与共享 UI

- 在 `packages/ui-tokens` 落地主题注册表、主题运行时、CSS 变量生成和 Ant Design 主题适配
- 在 `packages/shared` 收敛跨层主题文案契约 `@repo/shared/ui-contract`
- 在 `packages/ui-react` 落地 `ThemeProvider`、首批业务壳组件和显式样式子路径 `./style.css`
- 在 `apps/react-app` 中接入主题 store、`theme-init.js` 预注入、`ThemeProvider` 和示例页面替换
- 同步根级脚本、测试聚合和主文档约束

验证命令：

- `pnpm -F @repo/ui-tokens test && pnpm -F @repo/ui-tokens typecheck && pnpm -F @repo/ui-tokens build`
- `pnpm -F @repo/ui-react test && pnpm -F @repo/ui-react typecheck && pnpm -F @repo/ui-react build`

### 任务 3：国际化

- 在 `packages/shared` 落地 `@repo/shared/i18n`
- 在 `apps/react-app` 落地 locale store、provider/hook、页面级词典与语言切换入口
- 去除 `ThemeModeSwitch`、`DataPanel` 等共享组件的内部硬编码英文
- 同步主文档与仓库约束中的 i18n 说明

验证命令：

- `pnpm -F @repo/shared test && pnpm -F @repo/shared typecheck && pnpm -F @repo/shared build`
- `pnpm -F @repo/react-app test && pnpm -F @repo/react-app typecheck`

## 6. 完成标准

- 工程基线、主题、共享 UI 与国际化基线按阶段边界完成收敛
- `main -> bootstrap -> App` 启动链路稳定
- 根文档、总体设计与专题文档入口一致

## 7. 总体验证命令

- `pnpm check:alias`
- `pnpm verify`
