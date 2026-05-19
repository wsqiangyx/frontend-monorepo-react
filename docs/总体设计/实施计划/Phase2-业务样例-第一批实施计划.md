# Phase 2 业务样例第一批实施计划

> 制定日期：2026-05-15
> 适用阶段：Phase 2
> 上游设计：`docs/总体设计/详细设计/Phase2-业务样例-第一批详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 文档定位

本计划对应 Phase 2 第一批业务样例的页面落地顺序，目标是在不突破共享边界的前提下，把用户管理、角色管理、字典管理、系统元信息四类页面沉淀为 React 侧统一的管理页范式。

## 输入 / 前置条件

- Phase 1 平台基座已稳定：`packages/shared-service`、`packages/mock`、`apps/react-app`
- React 共享 UI 壳已稳定：`packages/shared-ui`
- 第一批数据接口已由 `@repo/mock` 提供：
  - `GET /api/system/users`
  - `GET /api/system/roles`
  - `GET /api/system/dictionaries`
  - `GET /api/system/dictionaries/:type`
  - `GET /api/system/meta`
- 真实页面文件已经存在：
  - `apps/react-app/src/views/UserListView.tsx`
  - `apps/react-app/src/views/RoleListView.tsx`
  - `apps/react-app/src/views/DictionaryListView.tsx`
  - `apps/react-app/src/views/SystemMetaView.tsx`

## 范围 / 非目标

### 范围

- React 侧路由落地：
  - `/system/users`
  - `/system/roles`
  - `/system/dictionaries`
  - `/system/meta`
- React 侧统一采用：
  - `PageHeader`
  - `FilterBar`
  - `DataPanel`
  - `PermissionGate`
- React 服务层、页面层和基础测试
- 菜单与权限码接线同步收敛

### 非目标

- 不做新增、编辑、删除的完整持久化闭环
- 不做复杂弹窗表单、审批流、导入导出
- 不在页面内新增平台级状态机或权限模型
- 不反向修改 `packages/shared-service` 与 `packages/mock` 的正式边界

## 实施原则

1. 页面先复用平台壳与共享组件，再补页面差异，不重新造一套 UI 范式。
2. 路由路径、页面标题、权限码命名在 React 侧保持统一。
3. 服务层负责请求与 DTO 归一，页面层负责组合渲染，不把 fetch 细节散落进视图组件。
4. 先把查询和展示跑通，再补最小交互，不提前做重表单能力。
5. 用户可见文案优先经过 React app 自己的 i18n 词典，不回退为视图内硬编码。

## 里程碑

- M1：React 路由、菜单与权限入口对齐
- M2：React 服务层与查询参数模型对齐
- M3：四个页面的统一范式落地完成
- M4：权限控制与空态、异常态补齐
- M5：React 测试通过，`pnpm verify` 可覆盖

## 任务拆解

### 任务 1：统一 React 路由、菜单与权限入口

目标：确保 React app 从同一路由和权限口径进入第一批样例页面。

- 文件：`apps/react-app/src/router/index.tsx`
- 需确认四个路径：
  - `/system/users`
  - `/system/roles`
  - `/system/dictionaries`
  - `/system/meta`
- 路由 `handle` 至少保持：
  - `title`
  - `permissionCodes`
  - `menuKey`

关联文件：

- `apps/react-app/src/services/menu-service.ts`
- `apps/react-app/src/platform/navigation-store.ts`
- `apps/react-app/src/platform/permission-store.ts`

验证命令：

- `pnpm -F @repo/react-app test -- --reporter=verbose`

### 任务 2：统一 React 服务层与查询模型

目标：让“请求谁、怎么分页、怎么筛选”先收敛成稳定服务层，再给页面复用。

需复核或补齐：

- `apps/react-app/src/services/user-service.ts`
- `apps/react-app/src/services/role-service.ts`
- `apps/react-app/src/services/dictionary-service.ts`
- `apps/react-app/src/services/system-meta-service.ts`
- `apps/react-app/src/services/shared.ts`

统一输出：

- 请求函数
- 查询参数类型
- 列表返回值类型

验证命令：

- `pnpm -F @repo/react-app typecheck`

### 任务 3：用户管理页落地

目标：形成第一张完整的列表页样板，可复用到其他管理页。

- 文件：`apps/react-app/src/views/UserListView.tsx`

实现结构：

- `PageHeader`
- `FilterBar`
- `DataPanel`
- 表格 / 列表内容
- 需要操作位时，用 `PermissionGate` 包裹按钮或文案占位

最小交互要求：

- 首次进入自动加载第一页
- 关键字查询可触发重新拉取
- 重置后恢复默认条件
- 空列表显示空态，不直接展示空表格

验证命令：

- `pnpm -F @repo/react-app test -- --reporter=verbose App`

### 任务 4：角色、字典、系统元信息页复用同一范式

目标：在首张样板页稳定后，把统一模式扩展到剩余三类页面。

文件：

- `apps/react-app/src/views/RoleListView.tsx`
- `apps/react-app/src/views/DictionaryListView.tsx`
- `apps/react-app/src/views/SystemMetaView.tsx`

要求：

- 继续复用 `PageHeader`、`FilterBar`、`DataPanel`、`PermissionGate`
- 路由、页面标题、权限码命名保持一致
- 字典页支持“类型列表 + 指定 type 明细”的两段式查询
- 系统元信息页优先展示只读型平台元数据

验证命令：

- `pnpm -F @repo/react-app typecheck`

## 验证命令

- `pnpm -F @repo/react-app test -- --reporter=verbose`
- `pnpm -F @repo/react-app typecheck`
- `pnpm verify`
