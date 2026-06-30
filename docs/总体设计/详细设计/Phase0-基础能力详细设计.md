# Phase 0 基础能力详细设计

> 制定日期：2026-05-15
> 最近修订：2026-06-30> 适用阶段：Phase 0
> 文档性质：基础能力阶段详细设计
> 上游设计：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`

## 1. 文档定位

本文档合并 Phase 0 的三块基础能力设计：

- `0.1 工程基线`
- `0.2 主题与共享 UI`
- `0.3 国际化`

本文档只维护 Phase 0 的设计目标、边界、分层与正式契约，不承接任务拆解或完成态记录。

## 2. 阶段目标与边界

Phase 0 只回答一件事：如何把仓库收敛为一个可验证、可扩展、可维护的前端 monorepo 基线，并补齐 React 平台后续阶段依赖的主题、共享 UI 与国际化基础设施。

### 2.1 本阶段要交付

- workspace 结构与统一脚本契约
- Vite / Vitest / TypeScript / ESLint / Stylelint / Prettier 基线
- 文档主入口与索引关系
- 共享主题运行时与 React 共享 UI 基线
- 共享 i18n 运行时与双语词典基线

### 2.2 本阶段不交付

- 平台共享内核
- Mock 数据域主链路
- 业务样例页面体系
- 产品化发行闭环

## 3. 0.1 工程基线

### 3.1 工程结构设计

根目录承载仓库级约定，不承载业务实现。

正式 workspace 结构：

```text
apps/
  react-app/
packages/
  shared-utils/
  shared-service/
  design-tokens/
  mock/
  shared-ui/
```

> **注意**：`shared` 包已废弃（ADR-010），`shared-types`、`shared-i18n`、`resources` 已合并至 `shared-utils` 或 `react-app`（ADR-011）。

### 3.2 脚本与配置契约

根脚本继续保留：

- `build`
- `build:shared`
- `build:react`
- `typecheck`
- `lint`
- `stylelint`
- `test`
- `test:watch`
- `test:coverage`
- `check:alias`
- `verify`

统一采用包装脚本：

- `scripts/vite.cjs`
- `scripts/vitest.cjs`
- `scripts/run-vite-bin.cjs`

测试配置职责固定为：

- 根 `vitest.config.ts` 只做 workspace 聚合
- app / package 级 `vitest.config.ts` 只做项目级配置

### 3.3 文档入口设计

- 根 `README.md`：模板消费者入口
- 根 `AGENTS.md`：维护约束入口
- `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`：唯一上游概要设计
- `docs/总体设计/详细设计/`：分阶段详细设计目录
- `docs/教程/README.md`：教程索引
- `docs/规范/README.md`：规范索引

## 4. 0.2 主题与共享 UI

### 4.1 设计目标

- 将 `packages/design-tokens` 收敛为主题内核
- 支持运行时 `light / dark / system` 模式切换
- 以 `packages/shared-ui` 作为唯一正式共享 UI 壳
- 将 React app 收敛为统一 Provider 接入方式

### 4.2 总体方案

采用”主题内核 + React 共享组件包 + app 接入层”的结构：

- `packages/shared-utils`
  - 承载跨包共享的纯类型契约（`./ui-contract`、`./api-contract`、`./routes` 子路径导出）
  - 承载通用运行时工具与 HTTP 客户端接口（`./http` 子路径导出）
  - 承载国际化运行时（`./i18n` 子路径导出）
  - 零 workspace 包依赖
- `packages/design-tokens`
  - 管理主题注册表、语义 token、主题快照、CSS 变量、Tailwind CSS 主题配置
  - 仅依赖 `shared-utils`（消费 `ThemeName`、`ThemeMode` 等类型）
- `packages/shared-ui`
  - 封装 React 公共组件（基于 shadcn/ui）
  - 不保存主题状态，只消费主题结果
- `apps/react-app`
  - 持有 `themeName`、`preference`、`resolvedMode`
  - 通过 Provider 注入主题上下文

正式原则：

- 主题定义集中在 `design-tokens`
- 组件实现集中在 `shared-ui`
- app 只负责选择当前主题并组合页面

### 4.3 主题与共享 UI 正式契约

- `ThemePreference = 'system' | 'light' | 'dark'`
- 主题运行时优先收敛到 `@repo/design-tokens/theme`
- `@repo/design-tokens` 根入口承载 token、CSS 变量和 Tailwind 主题适配
- 跨包共享的类型契约（`ThemeName`、`ThemeMode`、`StatusTone` 等）定义在 `@repo/shared-utils/ui-contract`，`design-tokens` 和 `shared-ui` 从中消费
- 共享 UI 样式只能由 React app 在 `bootstrap.tsx` 中显式引入 `@repo/shared-ui/style.css`
- `main -> bootstrap -> App` 分层不得破坏
- `index.html` 必须在 `main.tsx` 前加载 `/theme-init.js`
- 所有组件样式通过 CSS 变量和 Tailwind CSS 类名控制，禁止硬编码颜色、字号等视觉属性
- shadcn/ui 组件源码通过 CLI 生成到 `packages/shared-ui/src/components/ui/`，可完全自定义
- `@repo/shared` 包已废弃（ADR-010），禁止新增任何 import；`@repo/shared-types` 和 `@repo/shared-i18n` 已合并至 `shared-utils`（ADR-011），禁止新增任何 import

### 4.4 主题与共享 UI 增强设计

Phase 0 基线建立后，主题系统与组件库的增强设计见专题文档：

- **`docs/总体设计/详细设计/专题-UI主题增强与组件库设计.md`**

该专题文档覆盖以下增强内容：

- **设计令牌增强**：新增动效 (motion)、层级 (zIndex)、透明度 (opacity)、过渡 (transitions) 四类 token；扩展颜色系统（主色色阶、secondary/accent/destructive 语义色、交互态颜色）
- **暗色主题自动派生**：通过 `deriveDarkFromLight()` 纯函数从亮色快照派生暗色快照，新增主题变体时无需手动维护暗色值
- **compact 主题变体**：更紧凑的间距和圆角，与 default 主题同色系
- **shadcn/ui CSS 变量桥接**：将 design-tokens 变量映射到 shadcn/ui 期望的变量名空间，确保主题切换自动联动
- **shadcn/ui 组件封装**：基于 Radix UI 原语 + CVA + Tailwind CSS，分三个 Tier 封装约 30 个常用组件
- **组件展示页面**：在 react-app 中新增 `/components` 路由展示所有组件用法

### 4.5 主题与共享 UI 正式契约（增强）

在 §4.3 契约基础上，新增以下契约条款：

- ThemeSnapshot 支持交互态颜色字段（`colorBgHover`、`colorBgPressed`、`colorBgSelected`、`colorBorderHover`、`colorBorderFocus`、`colorDestructive` 等）
- 暗色主题通过 `deriveDarkFromLight()` 派生，禁止手动维护暗色快照
- 主题名支持 `default` 和 `compact` 两种变体
- 桥接变量（`--background`、`--primary` 等）通过 `var(--color-*)` 引用 design-tokens 变量，禁止重复声明值
- 新组件必须使用 shadcn/ui 模式（`forwardRef` + `cva` + `cn()`），放入 `components/ui/`
- 现有 `.repo-*` 组件 API 不变，直到显式迁移

## 5. 0.3 国际化

### 5.1 设计目标

- 仅支持 `zh-CN` 与 `en-US`
- 在 `packages/shared-utils/i18n` 中建立共享 i18n 运行时
- 在 React app 建立统一的 locale 初始化、持久化与切换链路
- 去除共享组件中的内部硬编码英文

### 5.2 总体方案

采用“共享 i18n 内核 + React app 轻量接入 + 共享组件不持有翻译运行时”的方案。

分层如下：

- `packages/shared-utils`（`./i18n` 子路径）
  - 提供 `@repo/shared-utils/i18n`
  - 承载 locale 类型、词典结构、fallback 规则、浏览器语言探测、localStorage 持久化与翻译函数
- `apps/react-app`
  - 建立 locale store 与 provider/hook
  - 负责组装 shared messages 与 app messages
  - 负责语言切换入口与页面级文案消费
- `packages/shared-ui`
  - 不直接依赖 `@repo/shared-utils/i18n`
  - 仅消费外部传入的翻译后文案

### 5.3 i18n 正式契约

- `@repo/shared-utils/i18n` 是唯一共享国际化运行时
- 当前正式支持语言只有 `zh-CN` 与 `en-US`
- 正式 locale 持久化 key：`repo-locale`
- 共享组件不承接翻译运行时，只接收翻译后的文本 props

## 6. Phase 0 总体验收标准

- 工程基线、主题、共享 UI 与国际化基线按阶段边界完成收敛
- `main -> bootstrap -> App` 启动链稳定
- `README.md` / `AGENTS.md` / `TEMPLATE.md` 与总体设计一致
- 根 `verify` 可以作为统一收口入口
