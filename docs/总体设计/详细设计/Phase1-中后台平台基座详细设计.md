# Phase 1 中后台平台基座详细设计

> 制定日期：2026-05-15
> 最近修订：2026-07-02
> 适用阶段：Phase 1
> 文档性质：中后台平台基座阶段详细设计
> 上游设计：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`

## 1. 文档定位

本文档描述 Phase 1 的平台基座设计，覆盖：

- 平台基座
- 平台内核模块
- Mock 模块
- 跨端运行时适配层（`cross-platform-utils`）
- Taro 小程序宿主（`taro-miniapp`）

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
- `packages/cross-platform-utils` 承载跨端运行时适配层（ADR-012）
- `apps/taro-miniapp` 承载 Taro 小程序宿主（ADR-012）

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
- 跨端基座（`cross-platform-utils` + `taro-miniapp`）目录结构正确、类型检查通过

---

## 7. 跨端基座设计（Phase 1 扩展 · ADR-012）

### 7.1 设计目标

在保持 Web 中后台基线稳定的前提下，让 Taro 小程序宿主能最大程度复用既有平台规则（认证、菜单、权限、API 契约、国际化），同时使用小程序运行时最适合的 UI 与网络方案。

### 7.2 `packages/cross-platform-utils` – 跨端运行时适配层

**定位**：框架无关的跨端运行时适配层，封装小程序与 App 宿主与平台原生能力的差异。不依赖 React、Taro 或任何 UI 框架。

**模块接口设计**：

#### PlatformStorage

```typescript
interface PlatformStorage {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}
```

- Taro 适配器：基于 `Taro.getStorage` / `Taro.setStorage` / `Taro.removeStorage` / `Taro.clearStorage`
- Web 适配器（预留）：基于 `localStorage`
- 错误处理：统一 `PlatformStorageError`，Taro 存储超限时提供友好提示

#### TaroHttpClient

```typescript
interface TaroHttpClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  interceptors?: {
    request?: (config: Taro.request.Option) => Taro.request.Option
    response?: (res: Taro.request.SuccessCallbackResult) => unknown
  }
}
```

- 基于 `Taro.request` 封装，统一 request/response 拦截器
- 支持超时、重试（配合 `shared-utils` 的重试策略）
- 不依赖 ky（Web 宿主使用 ky，小程序使用 Taro.request，通过 `cross-platform-utils` 隔离差异）
- 响应格式对齐 `ApiResponse<T>`（从 `@repo/shared-utils/api-contract` 获取）

#### PlatformThemeRuntime

- `getSystemTheme(): Promise<'dark' | 'light'>` — 基于 `Taro.getSystemInfo` 获取系统主题
- `onThemeChange(callback: (theme: 'dark' | 'light') => void): void` — 基于 `Taro.onThemeChange`
- `setNavigationBarColor(color: string): Promise<void>` — 基于 `Taro.setNavigationBarColor`
- 消费 `@repo/design-tokens` 的原始 token 值（颜色变量）

#### PlatformLocaleManager

- `getSystemLocale(): Promise<string>` — 基于 `Taro.getSystemInfo` 获取设备语言
- `setLocale(locale: string): Promise<void>` — 通过 `Taro.setStorageSync` 持久化
- `getLocale(): Promise<string>` — 通过 `Taro.getStorageSync` 读取
- 与 `@repo/shared-utils/i18n` 的 `createTranslator` 结合使用

### 7.3 `apps/taro-miniapp` – Taro 小程序宿主

**目录结构**：

```
apps/taro-miniapp/
├─ config/                   # Taro 构建配置
│  ├─ dev.ts
│  ├─ index.ts
│  └─ prod.ts
├─ src/
│  ├─ app.ts                 # 应用入口（Taro App 类）
│  ├─ app.config.ts          # 页面注册与窗口配置
│  ├─ app.scss               # 全局样式
│  ├─ pages/                 # 页面组件
│  │  └── index/
│  │     ├─ index.tsx
│  │     └── index.config.ts
│  ├─ services/              # 服务层（封装 shared-service API 调用）
│  ├─ stores/                # zustand stores
│  ├─ i18n/                  # i18n 初始化
│  └─ constants/             # 环境常量
├─ package.json              # React 18 + Taro 3/4 独立依赖
├─ tsconfig.json
├─ vitest.config.ts
└─ project.config.json       # 微信小程序项目配置
```

**启动链**：

```
app.ts (App 生命周期) → app.config.ts (页面注册) →
各 Page 组件 (useDidShow/useLoad) → services/ 调用 shared-service API →
stores/ 管理状态 → cross-platform-utils 处理平台差异
```

**HTTP 客户端策略**：

- 通过 `cross-platform-utils/http` 的 `TaroHttpClient` 发起请求
- 开发态可在 `TaroHttpClient` 的 request 拦截器中注入本地 mock 数据，或代理到 Web 开发服务器
- 无需 MSW（小程序环境不支持 Service Worker）

**Mock 拦截策略**：

- Phase 1 不实现完整的跨端 Mock 方案（`cross-platform-mock` 包为 ADR-012 规划中）
- 开发态通过 `TaroHttpClient` 的 request 拦截器返回 fixture 数据
- 暂不依赖 `@repo/mock`（MSW handlers 无法在 Taro 环境运行）

**与现有共享包的复用边界**：

| 共享包                 | taro-miniapp 复用方式                                               |
| ---------------------- | ------------------------------------------------------------------- |
| `shared-utils`         | 类型契约（api-contract, ui-contract）、国际化运行时、通用工具       |
| `shared-service`       | 平台内核：认证、菜单、权限、标签页模型的纯函数/工厂                 |
| `design-tokens`        | 原始 token 值（颜色、字号），通过 `cross-platform-utils/theme` 适配 |
| `shared-ui`            | **不复用**（基于 shadcn/ui + Tailwind，Web 专用）                   |
| `mock`                 | **不复用**（MSW 在小程序环境中不可用）                              |
| `cross-platform-utils` | **直接依赖**（跨端运行时适配层）                                    |

### 7.4 依赖方向

```
shared-utils (零 workspace 依赖)
  ↑
cross-platform-utils (依赖 shared-utils + design-tokens)
  ↑
taro-miniapp (依赖 cross-platform-utils + shared-service + shared-utils)
```

### 7.5 构建脚本

```
build:cross-platform-utils = pnpm -F @repo/cross-platform-utils build
dev:taro:weapp = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp dev:weapp
build:taro:weapp = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp build:weapp
dev:taro:h5 = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp dev:h5
build:taro:h5 = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp build:h5
```

注意：所有 taro 构建命令均须先构建 `cross-platform-utils`（其依赖的共享包不受 taro 构建影响）。

### 7.6 跨端验收标准

- `cross-platform-utils` 四个子模块（storage/http/theme/locale）构建通过
- `taro-miniapp` H5 构建产物可运行
- 现有 Web 基线（`build:react` / `verify`）不受影响
- React 18 与 React 19 版本隔离不冲突
