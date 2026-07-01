# @repo/shared-ui

共享 UI 组件库：基于 React + Tailwind CSS 的中后台通用组件与 Provider。

## 职责

- `ThemeProvider` — 主题注入与切换
- 应用壳组件：`AppShell`、`AdminShell`、`PageContainer`、`SideMenu`、`TopNav`
- 数据展示：`DataPanel`、`MetricCard`、`StatusTag`
- 权限控制：`PermissionGate`
- 异常与空态：`EmptyState`、`ExceptionState`
- 标签页：`TabWorkspace`

## 约束

- 依赖 React / React DOM（由宿主应用提供）
- 可依赖 `@repo/shared-service`、`@repo/shared-utils`、`@repo/design-tokens`
- 不直接调用 HTTP 客户端或业务 API

## 导出

```typescript
import { ThemeProvider, PermissionGate, AppShell } from '@repo/shared-ui'
import '@repo/shared-ui/style.css'
```

## 命令

```bash
pnpm -F @repo/shared-ui test
pnpm -F @repo/shared-ui typecheck
pnpm -F @repo/shared-ui build
```
