# Phase 1 中后台平台基座实施计划

> 制定日期：2026-05-15
> 适用阶段：Phase 1
> 上游设计：`docs/专题文档/设计/Phase1-中后台平台基座详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 1. 文档定位

本计划统一承载 Phase 1 的平台基座、平台内核模块与 Mock 模块实施任务，确保共享层、Mock 层与 React 宿主接线按依赖顺序落地。

## 2. 输入 / 前置条件

- 总体边界：`docs/总体设计/项目总体设计方案.md`
- 上游设计：`docs/专题文档/设计/Phase1-中后台平台基座详细设计.md`
- Phase 0 已稳定：工程基线、主题内核、React 共享 UI、国际化基线
- `main` 只负责 MSW 启动判断，`bootstrap` 只负责主题 / Provider / 挂载
- `packages/*` 对外 `exports` 只指向 `dist`
- `pnpm check:alias`、`pnpm verify:mock-worker`、`pnpm verify` 的契约不能被破坏

## 3. 范围 / 非目标

### 范围

- `packages/platform-core` 的平台共享内核
- `packages/mock` 的平台正式后端替身
- `packages/ui-react` 的平台壳组件
- `apps/react-app` 的平台接线、路由、布局、启动链路和最小页面
- 必要时同步根文档与总体设计文档

### 非目标

- 真实后端联调
- 完整业务样板扩展
- `create-*` 形式的 CLI 产品化
- 低代码或代码生成体系

## 4. 实施顺序

### M1 到 M4

- M1：`packages/platform-core` 的骨架、模型和测试先稳定
- M2：`packages/mock` 的平台级接口和场景人格先稳定
- M3：React 侧能在纯 Mock 环境下完成登录、初始化、菜单和多标签页主链路
- M4：根文档、专题文档和全仓验证结果一致

## 5. 任务拆解

### 任务 1：平台基座接线

- 共享层优先，再接 Mock 层，再进入 React 宿主接线
- React 接线层只做宿主装配，不复制平台规则
- 文档同步只在公共契约变化时推进

验证命令：

- `pnpm -F @repo/react-app test && pnpm -F @repo/react-app typecheck`

### 任务 2：`packages/platform-core`

- 落地 `app`、`auth`、`navigation`、`permissions`、`workspace-tabs`、`request`、`contracts`、`runtime`
- 收敛平台初始化、认证、导航、权限、多标签页与请求契约的共享规则
- 补齐对应模块测试与统一导出面

验证命令：

- `pnpm -F @repo/platform-core test`
- `pnpm -F @repo/platform-core typecheck`
- `pnpm -F @repo/platform-core build`

### 任务 3：`packages/mock`

- 落地 `auth`、`account`、`navigation`、`dashboard`、`dictionary`、`system-meta` 六类 Mock 数据域
- 收敛人格模型、统一响应 helper 与 handler 导出面
- 保持 browser worker 与 Node server 行为一致

最小实现要求：

- `POST /api/auth/login`
- 根据用户名映射人格
- 通过 `Authorization` 或等价会话数据解析 persona
- `navigation`、`permissions`、`dashboard`、`account/profile` 等接口基于 persona 返回差异化数据

验证命令：

- `pnpm -F @repo/mock test`
- `pnpm -F @repo/mock typecheck`
- `pnpm -F @repo/mock build`
- `pnpm verify:mock-worker`

## 6. 完成标准

- 平台共享内核、Mock 替身后端与 React 宿主接线按阶段边界完成收敛
- 平台规则仍集中在共享层，不回流到 app 私有实现
- 根文档、总体设计与专题文档入口一致

## 7. 总体验证命令

- `pnpm check:alias`
- `pnpm verify:mock-worker`
- `pnpm verify`
