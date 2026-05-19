# Phase 2 业务样例第一批详细设计

> 制定日期：2026-05-15
> 适用阶段：Phase 2
> 文档性质：第一批业务样例详细设计
> 上游设计：`docs/总体设计/项目总体设计方案.md`

## 1. 设计定位

Phase 2 的目标是在平台基座上沉淀第一批可复用的管理页范式，不反向改写平台共享边界。

## 2. 第一批范围

- 用户管理
- 角色管理
- 字典管理
- 系统元信息

### 2.1 路由范围

建议统一为：

- `/system/users`
- `/system/roles`
- `/system/dictionaries`
- `/system/meta`

## 3. 设计原则

- 复用平台契约
- 复用共享 UI 壳
- 以 React app 为唯一正式样例宿主
- 不引入完整 CRUD 持久化

### 3.1 明确不做

- 不做完整持久化
- 不做复杂表单校验
- 不做导入导出
- 不做审批流

## 4. 前置依赖与稳定性假设

本设计假定 Phase 1 已提供以下稳定出口：

- `@repo/platform-core` 的平台菜单、权限、请求契约与错误模型
- `@repo/mock` 的第一批业务样例接口与统一分页结构
- `@repo/ui-react` 的 `PageHeader`、`FilterBar`、`DataPanel`、`PermissionGate` 等共享壳组件
- `apps/react-app` 的平台壳、路由装配与权限接线已稳定

## 5. 页面范式

- PageHeader
- FilterBar
- DataPanel
- PermissionGate

建议统一结构：

`PageHeader -> FilterBar -> DataPanel -> Table/List Content`

## 6. 权限与数据

- 基于 Phase 1 的权限码与人格矩阵
- 基于 Phase 1 的 Mock 接口

建议首批直接复用：

- `GET /api/system/users`
- `GET /api/system/roles`
- `GET /api/system/dictionaries`
- `GET /api/system/dictionaries/:type`
- `GET /api/system/meta`

## 7. 验收标准

- React 侧有可运行样板
- 页面契约一致
- 权限控制生效
- Mock 演练正常
