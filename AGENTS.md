# 维护指南

本文件面向后续维护者、自动化工具和编码代理，定义这个仓库中不应被日常修改破坏的边界。

## 文档边界

当前仓库说明文档采用“主文档 + 索引文档”结构：

- 根 `README.md`：模板消费者使用主文档
- 根 `AGENTS.md`：维护约束主文档
- 根 `TEMPLATE.md`：模板 Day 0 检查清单
- 根 `LICENSE`：模板期许可证占位或正式许可证
- 根 `CHANGELOG.md`：模板变更日志
- 根 `.env.example`：模板环境变量清单入口
- `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`：唯一上游概要设计主文档
- `docs/教程/README.md`：教程索引页
- `docs/教程/模板初始化与裁剪指南.md`：模板初始化与裁剪执行手册
- `docs/规范/`：独立规范文档目录
- `docs/总体设计/详细设计/`：分阶段详细设计目录
- `docs/总体设计/实施计划/`：分阶段实施计划目录

如果修改仓库规则、模板使用方式、初始化步骤、阶段目标、正式公共契约或架构边界，优先修改根 `README.md`、根 `AGENTS.md`、根 `TEMPLATE.md` 与 `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`。涉及初始化与残留清理流程时，还必须同步 `docs/教程/模板初始化与裁剪指南.md`。涉及主题、共享 UI、国际化或平台基座正式契约时，还必须同步对应分阶段详细设计 / 实施计划文档。

## 仓库定位

这是一个前端 monorepo 基线仓库，同时正在被产品化为可复用的 `Git 模板仓库` 与中后台前端平台脚手架，不是单应用仓库。

当前正式范围包括：

- 一个正式应用壳：`apps/react-app`
- 五个正式共享包：`packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui`
- 一套统一工具链基线：TypeScript、Vite、Vitest、ESLint、Stylelint、Prettier、Husky、Commitlint、Tailwind CSS

当前工作区现状补充说明：

- `apps/` 目录下当前还存在 `apps/react-screen-designer`
- 它属于可视化专题子应用的预研 / 占位目录，不等同于已经进入正式默认范围
- 在根 `package.json`、根 `vitest.config.ts`、根 `README.md`、本文件与总体设计主文档未成组同步之前，不要把它当成已纳入仓库级默认验证链路的正式应用

当前总体设计已经把主线收敛为：

- `React-only、后端无关、Mock 驱动` 的中后台平台基座
- 在平台契约之上逐步沉淀业务样例
- 最后再补齐模板产品化与发布闭环

当前推荐架构模式补充为：

- `apps/react-app` 是正式宿主应用，也是 composition root
- `packages/shared-service` 是平台共享内核
- `packages/shared-utils` 是基础共享层（类型契约 + 通用运行时 + 国际化）
- `packages/design-tokens` 是视觉语义层
- `packages/shared-ui`、`packages/mock` 是交付适配层
- 共享规则优先沉淀在 package 层，app 只负责装配与交付

治理补充约束：

- 根 `STATUS.yaml` 是 app / package 当前治理状态的唯一登记入口
- 根 `check:status` 负责校验 `STATUS.yaml` 与根脚本、根测试矩阵保持一致
- 若某项能力在总体设计主文档中被标记为“治理缺口”，不要在其他文档中把它写成已落地事实

## 硬性约束

### 1. 不要破坏 workspace 脚本契约

当前仓库实际脚本契约仍包含：

- 根目录保留 `build`、`build:shared`、`build:react`、`typecheck`、`lint`、`stylelint`、`test`、`test:watch`、`test:coverage`、`test:scripts`
- 根目录保留 `check:alias`、`check:status`
- 根目录保留 `verify`
- 每个 app / package 都保留 `test`、`test:watch`、`test:coverage`

约束解释：

- `build:react` 是正式主线脚本。
- 根脚本当前只编排正式默认基线，不自动覆盖 `react-screen-designer`。
- 在专门的清理任务完成前，不要随意把现有脚本改坏；要么维持现状可运行，要么成组移除并同步修改文档、配置与验证链路。

补充构建约束：

- 根 `build:shared` 当前负责先构建 `shared-utils`、`shared-service`、`design-tokens`、`mock`、`shared-ui`
- 根 `build:react` 必须先执行 `build:shared`，再构建 React app
- app 自己的 `build` 脚本仍只负责构建自身，不反向承担根脚本编排职责

### 2. 全仓统一使用包装脚本策略

当前仓库明确使用：

- `scripts/vite.cjs`
- `scripts/vitest.cjs`
- `scripts/run-vite-bin.cjs`

不要只把部分 workspace 改成裸 `vite` 或裸 `vitest`。

### 3. 根 Vitest 配置与项目级配置职责不同

- 根 `vitest.config.ts` 只负责 workspace 聚合，使用 `defineConfig`
- `apps/*/vitest.config.ts` 与 `packages/*/vitest.config.ts` 负责项目级配置，使用 `defineProject`

不要把 app 专属测试环境参数塞到根 Vitest 配置里。

### 4. Vite 与 Vitest 的 alias / 插件链必须同步

如果你修改某个 app 的 `vite.config.ts`，同时检查：

- 对应的 `vitest.config.ts`
- 对应的 `paths.config.ts`
- 对应的 `tsconfig.app.json`

当前 React app 层面的要求：

- 保留框架插件
- 保留 Tailwind CSS 插件（`@tailwindcss/vite`）
- 保留 `@` alias
- 保留 workspace 源码 alias
- 保持 `serve -> sourceAlias`、`build -> buildAlias`、`vitest -> sourceAlias` 的分层契约
- 当前已使用到的共享包源码入口，必须在 `tsconfig.app.json` 中镜像 path mappings
- `paths.config.ts` 与 `tsconfig.app.json` 的共享包源码映射必须能通过根脚本 `pnpm check:alias`
- `@repo/shared-utils/ui-contract`、`@repo/shared-utils/api-contract`、`@repo/shared-utils/routes`、`@repo/shared-utils/i18n` 与 `@repo/design-tokens/theme` 这类显式子路径变更时，必须同步四处检查

### 5. 保持 `main` 与 `bootstrap` 分层

当前启动契约是：

- `index.html` 必须在 `src/main.ts(x)` 前加载 `/theme-init.js`
- app 的 `dev`、`build`、`preview` 脚本必须先执行根 `scripts/write-theme-init.mjs`，生成各自的 `public/theme-init.js`
- `main.tsx` 负责判断是否启用 MSW，并等待 `worker.start()`
- `bootstrap.tsx` 负责接入共享主题 Provider、挂载应用、引入共享 UI 包样式，并基于当前 store 再次同步主题文档状态

不要把 MSW 启动逻辑移进 `bootstrap`，也不要把主题注入和 Provider 装配下沉到页面组件。

### 6. 保持 `design-tokens` 的职责收敛

`packages/design-tokens` 当前负责：

- 语义 token 定义
- CSS 变量生成
- Tailwind CSS 主题配置
- 共享主题运行时：theme preference、resolved mode、系统主题探测、持久化 key 与首屏预注入工具

这些边界应保持稳定：

- CSS 变量必须继续输出为 `kebab-case`
- `./css`、`./theme`、`./tailwind-preset` 这些正式导出路径除非明确迁移，否则不要随意破坏
- `@repo/design-tokens` 根入口优先承载 token、CSS 与 Tailwind 主题适配；主题运行时能力优先收敛到 `@repo/design-tokens/theme`
- 不要在 app 内复制 token 逻辑
- 当前正式主题偏好语义是 `ThemePreference = 'system' | 'light' | 'dark'`
- 类型契约（`ThemeName`、`ThemeMode` 等）现在定义在 `@repo/shared-utils/ui-contract`（ADR-011）

### 7. `mock` 同时服务开发态与测试态

`packages/mock` 对外暴露：

- `@repo/mock/browser`
- `@repo/mock/server`
- `@repo/mock/handlers`

修改 handlers 或 worker 行为时，注意：

- 浏览器开发态与 Node 测试态都必须兼容
- 如果 MSW worker 产物发生变化，要同步 `packages/mock/public/mockServiceWorker.js` 与正式 app 的 `public/mockServiceWorker.js`
- 根 `verify` 已包含 `verify:mock-worker`，如需回写产物，优先执行 `pnpm sync:mock-worker`

### 8. 静态资源由宿主应用自行管理

`packages/resources` 已并入 `apps/react-app`（ADR-011）。静态资源（图片、字体、SVG、Sprite）由宿主应用自行管理，不再通过独立共享包中转。

相关约束：

- 页面私有且不复用的素材保留在 app 内
- 不要把设计 token、主题映射职责与静态资源混放
- ESLint 规则继续禁止 `packages/*/src/*`、`packages/*/dist/*` 直连路径

### 9. package 的 `exports` 仍然只指向 `dist`

`packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui` 的 `exports` 当前都应只指向 `dist/`。

app 在开发态 / 测试态通过 alias 消费源码可以接受，但 package 对外契约仍然必须是 dist-based。

### 10. ESLint 保持 flat config

根 `eslint.config.js` 当前已经使用：

- `import { defineConfig } from 'eslint/config'`
- `typescript-eslint` 规则集
- 不再使用外层 `tseslint.config(...)` 包装器

不要回退到 `.eslintrc*` 体系。

### 11. 依赖版本集中管理

当前仓库的依赖版本管理策略：

- 工具链依赖统一在根 `package.json` 的 `devDependencies` 中声明，子包不重复安装
- `pnpm-workspace.yaml` 的 `overrides` 强制锁定关键依赖版本
- 业务依赖在各应用/子包的 `package.json` 中声明
- 运行时依赖放在实际消费它们的 app / package `dependencies` 中声明
- `packages/shared-utils` 是零 workspace 依赖的基础包，承载类型契约、通用运行时与国际化

### 12. 主题与共享 UI 按现行专题主文档与实施基线收敛

后续涉及 `design-tokens`、`shared-ui`、`bootstrap`、主题 store、共享业务壳组件的修改时，必须遵守以下收敛方向：

- 以 `docs/总体设计/详细设计/Phase0-基础能力详细设计.md` 与 `docs/总体设计/实施计划/Phase0-基础能力实施计划.md` 作为现行治理基线
- 跨包共享的类型契约（`ThemeName`、`ThemeMode` 等）现在定义在 `@repo/shared-utils/ui-contract`（ADR-011）
- 新增主题运行时规则时，优先收敛到共享层，不要继续在多个宿主里各写一套
- 首屏主题落盘应朝“挂载前完成”方向推进
- 当前主题持久化正式 key 已收敛为 `repo-theme-preference`
- 首屏主题预注入的正式契约是 app `index.html` 加载 `/theme-init.js`
- 当前共享 UI 包样式的正式契约是：React app 在 `bootstrap.tsx` 中显式引入 `@repo/shared-ui/style.css`
- 不要恢复包根入口自动带样式，也不要新增第三种正式接入方式
- `shared-ui` 的根入口应维护显式稳定导出清单，不要回退到无边界 `export *`
- 新增或改造共享组件时，默认补最小可访问性语义与扩展入口

### 13. 共享 i18n 运行时集中在 `packages/shared-utils/i18n`

当前仓库的国际化边界已经固定为：

- `@repo/shared-utils/i18n` 是唯一共享国际化运行时
- 当前正式支持的语言只有 `zh-CN` 与 `en-US`
- app 可以维护各自的 provider、store 和页面词典，但不要复制 shared i18n 运行时规则
- `packages/shared-ui` 不直接依赖 `@repo/shared-utils/i18n`，只消费翻译后的文案 props

### 14. 中后台平台共享内核集中在 `packages/shared-service`

当前总体设计已经明确：

- `packages/shared-service` 是平台级共享规则的唯一正式收敛层
- 它承载平台语义，而不是 `packages/shared-utils`（后者承载类型契约与通用运行时）

相关约束：

- `packages/shared-service` 保持框架无关，不直接依赖 React、Ant Design、Radix UI
- `packages/shared-service` 不直接操作 DOM，不承接浏览器副作用
- `packages/shared-utils` 承载跨包共享的纯类型契约、通用运行时与国际化，不要把后台平台语义塞进 `shared-utils` 的非契约子模块
- app 可以维护各自的 store、provider、guard 与页面编排，但不要复制平台共享规则

### 15. Phase 1 / Phase 2 平台数据链路以 `packages/mock` + MSW 为正式后端替身

当前前两阶段的正式边界是：

- 后端无关
- 先用 Mock 跑通完整平台链路
- 不绑定若依、芋道或其他固定后端接口风格

相关约束：

- Mock 不是演示附件，而是平台初始化、登录、菜单、权限与仪表盘的正式替身数据来源
- 不要在 React app 内再写一套独立假数据源
- 后续若接真实后端，应通过适配层映射到既有平台契约，而不是反向推翻平台基座

### 16. 模板产品化边界保持为 Git 模板优先

当前仓库对外使用方式的正式边界是：

- 这是 `Git 模板仓库`，不是已完成的 `create-*` CLI
- 根 `README.md` 负责说明模板怎么用
- 根 `TEMPLATE.md` 负责 Day 0 清单
- `docs/教程/模板初始化与裁剪指南.md` 负责手工初始化与残留清理步骤

### 17. 环境变量样例必须同步维护

当前模板环境变量文档资产包括：

- 根 `.env.example`
- `apps/react-app/.env.example`

## 目录职责

### `apps/react-app`

- React + shadcn/ui + Tailwind CSS 应用壳
- 主题通过 `@repo/shared-ui` 的 `ThemeProvider` 接入
- app 内主题状态通过 Zustand store 管理
- HTTP 客户端工厂在 `services/http-client.ts`，通过 `createPlatformClient()` 创建统一实例
- token 注入通过 `registerTokenProvider()` 延迟注册，避免与 auth-store 的模块循环
- 401 未授权通过 `setOnUnauthorized()` 注册全局处理器，自动清除会话并重定向到 `/login`
- 所有 API 请求必须通过 `services/shared.ts` 导出的 `api` 实例发出，不要在 store 中自建 `createHttpClient`
- `mockServiceWorker.js` 在生产构建时通过 Vite `closeBundle` 插件自动从 `dist/` 删除

### `apps/react-screen-designer`

- 当前工作区内存在的专题子应用目录
- 对应 `docs/子应用/可视化/` 下的专题设计与实施文档
- 当前尚未纳入根脚本、根测试矩阵与模板默认验收范围
- 若要把它升级为正式应用，必须先同步更新根 `package.json`、根 `vitest.config.ts`、根 `README.md`、本文件、总体设计主文档与测试规范

### `packages/shared-utils`

- 跨包共享的纯类型契约（零 workspace 依赖，ADR-011）
  - UI 层类型契约（`ThemeName`、`ThemeMode`、`StatusTone`、`MetricTrend` 等）
  - API 响应契约（`ApiResponse`、`PaginatedData`、`PlatformError` 等）
  - 路由定义契约（`RouteDefinition`、`routeDefinitions`）
- 通用工具函数（格式化、校验、存储、请求、日志）
- HTTP 客户端（HttpClient 接口 + ky 适配器 + XHR 上传封装）
- 国际化运行时与语言包（`createTranslator`、locale 检测/持久化/切换）
- 保持纯 TypeScript、框架无关

### `packages/shared-service`

- 平台共享内核
- 承载应用初始化、认证态、菜单、权限、多标签页、平台请求契约与平台错误模型
- 保持纯 TypeScript、框架无关、无 DOM 副作用

### `packages/design-tokens`

- 颜色、间距、阴影、排版、圆角、断点
- 主题快照注册与 light/dark 解析
- CSS 变量生成器
- Tailwind CSS 主题适配器

### `packages/shared-ui`

- React 共享主题 Provider
- React 公共业务壳组件（基于 shadcn/ui）
- shadcn/ui 组件源码（通过 CLI 生成到 `src/components/ui/`）
- 仅承接框架内主题接入与共享 UI 壳，不承接业务状态

### `packages/mock`

- MSW handlers、浏览器 worker、Node server
- 依赖 `@repo/shared-utils/api-contract` 复用 `ApiResponse`/`PaginatedData` 类型，不在本地重复定义
- MSW 版本通过 `catalog:` 引用，与 `pnpm-workspace.yaml` 集中管理对齐

## 修改建议

### 新增共享能力

- 纯工具函数或共享类型放到 `packages/shared-utils`
- 国际化运行时、locale 规则和共享文案契约优先放到 `packages/shared-utils/i18n`
- 后台平台的初始化、认证、菜单、权限、多标签页、平台请求契约优先放到 `packages/shared-service`
- 视觉语义能力放到 `packages/design-tokens`
- 网络 mock 能力放到 `packages/mock`

### 新增 app

当前正式主线只有 React 宿主。若新增宿主应用，必须先更新总体设计与本文件，明确它是否进入正式范围。

### 文档改动

如果你修改的是仓库约束、模板使用说明、脚本、目录结构、环境变量样例、配置格式、阶段目标、正式公共契约或架构边界：

- 必须同步根 `README.md`
- 必须同步根 `AGENTS.md`
- 视内容需要同步根 `TEMPLATE.md`
- 必须同步 `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`
- 涉及初始化与残留清理步骤时，还必须同步 `docs/教程/模板初始化与裁剪指南.md`
- 涉及主题与共享 UI、平台基座、测试矩阵正式契约时，还必须同步对应专题设计 / 实施 / 规范文档
