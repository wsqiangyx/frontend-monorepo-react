# React 中后台前端平台 Monorepo 架构设计方案

**文档版本**：v4.2
**修订日期**：2026-07-02
**适用仓库**：`frontend-monorepo`  
**文档性质**：唯一上游概要设计

---

## 1. 引言

### 1.1 定位与目标

本文档是仓库的**正式架构契约**，定义基于 React 的中后台前端平台脚手架的顶层设计、模块边界、依赖规则、运行时链路、质量门禁与治理机制。所有下游文档（`README`、`AGENTS`、`TEMPLATE`、测试规范等）均须从本文档派生，不得反向定义。

### 1.2 适用范围

- 当前仓库所有正式基线包与 `react-app` 应用壳
- 模板消费者接手后的默认职责边界
- 新功能接入时的架构审查依据

### 1.3 术语表

| 术语                    | 说明                                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 应用壳 (App Shell)      | 可独立部署的 SPA 宿主，负责路由、状态接线与页面编排                                                                                                                  |
| 共享包 (Shared Package) | Monorepo 内可被应用壳引用的基础库                                                                                                                                    |
| Design Token            | 平台无关的设计变量，输出为 CSS 变量、组件库主题配置等                                                                                                                |
| Composition Root        | 应用的装配入口，负责依赖注入与全局初始化                                                                                                                             |
| MSW                     | Mock Service Worker，用于浏览器和测试环境的 API 模拟                                                                                                                 |
| HttpClient              | shared-utils 暴露的 HTTP 客户端接口抽象，隔离底层实现                                                                                                                |
| TanStack Query          | 服务端状态管理库，提供缓存/去重/重试/背景刷新能力                                                                                                                    |
| 项目级指令文件          | 供 AI 编码工具自动读取的上下文说明文件。本仓库根 `AGENTS.md` 服务 Codex CLI，根 `CLAUDE.md` 服务 Claude Code CLI；两者核心维护约束保持一致，但分别面向不同工具入口。 |

---

## 2. 产品定义

本仓库是一个**面向团队复用的 React 中后台前端平台脚手架 Monorepo**，以 Git 模板仓库形式交付。

**它不是**：

- 通用空白模板
- 与固定后端强耦合的演示项目

**它提供**：

- 完整的 React 应用壳基线
- 共享的设计令牌、国际化、通用工具、服务层、UI 组件（工作流引擎 `shared-workflow` 为规划中预留包，当前仓库未创建）
- 通过 MSW 驱动的完整平台主链路，保持后端无关
- 让模板消费者能在此基础上快速收敛业务样例和专题子应用

---

## 3. 架构风格与关键决策

### 3.1 组合架构

仓库采用以下架构风格复合而成：

- **Workspace Monorepo**：通过 pnpm workspace 划分包边界，使用 catalog 统一版本
- **Clean Architecture**：分离平台规则、宿主装配、UI 呈现与外部适配
- **Ports / Adapters**：共享契约定义核心端口，Mock、shadcn/ui、HTTP 等作为适配器
- **Composition Root**：宿主应用 (`react-app`) 负责最终装配，不反向定义共享规则

### 3.2 关键架构决策 (ADR)

重大架构决策在本设计文档内维护索引；若后续补建 ADR 独立目录，必须与本处保持同步。

| 决策编号 | 标题                                                                      | 决策日期   | 状态      | 正式文档 |
| -------- | ------------------------------------------------------------------------- | ---------- | --------- | -------- |
| ADR-001  | `shared-service` 中的纯函数禁止依赖 UI 框架                               | 2026-05-10 | ✅ 已采纳 | 已完成   |
| ADR-002  | 正式宿主为 React 单应用壳                                                 | 2026-05-19 | ✅ 已采纳 | 待补全   |
| ADR-003  | 选用 shadcn/ui + Tailwind CSS 作为 React 宿主 UI 方案                     | 2026-06-25 | ✅ 已采纳 | 待补全   |
| ADR-004  | 采用 pnpm catalog 统一管理核心依赖版本                                    | 2026-05-18 | ✅ 已采纳 | 待补全   |
| ADR-005  | 工作流引擎以 `shared-workflow` 独立包交付（规划中，仓库当前未创建该目录） | 2026-05-18 | ✅ 已采纳 | 待补全   |
| ADR-006  | 文档修订与审核机制                                                        | 2026-05-19 | ✅ 已采纳 | 待补全   |
| ADR-007  | 采用 Tailwind CSS 替代 UnoCSS 作为原子化 CSS 方案                         | 2026-06-25 | ✅ 已采纳 | 待补全   |
| ADR-008  | HTTP 客户端从 axios 迁移到 ky                                             | 2026-06-25 | ✅ 已采纳 | 待补全   |
| ADR-009  | 引入 TanStack Query 作为服务端状态管理层                                  | 2026-06-25 | ✅ 已采纳 | 待补全   |
| ADR-010  | 废弃 `shared` 包，新建 `shared-types` 纯类型契约包                        | 2026-06-26 | ✅ 已采纳 | 待补全   |
| ADR-011  | 合并 `shared-types`、`shared-i18n`、`resources` 包，精简共享包结构        | 2026-06-30 | ✅ 已采纳 | 待补全   |
| ADR-012  | 引入跨端能力：小程序采用 Taro，App 采用 Expo (React Native)               | 2026-07-02 | ✅ 已采纳 | 已完成   |

> **补充说明**：ADR-002 和 ADR-003 为技术栈选择的根基性决策，建议在仓库初始化后一个月内完成正式决策文档的编写，记录完整的背景、替代方案评估及决策后果。

#### ADR-001：`shared-service` 纯函数禁止依赖 UI 框架

**背景**：`shared-service` 承载权限判断、Token 管理等核心逻辑，需在 React 组件和测试中复用且保持行为一致。  
**决策**：所有对外可复用函数（如 `checkPermission`）必须是纯函数，不依赖 React、DOM 或浏览器 API。存储通过依赖注入传入。  
**后果**：共享规则可测试性强，平台规则与 UI 解耦。

#### ADR-002：正式宿主为 React 单应用壳

**背景**：团队技术栈集中于 React，单一宿主可降低架构复杂度，同时保留共享包的复用能力。
**决策**：正式宿主仅保留 `apps/react-app`，使用 React 19 + shadcn/ui + Tailwind CSS。不包含 Vue 宿主。
**后果**：共享包无需跨框架适配，`shared-ui` 仅实现 React 组件，国际化运行时由 `packages/shared-utils/i18n` 提供并在 `react-app` 中初始化，工程维护成本显著降低。

#### ADR-003：选用 shadcn/ui + Tailwind CSS 作为 UI 方案

**背景**：需要一套可定制、轻量化的 React 组件库与原子化 CSS 方案，要求源码可控、主题灵活、包体积可控。先前采用 Ant Design 6，但实际使用面极小（仅 ConfigProvider 主题注入和 screen-designer 属性面板），且中后台自定义 UI 较多，重型组件库的价值未被充分利用。
**决策**：采用 **shadcn/ui**（基于 Radix UI 原语 + CVA 变体管理）+ **Tailwind CSS** 作为正式 UI 方案。理由包括：

- **源码可控**：shadcn/ui 为 CLI 代码生成器，组件源码直接复制到项目中，可完全自定义，无 vendor lock-in
- **轻量化**：按需引入组件，基于 Radix UI 的 tree-shakeable 原语，包体积显著小于 Ant Design
- **主题灵活**：基于 CSS 变量（HSL 格式），与现有 `design-tokens` 的 CSS 变量架构天然契合
- **Tailwind 生态**：Tailwind CSS 提供成熟的原子化 CSS 方案，社区活跃，与 shadcn/ui 深度集成
- **暗色模式**：通过 `dark:` 变体 + CSS 变量切换，与现有 `ThemeSnapshot` 概念一致
  **替代方案**：Ant Design 6（使用面小、定制成本高）、Material UI（设计风格差异大）、Headless UI（组件数量少）。
  **后果**：
- `design-tokens` 移除 Ant Design 主题适配器（`./theme/antd`），改为输出 Tailwind CSS 变量格式
- `shared-ui` 基于 shadcn/ui 组件二次封装，样式通过 Tailwind + CSS 变量控制
- 国际化不再通过 `ConfigProvider locale` 联动，改为组件直接消费 i18n 文案
- 缺失的 Ant Design 组件（如 ColorPicker）需引入第三方库补充

#### ADR-007：采用 Tailwind CSS 替代 UnoCSS

**背景**：仓库先前选用 UnoCSS 作为原子化 CSS 方案，但实际使用量为零（仅引入 reset 和虚拟模块，无任何组件消费工具类）。shadcn/ui 的正式选型要求 Tailwind CSS 作为样式基础。
**决策**：用 Tailwind CSS 替代 UnoCSS，移除 `unocss`、`@unocss/preset-uno`、`@unocss/preset-attributify`、`@unocss/reset` 依赖。
**替代方案**：继续使用 UnoCSS（shadcn/ui 不原生支持）、UnoCSS + Tailwind 兼容层（增加复杂度）。
**后果**：

- Vite 配置移除 `unocss/vite` 插件，添加 `@tailwindcss/vite` 插件
- `bootstrap.tsx` 中 `@unocss/reset/tailwind.css` 和 `virtual:uno.css` 替换为 Tailwind 指令
- 新增 `postcss.config.js`（如使用 PostCSS 方案）或直接使用 Tailwind Vite 插件
- `design-tokens` 的 spacing 和 breakpoints 值已在先前对齐 Tailwind 默认值，迁移无碰撞

#### ADR-008：HTTP 客户端从 axios 迁移到 ky

**背景**：axios 为个人主导维护项目（npm 发布权限高度集中在单一账户），2026 年 3 月发生严重供应链攻击事件——维护者账户被劫持后，攻击者通过 postinstall 钩子植入远程访问木马。此类攻击对中后台平台构成极高风险。ky 为零依赖、无 postinstall 钩子的现代 fetch 封装，供应链攻击面极小。同时，浏览器 fetch API 已足够成熟，ky 仅在其上提供轻量级的请求快捷方法和重试/超时机制，无额外运行时依赖。
**决策**：将 HTTP 客户端从 axios 迁移到 ky，同时在 `shared-utils` 中建立 `HttpClient` 接口抽象层，`shared-service` 仅依赖接口而非具体实现。上传进度场景因浏览器 fetch 不支持上传进度回调，由 `shared-utils` 提供独立的 `uploadWithProgress` 工具函数（基于 XMLHttpRequest）。
**替代方案**：继续使用 axios（供应链风险未消除）、ofetch（Node.js 端行为差异大）、got（仅 Node.js）。
**后果**：

- `shared-utils` 移除 axios 依赖，新增 ky 依赖和 `HttpClient` 接口 + ky 适配器实现
- `shared-service` 不直接依赖 ky，仅通过 `shared-utils` 暴露的 `HttpClient` 接口消费
- 上传进度场景绕过 ky，直接使用 `uploadWithProgress`（XHR 封装）
- 接口层确保未来可在 1 小时内切换底层库（ky ↔ ofetch ↔ axios），业务层零感知

#### ADR-009：引入 TanStack Query 作为服务端状态管理层

**背景**：现有方案使用手动 `useEffect` + `useState` 管理请求状态，缺乏智能缓存、请求去重、自动重试、背景刷新、分页查询等能力。中后台场景中，同一数据被多个组件消费的情况频繁（如用户信息、菜单树、权限集），手动管理导致冗余请求和状态不一致。TanStack Query 是 React 生态服务端状态管理的事实标准，提供声明式的数据获取与缓存管理。
**决策**：引入 `@tanstack/react-query` 作为服务端状态管理层。`shared-service` 各子模块（`auth/`、`navigation/`、`permissions/`、`workspace-tabs/`、`app/`、`request/`）封装的 API 函数返回 `Promise`，宿主层通过 TanStack Query 的 `useQuery` / `useMutation` / `useInfiniteQuery` 消费。禁止在组件中直接调用 ky 或 `httpClient`，所有数据请求必须通过 TanStack Query 层。
**替代方案**：SWR（功能较 TanStack Query 少，特别是服务端渲染和无限滚动支持较弱）、手写缓存层（维护成本高，易出 bug）、React Query v4（已停止维护）。
**后果**：

- 宿主应用新增 `QueryClientProvider` 装配，与现有 `ThemeProvider` 并列
- 组件不再使用 `useEffect` + `useState` 管理请求状态，改为 `useQuery` / `useMutation`
- `shared-service` 保持框架无关，不直接依赖 TanStack Query；query key 约定和 hook 封装在宿主应用或 `shared-ui` 层
- 缓存策略、重试策略、失效策略在宿主层统一配置

#### ADR-010：废弃 `shared` 包，新建 `shared-types` 纯类型契约包

**背景**：`@repo/shared` 包存在三个结构性问题：

1. **僵尸包**：包自身几乎没有自有代码，5 个子模块中 `./http`、`./i18n`、`./utils`、`./types` 全部是从 `shared-utils` 和 `shared-utils/i18n` 的重导出，根 `index.ts` 只有一行 `export * from '@repo/shared-utils'`
2. **依赖倒挂**：`ui-contract` 模块承载跨包共享的类型契约（`ThemeName`、`StatusTone` 等），被基础共享层的 `design-tokens` 依赖，但 `shared` 包自身依赖 `shared-utils`（含其 `i18n` 子模块），导致基础层间接依赖了上层包，违反分层架构原则
3. **路由定义未接入**：`shared/routes/` 只定义了一条路由（`/`），宿主应用未消费；`shared/routes/react` 的 `createReactRoutes()` 也从未被调用

**决策**：

- 新建 `@repo/shared-types` 包，承载所有跨包共享的**纯类型契约**（零运行时依赖，无 workspace 包依赖）
- `shared-types` 包含原 `shared` 包中的 `ui-contract` 类型、原 `shared-service/request/` 中的 API 契约重导出类型、原 `shared/routes/definitions.ts` 中的路由类型
- 废弃 `@repo/shared` 包，所有消费者直接引用源头包：
  - `@repo/shared/http` → `@repo/shared-utils/http`
  - `@repo/shared/i18n` → `@repo/shared-utils/i18n`
  - `@repo/shared/ui-contract` → `@repo/shared-utils/ui-contract`
  - `@repo/shared/routes` → `@repo/shared-utils/routes`（如需）
- `shared-service` 的 `request/` 子模块（从 `shared-utils` 重导出）同步清理，消费者直接引用 `@repo/shared-utils`
- `design-tokens` 的依赖从 `shared` 改为 `shared-utils`，解除基础层对上层包的间接依赖

**替代方案**：

- 将 `ui-contract` 移入 `shared-utils`（语义不匹配——UI 类型不是通用工具）
- 保留 `shared` 包但清理重导出（治标不治本，依赖倒挂未解决）

**后果**：

- 依赖图无环、层次清晰：`shared-utils`（零 workspace 依赖）→ `shared-service` → `shared-ui` → `react-app`
- `design-tokens` 不再间接依赖 `shared-utils` 和 `shared-i18n`
- 所有 `@repo/shared` 的 import 路径需迁移（影响 `react-app`、`shared-ui`、`design-tokens`）
- 路由适配器 `createReactRoutes()` 从 `shared/routes/react` 移入宿主应用（它是 React 专属逻辑，不属于共享包）

#### ADR-011：合并 `shared-types`、`shared-i18n`、`resources` 包，精简共享包结构

**背景**：ADR-010 将类型契约独立为 `shared-types` 包，解决了依赖倒挂问题。但经实践检验，当前 8 个共享包服务于 1 个应用 (`react-app`)，无多应用消费场景来支撑独立版本/部署的边界。其中：

1. **`shared-types` 过小**：仅 4 文件约 75 行代码，且 `shared-utils/types.ts` 和 `shared-service/request/index.ts` 均为对它的纯 re-export，形成不必要的间接跳转
2. **`shared-i18n` 过小**：仅 5 文件约 200 行，零 workspace 依赖，仅被 `react-app` 消费
3. **`resources` 过小**：TS 代码仅约 60 行，4 个子目录各含 1 个 manifest + 1 个函数，静态资产可直接由 app 管理
4. **`shared-service` 子目录过深**：7 个子目录中 `contracts/`、`runtime/`、`request/` 各仅 2-3 行代码，`app/` 也很薄

**决策**：

- 合并 `shared-types` + `shared-i18n` → `shared-utils`：类型契约、国际化运行时、通用工具统一收敛到一个基础包
- 合并 `resources` → `react-app`：静态资源由宿主应用自行管理
- 扁平化 `shared-service`：将 `contracts/` + `runtime/` 合并为 `platform.ts`，删除纯 re-export 的 `request/`
- 保留 `design-tokens`、`mock`、`shared-ui` 不变（各有充分的独立边界理由）

**替代方案**：

- 保留 8 包现状（维护成本高，间接跳转多，无多应用消费收益）
- 仅合并 `shared-types` → `shared-utils`，保留其余（不彻底，`shared-i18n` 和 `resources` 同样过小）

**后果**：

- 共享包从 8 个精简为 5 个，构建编排、alias 维护、subpath 契约减少约三分之一
- `shared-utils` 新增 `./ui-contract`、`./api-contract`、`./routes`、`./i18n` 子路径导出
- `shared-service` 子模块从 8 个减少为 6 个（删除 `request/`，合并 `contracts/` + `runtime/` → `platform`）
- 依赖链简化：`shared-utils`（零 workspace 依赖）→ `shared-service` → `shared-ui` → `react-app`；`design-tokens` 仅依赖 `shared-utils`
- `design-tokens`、`shared-service`、`shared-ui` 的 `@repo/shared-types` 依赖替换为 `@repo/shared-utils`
- 所有 `@repo/shared-types/*` 和 `@repo/shared-i18n` 的 import 路径需迁移

#### ADR-012：引入跨端能力：小程序采用 Taro，App 采用 Expo (React Native)

**背景**：

随着模板产品化推进，单一 Web 宿主已无法覆盖中后台平台在小程序与移动 App 场景的交付需求。现有仓库通过 ADR-002 限定为 React 单应用壳，目的是降低初期复杂度；但 `packages/shared-service` 已按框架无关方式实现（ADR-001），`packages/shared-utils` 也已承载类型契约、国际化运行时与通用工具，这为多宿主复用平台内核提供了可行基础。

跨端扩展的核心目标不是追求一套代码覆盖所有端，而是在**保持 Web 中后台基线稳定**的前提下，让小程序和 App 能最大程度复用既有平台规则（认证、菜单、权限、标签页、API 契约、国际化），同时允许各端使用最适合自身运行时的 UI 与网络方案。

**决策**：

- **小程序端采用 Taro 3+/4**：使用 React/TSX 语法，作为 `apps/taro-miniapp` 宿主；一套代码可输出微信小程序、支付宝小程序、H5，并在需要时输出 React Native。
- **App 端采用 Expo（React Native）**：作为 `apps/expo-mobile` 宿主；使用 React 技术栈，通过 EAS Build 托管原生构建，通过 EAS Update 提供热更新。
- **为跨端新增三个共享包**：
  - `packages/cross-platform-utils`：封装平台差异（HTTP、Storage、Theme、Locale），框架无关，仅依赖 `@repo/shared-utils`
  - `packages/cross-platform-ui`：跨端 UI 组件，基于 Taro 组件与 React Native 组件分别实现，消费 `@repo/design-tokens` 原始 token 值与 `@repo/shared-service` 平台内核
  - `packages/cross-platform-mock`：平台无关的 Mock 数据生成，从 `packages/mock` 提取 fixtures 与 personas，供小程序/App 的本地拦截层使用
- **重议 ADR-002**：正式宿主不再限定为单一 React 应用壳；`apps/react-app` 继续作为默认桌面 Web 宿主，`apps/taro-miniapp` 与 `apps/expo-mobile` 作为跨端正式宿主进入基线。

**替代方案**：

- **微信小程序原生**：性能最好，但 WXML/WXSS 与现有 React/TypeScript 资产完全割裂，不适合复用型模板。
- **uni-app（Vue）**：国内生态大，但要求团队维护 React + Vue 双栈，与现有 `shared-ui`、shadcn/ui 不兼容。
- **Flutter**：UI 一致性与性能最佳，但需用 Dart 重写 `shared-service`、`shared-utils` 全部逻辑，破坏现有 TypeScript 资产。
- **Kotlin Multiplatform**：适合共享业务逻辑，但需 Kotlin + Swift/Compose 分别写 UI，且要重写现有平台内核。
- **Taro 全覆盖（小程序 + H5 + React Native）**：维护成本最低，但 Taro 的 React Native 输出成熟度与性能弱于原生 Expo；若团队资源有限或 App 为次要场景，可作为过渡方案。

**后果**：

- ADR-002 的“正式宿主为 React 单应用壳”被 ADR-012 修订为多宿主架构。
- `packages/shared-service` 的框架无关价值被进一步验证：认证、菜单、权限、标签页等规则无需改动即可被 Taro/Expo 复用。
- `packages/shared-utils` 的类型契约、国际化运行时、路由定义继续被所有宿主共享；HTTP 客户端底层 ky 仅用于 Web，跨端需通过 `cross-platform-utils` 注入 `Taro.request`/`fetch` 适配实现。
- `packages/design-tokens` 的原始 token 值（颜色、间距、圆角）可被跨端复用，但 CSS 变量/Tailwind 输出仅用于 Web，需新增平台适配输出。
- `packages/shared-ui` 与 `packages/mock` 保持 Web 专用；跨端需新建 `cross-platform-ui` 与 `cross-platform-mock`。
- 新增根脚本：
  - `build:cross-platform-utils = pnpm -F @repo/cross-platform-utils build`（taro-miniapp 的前置依赖构建）
  - `dev:taro:weapp = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp dev:weapp`
  - `build:taro:weapp = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp build:weapp`
  - `dev:taro:h5 = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp dev:h5`
  - `build:taro:h5 = pnpm build:cross-platform-utils && pnpm -F @repo/taro-miniapp build:h5`
  - 以上脚本不破坏现有 `build:react` 与 `verify` 主线。
- `STATUS.yaml`、`AGENTS.md`、`README.md`、`TEMPLATE.md` 需同步登记新宿主与共享包，并更新目录职责。

#### ADR-004：pnpm catalog 统一版本管理

**背景**：多包 Monorepo 需避免依赖版本碎片化。  
**决策**：在 `pnpm-workspace.yaml` 定义 `catalog` 与 `overrides` 作为集中版本参考，子包通过 `"dependency": "catalog:"` 统一引用。  
**后果**：版本治理收敛到根配置，新增或升级依赖只需修改 `pnpm-workspace.yaml`，自动同步所有引用包。

#### ADR-005：工作流独立包交付

**背景**：工作流引擎依赖重型库 `bpmn-js`，非所有场景必需。  
**决策**：`shared-workflow` 独立于 `shared-ui`，内部含 React 组件封装。  
**当前状态**：该包为规划中预留，仓库当前未创建 `packages/shared-workflow/` 目录。  
**后果**：按需引入，避免强制依赖。

#### ADR-006：文档修订与审核机制

**背景**：架构文档作为唯一上游契约，需保证修订可控。  
**决策**：修改须通过 PR，经架构负责人审核，更新版本号并同步下游文档。  
**后果**：文档权威性有保障，变更可追溯。

#### 架构重议触发条件

以下条件出现时，需重新评估对应架构决策：

| 触发条件                                         | 需重议的决策                             |
| ------------------------------------------------ | ---------------------------------------- |
| 引入第二个 UI 框架或技术栈                       | ADR-002（单宿主）                        |
| Radix UI 停止维护或 shadcn/ui 出现重大不兼容升级 | ADR-003（组件库选型）                    |
| Tailwind CSS 停止维护或出现重大不兼容升级        | ADR-007（CSS 方案选型）                  |
| ky 停止维护或出现重大不兼容升级                  | ADR-008（HTTP 客户端选型）               |
| 需支持 IE11 或特殊老旧浏览器                     | 构建工具链、Polyfill 策略                |
| 团队规模超过 10 人且多团队并行开发               | Monorepo 工具链（是否引入 Nx/Turborepo） |
| 需将共享包发布到外部团队或公有 npm               | ADR-004（版本管理策略）                  |
| 后端接口规范发生重大变化（如 GraphQL 替代 REST） | 整体服务层架构                           |

---

## 4. 仓库顶层结构

```
frontend-monorepo/
├─ apps/
│  ├─ react-app/               # React 正式宿主应用 (stable)
│  └─ taro-miniapp/            # Taro 小程序宿主 (candidate, ADR-012)
├─ packages/
│  ├─ shared-utils/            # 通用工具 + 类型契约 + 国际化运行时
│  ├─ design-tokens/           # 设计令牌（CSS 变量、Tailwind 主题配置）
│  ├─ shared-service/          # 服务层（API 封装、Token 管理、权限判断、Mock）
│  ├─ shared-ui/               # React UI 组件、布局 Hooks
│  ├─ mock/                    # MSW handlers（开发态 + 测试态双环境）
│  └─ cross-platform-utils/    # 跨端运行时适配层 (candidate, ADR-012)
├─ docs/
│  ├─ 总体设计/                # 上游概要设计、详细设计与实施计划
│  ├─ 教程/                    # 初始化与操作手册
│  ├─ 规范/                    # 独立规范文档
│  ├─ 治理/                    # 阶段性治理记录
│  └─ 子应用/                  # 专题子应用文档
├─ scripts/                    # 构建与工具脚本（含 check-arch.sh）
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ eslint.config.js
├─ vitest.config.ts
├─ STATUS.yaml                 # 包治理状态清单
└─ .env.example
```

---

## 5. 分层架构与依赖规则

### 5.1 层次划分

| 层级           | 包含包/目录                               | 角色                                   |
| -------------- | ----------------------------------------- | -------------------------------------- |
| **宿主层**     | `apps/react-app`                          | 组合根，路由装配、store 接线、页面编排 |
| **交付适配层** | `shared-ui`, `shared-service` (API/Token) | React UI 适配，API 边界与 Mock         |
| **平台内核层** | `shared-service` (权限/类型)              | 平台领域模型、应用规则                 |
| **基础共享层** | `shared-utils`, `design-tokens`           | 类型契约、通用运行时、国际化、主题系统 |

### 5.2 正式依赖方向

```
运行时依赖方向（不可逆）：
shared-utils                     ← 零 workspace 依赖，最底层
  ↑
shared-service                   ← 依赖 shared-utils
  ↑
shared-ui                        ← 依赖 shared-service + shared-utils + design-tokens
  ↑
react-app                        ← 依赖所有共享包

design-tokens                    ← 只依赖 shared-utils 的 UI 契约

mock                             ← 零 workspace 依赖（仅依赖 msw）

cross-platform-utils             ← 只依赖 shared-utils (ADR-012)
  ↑
taro-miniapp                     ← 依赖 cross-platform-utils + shared-service + shared-utils (ADR-012)
```

**强制约束**：

- `shared-utils` 零 workspace 包依赖，承载类型契约、通用运行时与国际化
- 基础共享层不依赖上层包（`shared-utils` 无 workspace 依赖；`design-tokens` 仅依赖 `shared-utils`）
- `shared-service` 权限判断等纯函数不依赖 React/DOM
- `shared-ui` 不反向定义平台规则
- 宿主应用不能复制共享层的主题或 i18n 运行时
- `shared-service/mock-setup` 仅限开发/测试环境引入，生产构建时 Tree Shaking 剔除
- `@repo/shared` 包已废弃（ADR-010），目录已移除，禁止新增任何 import
- `@repo/shared-types` 和 `@repo/shared-i18n` 包已合并到 `shared-utils`（ADR-011），禁止新增任何 import

### 5.3 依赖检查规则

用于 `check:arch` 脚本（具体实现见 `scripts/check-arch.sh`）：

- `shared-utils` 的 `dependencies` 不得包含任何 workspace 包
- 基础共享层 (`design-tokens`) 的 `dependencies` 不得包含上层 workspace 包（`shared-service`, `shared-ui`）；`design-tokens` 可依赖 `shared-utils`
- `shared-service` 不得依赖 `react`, `react-dom`, `react-router`, `zustand`, `antd`, `@ant-design/*`, `@radix-ui/*`, `ky`, `axios`
- `shared-service` 仅通过 `shared-utils` 暴露的 `HttpClient` 接口访问 HTTP 能力，不直接依赖具体 HTTP 库
- `shared-ui` 不得依赖 `apps/*`
- `apps/react-app` 不得依赖其他 `apps/*`
- 生产依赖不得直接引用 `msw`
- 任何包不得新增 `@repo/shared` 依赖（该包已废弃且目录已移除，ADR-010）
- 任何包不得新增 `@repo/shared-types` 或 `@repo/shared-i18n` 依赖（已合并至 `shared-utils`，ADR-011）

### 5.4 包间依赖矩阵

| 包名                   | 可依赖项                                                               | 禁止依赖项                     |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| `shared-utils`         | ky                                                                     | React, workspace 包            |
| `design-tokens`        | shared-utils                                                           | 其他 workspace 包              |
| `shared-service`       | shared-utils, msw                                                      | UI 框架, DOM, ky, axios        |
| `shared-ui`            | shared-utils, design-tokens, shared-service, @radix-ui/\*, tailwindcss | 宿主应用                       |
| `mock`                 | shared-utils, msw                                                      | UI 框架                        |
| `cross-platform-utils` | shared-utils                                                           | UI 框架, React, DOM            |
| `apps/react-app`       | 所有共享包, @tanstack/react-query                                      | 无                             |
| `apps/taro-miniapp`    | cross-platform-utils, shared-service, shared-utils                     | React 19, DOM, shared-ui, mock |

---

## 6. 各层职责详细说明

### 6.1 基础共享层

#### `shared-utils` – 通用工具 + 类型契约 + 国际化

- **提供**：跨包共享的纯 TypeScript 类型与常量契约、通用运行时工具、国际化运行时
- **子模块**：
  - `./ui-contract` — UI 层类型契约（`ThemeName`, `ThemeMode`, `StatusTone`, `MetricTrend`, `ContentMaxWidth` 等），被 `design-tokens`、`shared-ui`、`react-app` 消费
  - `./api-contract` — API 响应契约（`ApiResponse`, `PaginationParams`, `PaginatedData`, `PlatformError` 等），被 `shared-service` 消费
  - `./routes` — 路由定义契约（`RouteDefinition` 类型），框架无关，供宿主应用消费
  - `./i18n` — 国际化运行时（`createTranslator`、locale 检测/持久化/切换、共享词典），供 `react-app` 消费
  - `./http` — `HttpClient` 接口抽象与 ky 适配器实现、`uploadWithProgress` 工具函数
- **约束**：零 workspace 包依赖，纯工具与类型导出
- **来源**：原 `@repo/shared-types`（类型契约）、原 `@repo/shared-i18n`（国际化运行时）、原 `shared-utils`（通用工具 + HTTP 客户端）

**HttpClient 接口设计**：

```typescript
interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  delete<T>(url: string, config?: RequestConfig): Promise<T>
}
```

- `RequestConfig` 统一承载 headers、params、timeout、signal 等请求配置
- 常规请求委托给 ky 适配器；上传场景使用同目录下的 `uploadWithProgress` 工具函数（XHR 封装）
- ky 适配器作为默认实现；未来如需切换，只需新增适配器并替换注入点，业务层零感知

#### `design-tokens` – 设计令牌

- **提供**：CSS 自定义属性、Tailwind CSS 主题配置（颜色、字号、间距、圆角等）、图表配色常量
- **子路径**：`./tokens.css`, `./tailwind-preset`, `./theme`
- **依赖**：仅 `shared-utils`（消费 `ThemeName`, `ThemeMode` 等类型）
- **不负责**：业务状态、私有主题逻辑

### 6.2 平台内核层 / 服务层

#### `shared-service` – 服务与契约

- **API 模块**：按业务域拆分于 `auth/`、`navigation/`、`permissions/`、`workspace-tabs/`、`app/`、`platform.ts` 等子模块，响应格式 `{ code, msg, data }`
- **HTTP 访问约束**：`shared-service` 仅依赖 `shared-utils` 暴露的 `HttpClient` 接口，不直接依赖 `ky` 或 `axios`
- **服务端状态消费**：API 模块封装后返回 `Promise`，宿主层通过 TanStack Query 的 `useQuery` / `useMutation` / `useInfiniteQuery` 消费。禁止在组件中直接调用 `httpClient`，所有数据请求必须通过 TanStack Query 层
- **TokenManager**：双 Token 刷新队列，并发请求排队
- **权限判断**：纯函数 `checkPermission(permissions, required)`
- **Mock 服务**：MSW handlers，与 API 类型同构
- **类型消费**：API 响应类型从 `shared-utils/api-contract` 直接获取，`request/` 重导出子模块已清理（ADR-010 → ADR-011）

**扩展预留**：当前权限模型为 RBAC（基于角色）。若未来需要支持多租户或数据权限（如“只能查看本部门数据”），扩展路径如下：

- 在 `shared-service/types.ts` 中扩展 `ApiResponse` 或请求参数，增加 `tenantId` 字段
- 在 `shared-service/request/` 重导出子模块中透传租户上下文
- 权限判断函数 `checkPermission` 保持不变（数据权限属于接口过滤层，不在前端权限判断范围）
- 宿主 store 中增加 `tenantId` 状态，登录后从后端获取

### 6.3 交付适配层

#### `shared-ui` – React UI

`shared-ui` 负责提供基于 shadcn/ui 二次封装的 React 组件。封装遵循以下分层原则：

| 封装模式         | 适用场景                                       | 示例                                                         |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| **直接透传**     | 组件 Props 与 shadcn/ui 完全一致，无需额外逻辑 | `Button` → 直接 re-export                                    |
| **Props 重组织** | 需要统一 API 风格或注入平台语义                | `Menu` → `SidebarMenu`，接收 `MenuItem[]` 并自动处理权限过滤 |
| **组合封装**     | 由多个 shadcn/ui 组件组装而成                  | `PageContainer` = 布局容器 + 标题 + 共享样式                 |

**约束**：

- 所有组件样式通过 `design-tokens` 的 CSS 变量和 Tailwind CSS 类名控制，禁止在组件内硬编码颜色、字号等视觉属性
- 组件命名遵循 PascalCase，Props 命名使用 camelCase
- 每个组件文件必须包含完整的 TypeScript 类型声明

**已实现组件**：`PageContainer`, `SidebarMenu`, `AuthButton` 等基础组件（`.repo-*` BEM 风格，过渡期共存）

**shadcn/ui 组件**：基于 Radix UI 原语 + CVA 变体管理 + Tailwind CSS 封装，分三个 Tier 共约 30 个组件（Button/Input/Select/Dialog/Table/Toast/Form 等），详见 `docs/总体设计/详细设计/专题-UI主题增强与组件库设计.md`

**图表**：`LineChart`, `BarChart`, `PieChart`，统一主题色
**布局 Hooks**：`useMenu`, `useLayout`，消费权限数组返回菜单树
**类型契约**：UI 组件的类型契约（`ThemeName`, `StatusTone` 等）从 `@repo/shared-utils/ui-contract` 消费

### 6.4 跨端运行时适配层

#### `cross-platform-utils` – 跨端运行时适配

**状态**：candidate（Phase 1 跨端基座）

**定位**：框架无关的跨端运行时适配层，封装小程序与 App 宿主与平台原生能力的差异。不依赖 React、Taro 或任何 UI 框架（`@tarojs/taro` 仅为 optional peerDependency）。

**子模块**：

| 子模块      | 职责                                                                                                                                                                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `./storage` | `PlatformStorage` 接口抽象：`getItem/setItem/removeItem/clear`，Taro 适配器基于 `Taro.getStorage/setStorage/removeStorage/clearStorage`                                                                                                                                                 |
| `./http`    | `TaroHttpClient`：基于 `Taro.request` 的 HTTP 客户端，统一 request/response 拦截、超时、重试                                                                                                                                                                                            |
| `./theme`   | `PlatformThemeRuntime`：`Taro.getSystemInfo` 获取系统主题，`Taro.onThemeChange` 监听主题切换，`Taro.setNavigationBarColor` 同步导航栏。ADR-011 后主题类型契约已合并至 `shared-utils/ui-contract`；运行时通过 `ThemeResolver` 回调（由消费方注入）而非直接导入 `resolveTheme` 获取主题值 |
| `./locale`  | `PlatformLocaleManager`：`Taro.getSystemInfo` 获取设备语言，`Taro.setStorageSync` 持久化                                                                                                                                                                                                |

**依赖**：`@repo/shared-utils`（类型契约、HttpClient 接口、UI 运行时类型）

**约束**：

- 框架无关，不依赖 Taro 具体 API 之外的 UI 框架
- `@tarojs/taro` 为 optional peerDependency，允许 Web 宿主不安装 Taro 也能通过条件编译/类型体操使用类型
- 不依赖 `@repo/shared-service`（平台内核在跨端宿主中通过 taro-miniapp 直接消费）

### 6.5 宿主层

#### `apps/react-app` – React 组合根

- **技术栈**：React 19 + Zustand + react-router + shadcn/ui + Tailwind CSS + TanStack Query + react-i18next
- **启动链**：环境校验 → Mock 启动 → 样式注入 → i18n → QueryClient → Router/Store → 挂载
- **内部结构**：

| 目录/文件                 | 职责                                                                              |
| ------------------------- | --------------------------------------------------------------------------------- |
| `main.tsx`                | 启动入口，预处理                                                                  |
| `services/http-client.ts` | HTTP 客户端工厂（createPlatformClient、registerTokenProvider、setOnUnauthorized） |
| `services/shared.ts`      | 统一 api 实例导出                                                                 |
| `router/`                 | 路由实例化，权限守卫                                                              |
| `stores/`                 | Zustand store，调用 `shared-service` 纯函数                                       |
| `platform/`               | 平台级 Zustand store（auth、permission、navigation）                              |
| `layouts/AdminLayout.tsx` | 宿主级布局、菜单、语言切换                                                        |
| `views/`                  | 页面组件                                                                          |

#### `apps/taro-miniapp` – Taro 小程序宿主

**状态**：candidate（Phase 1 跨端基座）

- **技术栈**：React 18 + Taro 3/4 + zustand + TypeScript
- **输出目标**：微信小程序（weapp）、H5
- **启动链**：`app.ts` → `app.config.ts`（页面注册）→ 各页面 Page 组件（服务层调用 + 状态管理）
- **依赖**：`@repo/cross-platform-utils`（跨端运行时适配）、`@repo/shared-service`（平台内核）、`@repo/shared-utils`（类型契约、国际化）
- **不与 React 19 catalog 冲突**：taro-miniapp 使用 React 18（Taro 3/4 要求的版本），通过独立 `dependencies` 声明，不受根 catalog 的 React 19 约束
- **Mock 策略**：Taro 环境不支持 MSW，通过 `cross-platform-utils/http` 封装的 `TaroHttpClient` 在开发态注入本地拦截逻辑

---

## 7. 运行时架构

### 7.1 启动链

1. 环境变量校验
2. 开发环境动态启动 MSW (`setupMock()`)
3. 引入 `design-tokens/tokens.css` 和 Tailwind CSS 基础层
4. 创建 i18n 实例 (`createReactI18n()`)
5. 创建 TanStack Query `QueryClient` 实例
6. 初始化 Zustand store、Router
7. 渲染 React 应用

### 7.2 认证与权限链

1. `shared-service/auth` 定义 `PlatformSession`、`PlatformUser` 与 `AuthStatus` 三态模型
2. 宿主层 `auth-store` 通过 `registerTokenProvider()` 向 HTTP 客户端工厂注册 token 注入
3. 宿主层 `auth-store` 通过 `setOnUnauthorized()` 注册 401 全局处理器（清除会话 + 重定向 `/login`）
4. 所有 API 请求通过 `createPlatformClient()` 创建的客户端发出，自动注入 `Authorization: Bearer` 头
5. 路由守卫调用 `checkPermission` 拦截
6. `PermissionGate` 组件消费 `checkPermission` 控制显隐

### 7.3 数据访问链

**常规请求链路**：

`shared-service` 各子模块封装 API（通过 `HttpClient` 接口，返回 `Promise<ApiResponse<T>>`）→ TanStack Query 层（`useQuery` / `useMutation`，提供缓存/去重/重试/背景刷新）→ 页面组件消费 → 开发环境 MSW 拦截

**上传请求链路**：

组件调用 → TanStack Query `useMutation` 包装 → `shared-service` 上传 API 调用 → `shared-utils/uploadWithProgress`（基于 XMLHttpRequest，支持进度回调与 abort）→ 开发环境 MSW 拦截

**架构约束**：

- `shared-service` 仅依赖 `HttpClient` 接口，不直接依赖 `ky`
- `ky` 仅出现在 `shared-utils` 的依赖中，作为 `HttpClient` 的默认适配器实现
- 宿主层通过 `createPlatformClient()` 统一创建 HTTP 客户端，自动注入 token 并拦截 401 响应
- 401 响应触发全局处理器：清除 auth session 并重定向到 `/login`
- 禁止在 store 中自建 `createHttpClient` 实例，所有 API 请求通过 `services/shared.ts` 的 `api` 发出
- 禁止在组件中直接调用 `httpClient`，所有数据请求必须通过 TanStack Query 层

---

## 8. 国际化方案

- 运行时切换，组件通过 props 或 i18n hook 消费翻译文案
- 语言包命名空间：`common`, `menu`, `app`
- 持久化 key `locale`，默认 `zh-CN`

---

## 9. Mock 策略

- 使用 MSW，handlers 按业务模块划分
- 启动入口 `shared-service/mock-setup`，仅开发环境动态加载
- 数据格式与真实 API 同构

---

## 10. 测试策略（渐进式）

| 层级     | 范围                                | 工具                            | 状态           | 目标            |
| -------- | ----------------------------------- | ------------------------------- | -------------- | --------------- |
| 单元测试 | shared-utils、shared-service 纯函数 | Vitest                          | 根配置就绪     | 核心路径 ≥80%   |
| 组件测试 | shared-ui 关键交互                  | Vitest + @testing-library/react | 已识别，待引入 | 关键路径覆盖    |
| 集成测试 | react-app + Mock 交互链             | Vitest                          | 已识别         | 登录/权限主链路 |
| E2E 测试 | 关键业务流程                        | Playwright (候选)               | 未纳入基线     | Q3 评估         |

**覆盖率目标说明**：

- "核心路径"指**被两个及以上模块引用的导出函数**，以及**包含条件分支的关键业务判断函数**（如 `checkPermission`、`TokenManager.refreshToken`）
- 覆盖率统计以 `vitest --coverage` 输出的 `lines` 指标为准
- 初期不设为硬性门禁，作为团队自查指标；CI 稳定后再接入自动化阈值检查

**要求**：

- 宿主集成测试必须使用 `shared-service/mock` 替身，不得自建假数据
- 组件测试优先断言用户可见行为和可访问性

---

## 11. 质量门禁与治理

### 11.1 已落地门禁

- `pnpm lint`：ESLint + Prettier，提交前自动修复
- `pnpm build`：全量构建验证
- TypeScript 严格模式全仓

### 11.4 开发纪律

除工具门禁外，所有自动化修改与人工维护均须遵循根 `AGENTS.md` 中定义的编码代理修改纪律（基于 [Karpathy 编码准则](https://x.com/karpathy/status/2015883857489522876)）：

- **先思考，再编码**：明确假设；不确定时停下来提问；不隐藏困惑。
- **简化优先**：只做请求的事，不为单次使用造抽象，不增加未要求的配置或灵活性。
- **精准修改**：只动完成任务所必需的代码，不改无关相邻代码、注释或格式；不"改进"未损坏的东西。
- **清理自己的残留**：删除因本次改动产生的无用导入、变量、函数，不动预存在的死代码（除非明确要求清理）。
- **目标驱动**：把任务变成可验证目标；多步骤任务给出简短计划，每步附带验证方式；修改后运行相关测试/类型检查/lint/构建，直到成功标准满足。

违反上述纪律的变更不应通过审查；实现过程中若发现需求与既有约束冲突，优先停下来澄清，而不是静默扩大修改范围。

### 11.2 治理缺口跟踪

| 缺口                 | 优先级 | 时间     | 负责人 |
| -------------------- | ------ | -------- | ------ |
| `check:arch`         | P1     | Q2       | 待定   |
| `ErrorBoundary` 组件 | P1     | Q2       | 待定   |
| E2E 基线             | P2     | Q3       | 待定   |
| `docs:check`         | P2     | Q3       | 待定   |
| 首屏体积门禁         | P2     | Q3       | 待定   |
| 主题色对比度校验     | P3     | 持续观察 | 待定   |
| 请求耗时采集         | P3     | 持续观察 | 待定   |

### 11.3 推荐预算基线

- 首屏增量 ≤50KB gzip
- 单入口初始 JS ≤200KB gzip
- 引入重型组件须附带体积报告

---

## 12. 技术栈与版本管理

通过 `pnpm-workspace.yaml` 的 `catalog` 统一版本，子包使用 `"react": "catalog:"` 引用（当前全仓已统一采用 catalog 协议，根配置与 manifest 保持一致）。

| 类别       | 技术栈                                                                          | 版本（catalog 声明）         |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------- |
| 框架       | React                                                                           | 19.2.5                       |
| 构建       | Vite, @vitejs/plugin-react                                                      | 8.0.10, 6.0.1                |
| 状态管理   | Zustand                                                                         | ^5.0.13                      |
| 服务端状态 | TanStack Query (@tanstack/react-query)                                          | ^5.0                         |
| 路由       | react-router                                                                    | ^7.15.0                      |
| 组件库     | shadcn/ui (Radix UI + CVA + tailwind-merge)                                     | — (CLI 代码生成)             |
| 图标       | lucide-react                                                                    | ^0.469                       |
| 样式       | Tailwind CSS, @tailwindcss/vite                                                 | ^4, ^4                       |
| 国际化     | react-i18next, i18next                                                          | ^15, ^24                     |
| 请求       | ky                                                                              | ^1.8                         |
| Mock       | MSW                                                                             | ^2.5                         |
| 类型定义   | @types/react, @types/react-dom, @types/node                                     | 19.2.14, 19.2.3, 24.12.2     |
| 测试       | Vitest, @testing-library/react, @testing-library/dom, @testing-library/jest-dom | 4.1.5, 16.3.2, 10.4.1, 6.9.1 |
| 工作流     | bpmn-js（规划中预留，仓库当前未创建）                                           | —                            |

> **说明**：表中版本为 `pnpm-workspace.yaml` 中 `catalog` 的声明值，实际安装版本以 `pnpm-lock.yaml` 锁定为准。TypeScript (6.0.3)、Vitest (4.1.5)、ESLint (9.39.4)、Sass (1.99.0)、Tailwind CSS (4.x)、jsdom (29.1.0) 通过 `overrides` 全局锁定。shadcn/ui 不是 npm 包，通过 CLI 将组件源码生成到 `packages/shared-ui/src/components/ui/` 目录中。ky 仅在 `shared-utils` 中作为 `HttpClient` 接口的默认适配器依赖，`shared-service` 不直接依赖 ky。上传进度不依赖 ky，由 `shared-utils` 内部 `uploadWithProgress`（XHR 封装）实现。

所有包当前 `private: true`，不发布 npm，Changesets 仅生成 CHANGELOG。

---

## 13. 环境变量管理

- 统一 `VITE_` 前缀
- 当前正式样例变量：`VITE_ENABLE_MSW`
- 宿主拥有独立的 `.env.development` / `.env.production`
- 共享包不得直接读取宿主私有环境变量；当前 `shared-utils` 中使用的 `VITE_` 变量视为临时实现，长期应通过初始化函数注入

---

## 14. 后端对接策略

- API 封装于 `shared-service` 各子模块（如 `auth/`、`navigation/`、`permissions/`、`workspace-tabs/`），通过 `HttpClient` 接口访问
- 响应格式 `{ code, msg, data }`
- 开发环境通过 Vite proxy 转发 `/admin-api`，Mock 环境提供模拟数据
- 功能对接应通过适配层映射到既有平台契约，不预设固定后端风格
- 宿主层通过 TanStack Query 消费 API，禁止组件直接调用 `httpClient`

---

## 15. 部署与发布边界

- 当前仓库未内置 `docker/` 目录或 Docker 发布模板
- 如需补齐容器化交付，必须同步更新根文档、总体设计与模板接管说明

---

## 16. 模板裁剪与扩展指南

模板消费者可根据自身需求对仓库进行裁剪，以下是常见场景的操作指引。

### 16.1 最小化脚手架

如果只需要最精简的启动模板，可删除以下包：

- `shared-workflow`：该包为规划中预留（仓库当前未创建），若已创建则移除工作流引擎，删除目录后在根 `pnpm-workspace.yaml` 中去掉引用
- `shared-ui` 中的图表组件：删除 `src/charts/` 目录，移除 `@antv/g2` 依赖
- 可选：删除 `shared-ui` 中未使用的业务组件，仅保留 `PageContainer`、`SidebarMenu` 等基础组件

### 16.2 更换组件库

如果要替换 shadcn/ui + Tailwind CSS：

1. 在 `shared-ui` 中重写所有组件适配代码
2. 更新 `design-tokens` 中的主题导出（如从 Tailwind CSS 变量切换为其他组件库主题配置）
3. 更新 `shared-utils/i18n` 中的 locale 映射（如从 i18next 切换为其他库的语言包方案）
4. 更新 `apps/react-app` 中的全局配置和启动链
5. 更新 Vite 配置中的 CSS 插件（移除 `@tailwindcss/vite`，替换为新方案插件）

### 16.3 切换后端

若对接真实后端：

1. 保持 `shared-service/types.ts` 中的通用响应格式，或替换为你自己的类型定义
2. 替换 `shared-service` 各子模块下的 API 实现，保持函数签名不变或按需调整
3. 同步更新 `shared-service/mock/handlers/` 中的 Mock 处理器以匹配新接口
4. 如需替换底层 HTTP 库（如从 ky 切换到 ofetch），只需在 `shared-utils` 中新增 `HttpClient` 适配器实现，业务层零感知
5. 如宿主新增运行时变量，先同步 app 级 `.env.example` 与根文档

### 16.4 多租户或数据权限扩展

见 §6.2 扩展预留说明。

---

## 17. 包治理状态

仓库根目录 `STATUS.yaml` 记录各包的治理状态，状态分为三类：

- `stable`：正式基线成员，进入根脚本、测试矩阵、默认文档
- `candidate`：准备纳入正式基线，正在补充测试与文档
- `experimental`：实验性目录，不进入默认正式基线

当前初始状态（以仓库根目录 `STATUS.yaml` 实际内容为准）：

```yaml
packages:
  shared-utils: stable
  design-tokens: stable
  shared-service: stable
  shared-ui: stable
  mock: stable
  cross-platform-utils: candidate
  # shared-types: 已合并至 shared-utils（ADR-011）
  # shared-i18n: 已合并至 shared-utils（ADR-011）
  # resources: 已并入 react-app（ADR-011）
  # shared: 已废弃（ADR-010），目录待移除

apps:
  react-app: stable
  taro-miniapp: candidate
```

包状态变更规则见 §3.2 ADR-006 中的文档修订流程，任何状态变更需通过 PR 审核并更新本表。

---

## 18. 文档修订与同步

### 18.1 修订流程

1. PR 提出修改，说明变更原因与影响范围
2. 至少一位架构负责人审核
3. 更新版本号与修订日期
4. 同步受影响的配套文件（`README.md`, `AGENTS.md`, `TEMPLATE.md`, `STATUS.yaml`, 测试规范等）

### 18.2 必须同步的下游文档

- 根 `README.md`
- 根 `AGENTS.md`
- 根 `CLAUDE.md`
- 根 `TEMPLATE.md`
- `docs/规范/测试规范.md`
- `docs/总体设计/详细设计/` 与 `docs/总体设计/实施计划/` 中相关文档
- 根 `STATUS.yaml`

### 18.3 本版主要变更

**v4.2** (2026-07-02)：

- §3.2 ADR-012 后果详述新增 `build:cross-platform-utils`、`dev:taro:weapp`、`build:taro:weapp`、`dev:taro:h5`、`build:taro:h5` 等根脚本说明
- §4 仓库顶层结构：新增 `apps/taro-miniapp`（candidate）、`packages/cross-platform-utils`（candidate）
- §5.2 正式依赖方向：新增 `cross-platform-utils → shared-utils + design-tokens` 和 `taro-miniapp → cross-platform-utils + shared-service + shared-utils` 依赖链路
- §5.4 包间依赖矩阵：新增 `cross-platform-utils` 行（依赖 shared-utils + design-tokens，禁止 UI 框架/React/DOM）和 `apps/taro-miniapp` 行（依赖 cross-platform-utils + shared-service + shared-utils，禁止 React 19/DOM/shared-ui/mock）
- §6.4 新增跨端运行时适配层（`cross-platform-utils`）职责说明，含 storage/http/theme/locale 四个子模块
- §6.5 宿主层新增 `apps/taro-miniapp` 小节（React 18 + Taro 3/4，输出微信小程序 + H5）
- §17 包治理状态：`apps/react-app` 更新为 stable，新增 `packages/cross-platform-utils: candidate` 和 `apps/taro-miniapp: candidate`；移除已不存在的 `react-screen-designer: experimental` 条目

**v4.1** (2026-07-01)：

- 新增 §11.4「开发纪律」：将 Karpathy 编码准则（先思考、简化优先、精准修改、清理残留、目标驱动）纳入仓库治理与质量门禁
- 同步更新根 `README.md` 关键运行时约束，引用 `AGENTS.md` 编码代理修改纪律

**v4.0** (2026-06-30)：

- 新增 ADR-011：合并 `shared-types`、`shared-i18n`、`resources` 包，精简共享包结构（8 包 → 5 包，另保留 `shared-workflow` 规划包）
- §4 仓库顶层结构：移除 `shared-types/`、`shared-i18n/`、`resources/`、`shared-workflow/`；`shared-utils/` 承接类型契约 + 国际化 + 通用工具
- §5.1 层次划分：基础共享层从 4 包收缩为 2 包（`shared-utils` + `design-tokens`）
- §5.2 正式依赖方向：重绘依赖图，`shared-utils` 为最底层零 workspace 依赖包
- §5.3 依赖检查规则：`shared-utils` 零 workspace 依赖约束；新增 `@repo/shared-types` 和 `@repo/shared-i18n` 禁止依赖规则
- §5.4 包间依赖矩阵：删除 `shared-types`、`shared-i18n`、`resources`、`shared-workflow` 行；`design-tokens` 可依赖项改为 `shared-utils`
- §6.1 删除 `shared-types`、`shared-i18n` 独立小节；扩写 `shared-utils` 小节（新增类型契约、国际化运行时职责）
- §6.2 `shared-service` 类型消费来源更新为 `shared-utils/api-contract`
- §6.3 `shared-ui` 类型契约来源更新为 `@repo/shared-utils/ui-contract`；删除 `shared-workflow` 小节
- §17 包治理状态：删除 `shared-types`、`shared-i18n`、`resources` 条目，标注已合并/并入

**v3.0** (2026-06-26)：

- 新增 ADR-010：废弃 `shared` 包，新建 `shared-types` 纯类型契约包
- §4 仓库顶层结构：新增 `shared-types`，移除 `shared`
- §5.1 层次划分：基础共享层新增 `shared-types`
- §5.2 正式依赖方向：重绘依赖图，`shared-types` 为最底层零依赖包；新增 `@repo/shared` 禁止依赖约束
- §5.3 依赖检查规则：`shared-types` 零依赖约束；基础层可依赖 `shared-types`；新增 `shared` 禁止依赖规则
- §5.4 包间依赖矩阵：新增 `shared-types` 行；`design-tokens` 可依赖项从"无"改为 `shared-types`；`shared-utils` 可依赖项新增 `shared-types`；`shared-service` 可依赖项新增 `shared-types`；`shared-ui` 可依赖项新增 `shared-types`
- §6.1 新增 `shared-types` 包职责说明；`design-tokens` 新增依赖说明；`shared-utils` 新增依赖说明
- §6.2 `shared-service` 新增类型消费说明，`request/` 重导出清理
- §6.3 `shared-ui` 新增类型契约来源说明
- §17 包治理状态：新增 `shared-types: stable`，标注 `shared` 已废弃
- §6.3 `shared-ui` 新增 shadcn/ui 组件封装说明，引用专题设计文档
- 新增专题设计文档 `docs/总体设计/详细设计/专题-UI主题增强与组件库设计.md`，覆盖主题增强、组件库封装、展示页面设计

**v2.2** (2026-06-26)：

- §6.3 `shared-ui` 新增 shadcn/ui 组件封装说明，引用专题设计文档
- 新增专题设计文档 `docs/总体设计/详细设计/专题-UI主题增强与组件库设计.md`，覆盖主题增强、组件库封装、展示页面设计

**v2.1** (2026-06-25)：

- 新增 ADR-008：HTTP 客户端从 axios 迁移到 ky（供应链安全 + 零依赖 + 现代\_fetch 封装）
- 新增 ADR-009：引入 TanStack Query 作为服务端状态管理层
- §1.3 术语表新增 `HttpClient`、`TanStack Query` 条目
- §3.2 架构重议触发条件新增 ky 停止维护条件
- §5.3 依赖检查规则：`shared-service` 禁止直接依赖 `ky`、`axios`，仅通过 `HttpClient` 接口访问
- §5.4 包间依赖矩阵：`shared-utils` 新增 `ky` 可依赖项；`shared-service` 移除 `axios`，可依赖项改为 `shared-utils, msw`，禁止项新增 `ky, axios`；`apps/react-app` 新增 `@tanstack/react-query`
- §6.1 `shared-utils` 新增 `HttpClient` 接口抽象（含 `get/post/put/delete` 四个方法）、ky 适配器实现，新增 `uploadWithProgress` 工具函数（XHR 封装）用于上传场景
- §6.2 `shared-service` 新增 HTTP 访问约束（仅依赖 `HttpClient` 接口）和服务端状态消费说明（通过 TanStack Query 消费，禁止组件直接调用 httpClient）
- §6.4 宿主技术栈新增 TanStack Query，启动链新增 QueryClient 步骤
- §7.1 启动链新增"创建 TanStack Query QueryClient 实例"步骤
- §7.3 数据访问链全面更新：常规请求链路（HttpClient → TanStack Query → 组件）、上传请求链路（XHR 封装）、架构约束
- §12 技术栈表：`Axios ^1.7` 替换为 `ky ^1.8`，新增 `@tanstack/react-query ^5.0`，补充 ky 与上传场景说明

**v2.0** (2026-06-25)：

- ADR-003 变更：组件库从 Ant Design 6 切换为 shadcn/ui + Tailwind CSS
- 新增 ADR-007：采用 Tailwind CSS 替代 UnoCSS 作为原子化 CSS 方案
- §3.2 架构重议触发条件：Ant Design 条件替换为 Radix UI/shadcn/ui，新增 Tailwind CSS 条件
- §5.3 依赖检查规则：`shared-service` 禁止依赖 `@radix-ui/*`，移除 `@antv/g2`
- §5.4 包间依赖矩阵：`shared-i18n` 移除 `antd`，`shared-ui` 依赖 `@radix-ui/*` + `tailwindcss`
- §6.1 `design-tokens` 子路径从 `./antd-theme`, `./uno-preset` 变更为 `./tailwind-preset`
- §6.1 `shared-i18n` 移除 Ant Design locale 映射，i18n 改为组件直接消费
- §6.3 `shared-ui` 封装基础从 Ant Design 变更为 shadcn/ui，样式控制从 ConfigProvider 变更为 Tailwind + CSS 变量
- §6.4 宿主技术栈更新
- §7.1 启动链移除 ConfigProvider 步骤，CSS 注入从 UnoCSS 变更为 Tailwind
- §8 国际化方案移除 ConfigProvider locale 联动
- §12 技术栈与版本管理表全面更新
- §16.2 模板裁剪指南更新

**v1.2** (2026-05-19)：

- §3.2 新增“架构重议触发条件”清单
- §6.2 新增“多租户与数据权限扩展预留”说明
- 新增 §16 模板裁剪与扩展指南

**v1.1** (2026-05-19)：

- ADR 索引表增加“正式文档”列，标注 ADR-002/003 待补全
- §5.3 依赖检查规则补充脚本路径引用
- §6.3 `shared-ui` 新增封装模式分层说明
- §10 测试覆盖率补充“核心路径”判定标准
- §12 Ant Design 版本加注“以 catalog 实际锁定版本为准”，并补充 AntV G2 版本行
- 新增 §17 包治理状态章节及 `STATUS.yaml` 初始定义
- 原 §17 文档修订同步调整为 §18

**v1.0** (2026-05-19)：

- 初始版本，从跨框架设计中剥离出 React 单框架设计方案
- 组件库选定 Ant Design 6
- 移除所有 Vue 相关内容
- ADR 体系重新建立
- 共享包简化，仅保留 React 实现

---

**本设计文档为仓库唯一架构真相源，任何技术实现、包边界调整、宿主扩展均需与此文档对齐。**
