# @repo/mock

Mock 服务：基于 MSW 的浏览器 + Node 双环境 API 模拟。

## 职责

- 浏览器端 MSW worker（`browser`）
- Node 端 MSW server（`server`）
- MSW handlers 集合（`handlers`）
- 请求透传工具（`passthrough`）
- Phase 1 平台人设定义（`personas`）

## 约束

- 类型从 `@repo/shared-utils/api-contract` 获取，不在本地重复定义
- `msw` 版本通过 `catalog:` 集中管理
- 浏览器端 worker 禁止在生产环境启动

## 导出

```typescript
import { worker } from '@repo/mock/browser'
import { server } from '@repo/mock/server'
import { handlers } from '@repo/mock/handlers'
import { shouldPassthrough } from '@repo/mock/passthrough'
```

## 命令

```bash
pnpm -F @repo/mock test
pnpm -F @repo/mock typecheck
pnpm -F @repo/mock build
```
