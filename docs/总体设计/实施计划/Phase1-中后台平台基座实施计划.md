# Phase 1 中后台平台基座实施计划

> 制定日期：2026-05-15
> 最近修订：2026-07-02
> 适用阶段：Phase 1
> 上游设计：`docs/总体设计/详细设计/Phase1-中后台平台基座详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 1. 文档定位

本计划统一承载 Phase 1 的平台基座、平台内核模块与 Mock 模块实施任务，确保共享层、Mock 层与 React 宿主接线按依赖顺序落地。

## 2. 输入 / 前置条件

- 总体边界：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`
- 上游设计：`docs/总体设计/详细设计/Phase1-中后台平台基座详细设计.md`
- Phase 0 已稳定：工程基线、主题内核、React 共享 UI、国际化基线
- `main` 只负责 MSW 启动判断，`bootstrap` 只负责主题 / Provider / 挂载
- `packages/*` 对外 `exports` 只指向 `dist`
- `pnpm check:alias`、`pnpm verify:mock-worker`、`pnpm verify` 的契约不能被破坏

## 3. 范围 / 非目标

### 范围

- `packages/shared-service` 的平台共享内核
- `packages/mock` 的平台正式后端替身
- `packages/shared-ui` 的平台壳组件
- `apps/react-app` 的平台接线、路由、布局、启动链路和最小页面
- 必要时同步根文档与总体设计文档
- `packages/cross-platform-utils` 跨端运行时适配层（ADR-012）
- `apps/taro-miniapp` Taro 小程序宿主（ADR-012）

### 非目标

- 真实后端联调
- 完整业务样板扩展
- `create-*` 形式的 CLI 产品化
- 低代码或代码生成体系
- Expo 移动端宿主（`apps/expo-mobile`）—— ADR-012 已规划，当前 Phase 1 仅聚焦 Taro 小程序

## 4. 实施顺序

### M1 到 M5

- M1：`packages/shared-service` 的骨架、模型和测试先稳定
- M2：`packages/mock` 的平台级接口和场景人格先稳定
- M3：React 侧能在纯 Mock 环境下完成登录、初始化、菜单和多标签页主链路
- M4：根文档、分阶段文档和全仓验证结果一致
- M5：`packages/cross-platform-utils` + `apps/taro-miniapp` 跨端基座创建与验证

## 5. 任务拆解

### 任务 1：平台基座接线

- 共享层优先，再接 Mock 层，再进入 React 宿主接线
- React 接线层只做宿主装配，不复制平台规则
- 文档同步只在公共契约变化时推进

验证命令：

- `pnpm -F @repo/react-app test && pnpm -F @repo/react-app typecheck`

### 任务 2：`packages/shared-service`

- 落地 `app`、`auth`、`navigation`、`permissions`、`workspace-tabs`、`platform`
- 收敛平台初始化、认证、导航、权限、多标签页与请求契约的共享规则
- `shared-service` 仅通过 `shared-utils` 暴露的 `HttpClient` 接口访问 HTTP 能力，不直接依赖 `ky` 或 `axios`（ADR-008）
- `shared-service/request/` 重导出子模块已清理，消费者直接引用 `@repo/shared-utils`（ADR-010）
- 补齐对应模块测试与统一导出面

验证命令：

- `pnpm -F @repo/shared-service test`
- `pnpm -F @repo/shared-service typecheck`
- `pnpm -F @repo/shared-service build`

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

### 任务 4：跨端基座（Phase 1 扩展 · ADR-012）

#### 4a：`packages/cross-platform-utils`

- 创建 `PlatformStorage` 接口抽象（`getItem`/`setItem`/`removeItem`/`clear`）与 Taro 适配器
- 创建 `TaroHttpClient`（基于 `Taro.request`，统一 request/response 拦截、超时、重试）
- 创建 `PlatformThemeRuntime`（`Taro.getSystemInfo`、`Taro.onThemeChange`、`Taro.setNavigationBarColor`）
- 创建 `PlatformLocaleManager`（`Taro.getSystemInfo` 语言、`Taro.setStorageSync` 持久化）
- 仅依赖 `@repo/shared-utils` + `@repo/design-tokens`，框架无关
- `@tarojs/taro` 为 optional peerDependency

验证命令：

- `pnpm -F @repo/cross-platform-utils test`
- `pnpm -F @repo/cross-platform-utils typecheck`
- `pnpm -F @repo/cross-platform-utils build`

#### 4b：`apps/taro-miniapp`

- 创建 Taro 3+/4 小程序宿主工程目录
- 配置微信小程序（weapp）与 H5 双输出
- 启动链：`app.ts` → `app.config.ts` → 页面组件
- 整合 `cross-platform-utils`（HTTP、Storage、Theme、Locale）
- 消费 `shared-service` 平台内核（auth、navigation、permissions）
- 使用 React 18（与 catalog 的 React 19 隔离）

验证命令：

- `pnpm -F @repo/taro-miniapp typecheck`
- `pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp build:h5`
- `pnpm -F @repo/taro-miniapp test`（如已有测试）

#### 4c：根配置同步

- `scripts/` 新增 `build:cross-platform-utils`、`dev:taro:weapp`、`build:taro:weapp`、`dev:taro:h5`、`build:taro:h5`
- `pnpm-workspace.yaml` catalog 新增 Taro 相关依赖（`@tarojs/taro`、`@tarojs/components`、`@tarojs/cli` 等）
- `STATUS.yaml` 登记 `cross-platform-utils: candidate`、`taro-miniapp: candidate`
- `vitest.config.ts` 聚合配置（如使用 Projects 模式）纳入 taro-miniapp
- 同步至 `check:status` 的检查范围

验证命令：

- `pnpm check:status`（确认 STATUS.yaml 与根脚本一致）
- `pnpm verify`（确保现有主链路不被破坏）

## 6. 完成标准

- 平台共享内核、Mock 替身后端与 React 宿主接线按阶段边界完成收敛
- 平台规则仍集中在共享层，不回流到 app 私有实现
- 根文档、总体设计与分阶段文档入口一致
- 跨端基座（`cross-platform-utils` + `taro-miniapp`）目录创建并通过验证
- `cross-platform-utils` 子模块（storage/http/theme/locale）实现 Taro 适配器
- `taro-miniapp` 可输出 H5 构建产物、类型检查通过
- 现有 Web 主线（`build:react` / `verify`）不受跨端新增目录影响
- `STATUS.yaml` 正确登记新包/应用的状态

## 7. 总体验证命令

- `pnpm check:alias`
- `pnpm verify:mock-worker`
- `pnpm verify`
