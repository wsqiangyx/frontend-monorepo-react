# Changelog

All notable changes to this template repository should be documented in this file.

The format is based on Keep a Changelog, but the repository currently maintains it manually because release automation has not been finalized.

## [Unreleased]

### Added

- Git template oriented README and Day 0 checklist
- Template initialization and pruning guide
- Template env examples for root and React app
- Placeholder governance assets for license and changelog maintenance
- 统一 HTTP 客户端工厂 `createPlatformClient()`，集中管理 baseURL 与 token 注入（`apps/react-app/src/services/http-client.ts`）
- 401 全局拦截器：任意 API 请求返回 401 时自动清除会话并重定向到 `/login`
- Vite `closeBundle` 插件，生产构建自动排除 `mockServiceWorker.js`
- 所有 View 组件的 `useQuery` error 状态处理
- 所有 Zustand store 异步 action 的 try/catch 错误处理
- `packages/shared-utils/http/uploadWithProgress` 新增可选的 `maxFileSize` 与 `allowedMimeTypes` 校验，防御异常文件上传
- `.gitignore` 新增 `.env.*` 模式，防止环境变量文件泄露

### Changed

- Documentation now explicitly treats the repository as a dual-app Git template baseline
- Engineering plan and maintenance constraints now distinguish Git template scope from a future `create-*` CLI phase
- 所有 Zustand store（auth-store、permission-store、navigation-store）统一从 `@/services/shared` 导入 `api`，不再各自创建 `createHttpClient` 实例
- `packages/mock` 新增 `@repo/shared-utils` 依赖，从 `@repo/shared-utils/api-contract` 导入 `ApiResponse`/`PaginatedData`，不再本地重复定义类型
- `packages/mock` 的 `msw` 版本从硬编码改为 `catalog:` 引用，与 `pnpm-workspace.yaml` 集中管理对齐
- `packages/shared-service` Vite 构建移除 `contracts/` 和 `runtime/` 子路径入口（内容已由 ADR-011 扁平化至 `platform.ts`）
- `ProfileView` 重构为 key 模式子组件，消除渲染阶段 setState 反模式
- `DictionaryListView` 改用派生状态替代 queryFn 中的 setState
- `RoleListView` 直接消费 `useQuery` 返回数据，移除 queryFn 中的 setState

### Removed

- 删除 `apps/react-app/src/stores/user.ts`（零消费者的死代码）
