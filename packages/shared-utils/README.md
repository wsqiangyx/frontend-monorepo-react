# @repo/shared-utils

通用工具、类型契约、国际化运行时与 HTTP 客户端封装。

## 职责

- 平台无关的通用工具函数
- UI 契约类型（`ui-contract`）
- API 响应契约（`api-contract`）
- 路由定义（`routes`）
- 国际化运行时（`i18n`）
- 基于 ky 的 HTTP 客户端（`http`）

## 约束

- **零 workspace 依赖**（ADR-011）
- 不依赖 React、DOM 或任何 UI 框架

## 导出

```typescript
export * from '@repo/shared-utils'
export * from '@repo/shared-utils/http'
export * from '@repo/shared-utils/ui-contract'
export * from '@repo/shared-utils/api-contract'
export * from '@repo/shared-utils/routes'
export * from '@repo/shared-utils/i18n'
```

## 命令

```bash
pnpm -F @repo/shared-utils test
pnpm -F @repo/shared-utils typecheck
pnpm -F @repo/shared-utils build
```
