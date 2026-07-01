# @repo/shared-service

平台内核：承载框架无关的业务规则、状态模型与领域函数。

## 职责

- 应用启动状态机（`app`）
- 认证会话模型（`auth`）
- 菜单树与路由元数据（`navigation`）
- 权限码与权限集判断（`permissions`）
- 多标签页模型（`workspace-tabs`）
- 平台版本契约与运行时标识（`platform`）

## 约束

- **不依赖 React、DOM 或任何 UI 框架**（ADR-001）
- 仅依赖 `@repo/shared-utils`
- 只导出类型、纯函数和工厂函数

## 导出

```typescript
export * from '@repo/shared-service'
export * from '@repo/shared-service/auth'
export * from '@repo/shared-service/navigation'
export * from '@repo/shared-service/permissions'
export * from '@repo/shared-service/workspace-tabs'
```

## 命令

```bash
pnpm -F @repo/shared-service test
pnpm -F @repo/shared-service typecheck
pnpm -F @repo/shared-service build
```
