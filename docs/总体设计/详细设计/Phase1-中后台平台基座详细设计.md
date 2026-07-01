# Phase 1 中后台平台基座详细设计

> 制定日期：2026-05-15
> 最近修订：2026-06-30
> 适用阶段：Phase 1
> 文档性质：中后台平台基座阶段详细设计
> 上游设计：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`

## 1. 文档定位

本文档描述 Phase 1 的平台基座设计，覆盖：

- 平台基座
- 平台内核模块
- Mock 模块

本文档只维护平台基座阶段的设计目标、边界、共享契约与模块职责，不承接任务拆解或完成态记录。

## 2. 阶段目标与边界

Phase 1 的目标是把前端 monorepo 变成一个可演练的中后台平台基座，而不是单纯的 React 页面集合。

本阶段要建立：

- React 应用壳
- 平台共享内核
- Mock 驱动的数据链路
- 统一启动链路
- 平台级权限与菜单契约

## 3. 1.1 平台基座

### 3.1 核心边界

- `packages/shared-utils` 承载通用工具、类型契约与国际化运行时
- `packages/shared-service` 承载平台语义
- `packages/mock` 承载平台替身后端
- `packages/design-tokens` 承载主题与语义 token
- `packages/shared-ui` 承载 React 共享 UI 壳
- `apps/react-app` 只做接线与页面编排

> **注意**：`packages/shared` 已废弃（ADR-010），`packages/shared-types`、`packages/shared-i18n`、`packages/resources` 已合并（ADR-011）。

### 3.2 平台启动链路

统一链路保持：

`index.html -> /theme-init.js -> main -> bootstrap -> App`

职责划分：

- `index.html`：首屏主题预注入
- `main`：是否启用 MSW
- `bootstrap`：主题 Provider、UI 样式、应用挂载
- `App`：页面路由与业务编排

### 3.3 共享 UI 壳

`packages/shared-ui` 负责：

- 主题 Provider
- AppShell / AdminShell
- PageHeader
- FilterBar
- DataPanel
- EmptyState
- StatusTag
- ThemeModeSwitch
- PermissionGate
- ExceptionState

## 4. 1.2 平台内核模块

### 4.1 总体约束

- `packages/shared-service` 是平台语义的唯一正式收敛层
- 只承载框架无关的共享规则，不承载 React、DOM 副作用
- 所有能力只导出类型、纯函数和工厂函数

### 4.2 模块划分

- `app`
- `auth`
- `navigation`
- `permissions`
- `workspace-tabs`
- `platform`（平台版本契约与运行时环境标识）

> 注：`request/` 重导出子模块已清理，消费者直接引用 `@repo/shared-utils/api-contract`（ADR-010 → ADR-011）。

### 4.3 设计决策

应用初始化：

- 使用四态状态机：`idle`、`bootstrapping`、`ready`、`error`

认证态：

- 使用三态认证模型：`anonymous`、`authenticated`、`expired`

导航模型：

- 菜单树与路由元信息分离
- `PlatformMenuNode` 表达导航结构
- `PlatformRouteMeta` 表达页面配置

权限模型：

- 权限码格式统一为 `system:domain:action`
- 页面、菜单、按钮三层权限统一收敛

多标签页模型：

- 标签页是运行时状态，不是路由本体
- 支持固定、关闭、缓存与参数差异

请求契约：

- 统一 response envelope
- 统一分页模型
- 统一错误模型
- `shared-service` 仅通过 `shared-utils` 暴露的 `HttpClient` 接口访问 HTTP 能力，不直接依赖 `ky` 或 `axios`（ADR-008）
- `shared-service/request/` 重导出子模块已清理，消费者直接引用 `@repo/shared-utils/api-contract`（ADR-010 → ADR-011）
- 宿主层通过 `createPlatformClient()` 工厂创建 HTTP 客户端，集中管理 token 注入与 401 拦截
- 401 响应自动触发全局处理器：清除 auth session → 重定向 `/login`

服务端状态消费：

- 宿主层通过 TanStack Query 的 `useQuery` / `useMutation` / `useInfiniteQuery` 消费 API（ADR-009）
- 禁止在组件中直接调用 `httpClient`，所有数据请求必须通过 TanStack Query 层
- `shared-service` 保持框架无关，不直接依赖 TanStack Query

## 5. 1.3 Mock 模块

### 5.1 总体约束

- `packages/mock` 是 Phase 1 / Phase 2 的正式后端替身，不是演示附件
- 浏览器开发态与 Node 测试态必须复用同一套 handlers
- 正式导出面保持为 `@repo/mock/browser`、`@repo/mock/server`、`@repo/mock/handlers`
- Mock 响应类型（`ApiResponse`、`PaginatedData`）从 `@repo/shared-utils/api-contract` 导入，不在本地重复定义
- MSW 版本通过 `catalog:` 引用，与 `pnpm-workspace.yaml` 集中管理对齐

### 5.2 覆盖范围

- `auth`
- `account`
- `navigation`
- `dashboard`
- `dictionary`
- `system-meta`

### 5.3 设计决策

场景人格：

- 统一使用人格驱动返回差异
- 正式人格键：
  - `super-admin`
  - `operator`
  - `auditor`
  - `guest`

响应契约：

- 正式 envelope：`{ success, code, message, data, requestId?, timestamp }`
- 正式分页结构：`{ items, total, page, pageSize }`
- 契约类型来源于 `@repo/shared-utils/api-contract`，mock handlers 通过 `import type` 复用，确保 mock 数据结构与真实 API 消费者类型一致

## 6. Phase 1 总体验收标准

- React 应用壳可运行
- 平台初始化链路可演练
- 权限与菜单契约可验证
- Mock 驱动主链路闭环
- React 共享 UI 壳可复用
- 平台共享规则未漂移到 app 私有实现
