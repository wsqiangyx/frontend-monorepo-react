# CLAUDE.md

> 本文件是 **Claude Code CLI**（claude.ai/code）的项目级指令文件。当 Claude Code 在本仓库启动时，会自动加载本文件作为系统上下文。
>
> 若你使用 **Codex CLI**，项目级指令入口为根目录的 [`AGENTS.md`](./AGENTS.md)。两个文件是不同 CLI 工具各自的项目级指令入口，核心维护约束保持一致；Codex 用户可直接阅读本文件获取完整仓库约束。

## 权威约束源

**`AGENTS.md` 是本仓库的权威维护约束文档。** 所有硬性约束、目录职责、修改边界、治理规则均以 `AGENTS.md` 为准。本文件仅补充 Claude Code 运行必需的精简信息，不重复 `AGENTS.md` 中的完整约束条目。两个文件是不同 CLI 工具各自的项目级指令入口，核心维护约束保持一致。

在执行任何涉及架构边界、包职责、脚本契约、依赖方向、主题/i18n/mock 正式契约的修改前，**应先查阅 `AGENTS.md` 对应章节**。`AGENTS.md` 中的"硬性约束""目录职责""修改建议"章节定义了本仓库的核心边界，执行具体修改前务必优先查阅。Codex CLI 用户直接读取 `AGENTS.md` 作为项目级指令。

## 编码行为准则

本仓库所有代码改动以 [Karpathy 编码准则](https://x.com/karpathy/status/2015883857489522876) 为基础行为约束，优先谨慎而非速度。Claude Code 在执行任何修改前，应默认遵循以下纪律：

### 1. 先思考，再编码

- 明确陈述假设；不确定时停下来提问。
- 存在多种解释时，列出选项，不要静默选择。
- 优先提出更简单方案；必要时对过度设计说"不"。

### 2. 简化优先

- 只实现请求的功能，不添加未要求的"灵活性"。
- 不为单次使用创建抽象。
- 不处理不可能发生的错误场景。

### 3. 精准修改

- 只修改完成任务所必需的代码。
- 不改写与请求无关的相邻代码、注释或格式。
- 匹配现有风格；不"改进"未损坏的部分。
- 删除因本次改动产生的无用导入/变量/函数，不动预存在的死代码。

### 4. 清理自己的残留

- 删除因本次改动产生的无用导入、变量、函数。
- 不动预存在的死代码（除非明确要求清理）。
- 不要留下临时注释、调试语句或已废弃的替代实现。

### 5. 目标驱动

- 将任务转化为可验证目标。
- 多步骤任务给出简短计划，每步附带验证方式。
- 修改后运行相关验证（测试、类型检查、lint、构建），直到成功标准满足。

这些纪律是 `AGENTS.md` 中"编码代理修改纪律"的具体化；若与既有技术约束冲突，优先停下来澄清，而非静默扩展范围。

## 核心约束摘要

以下约束来自 `AGENTS.md` 的"硬性约束"与"目录职责"章节，是 Claude Code 执行修改前必须了解的核心边界。完整解释、例外情况和违反后果请查阅 `AGENTS.md` 原文。

1. **不要破坏 workspace 脚本契约**：根目录必须保留 `build`、`build:shared`、`build:react`、`typecheck`、`lint`、`stylelint`、`test`、`test:watch`、`test:coverage`、`test:scripts`、`check:alias`、`check:status`、`verify`；每个 app / package 必须保留 `test`、`test:watch`、`test:coverage`。
2. **统一使用包装脚本**：所有 workspace 脚本必须通过 `scripts/vite.cjs` 和 `scripts/vitest.cjs` 执行，不得直接调用 `vite`/`vitest` 二进制。
3. **Vite / Vitest / TSConfig 的 alias 必须同步**：修改 `vite.config.ts` 时，同步检查 `vitest.config.ts`、`paths.config.ts`、`tsconfig.app.json`；当前已使用到的共享包源码入口，必须在 `tsconfig.app.json` 中镜像 path mappings。alias 变更后运行 `pnpm check:alias`。
4. **保持 `main.tsx` 与 `bootstrap.tsx` 分层**：MSW 启动逻辑保留在 `main.tsx`，主题 Provider 与挂载逻辑保留在 `bootstrap.tsx`。
5. **显式引入共享 UI 样式**：React app 的 `bootstrap.tsx` 必须显式引入 `@repo/shared-ui/style.css`。
6. **`packages/shared-service` 保持框架无关**：不直接依赖 React、DOM 或浏览器 API；只承载平台内核（认证、菜单、权限、多标签页、平台请求契约）。
7. **`packages/shared-ui` 不直接依赖 `@repo/shared-utils/i18n`**：只消费翻译后的文案 props，国际化运行时在 app 层接入。
8. **Mock 是正式后端替身**：`packages/mock` 同时服务开发态与测试态，不要在 React app 内再写一套独立假数据源。
9. **package 的 `exports` 只指向 `dist/`**：源码 alias 只是开发/测试的便利手段，不是公共契约。
10. **修改公共契约前查阅 `AGENTS.md`**：涉及 `packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui` 任一包的公共契约时，先查阅 `AGENTS.md` 对应约束再选择 agent / skill。

## 项目概述

React 中后台前端平台 Monorepo —— 一个用于构建中后台前端平台的 Git 模板仓库。基于 React 19 + shadcn/ui + Tailwind CSS v4 的 `apps/react-app` 应用壳，Mock 驱动开发（无真实后端），pnpm workspaces monorepo。跨端扩展已纳入 ADR-012 规划，`apps/taro-miniapp` 使用 React 18 + Taro 3+/4。

- **Node**：24.15.0（`.nvmrc`）
- **pnpm**：10.33.1（Corepack）
- **TypeScript**：6.0.3，严格模式
- **React 版本**：`apps/react-app` 使用 React 19；`apps/taro-miniapp` 使用 React 18

## 常用命令

```bash
# 开发
pnpm install
pnpm dev:react              # 启动 React 应用开发服务器

# 构建
pnpm build:shared           # 构建全部 5 个共享包（app 构建前必须先执行）
pnpm build:react            # 构建共享包 + React 应用
pnpm build                  # 等同于 build:react

# 测试
pnpm test                   # 顺序运行所有 workspace 测试
pnpm test:watch             # 监听模式（通过包装脚本）
pnpm test:coverage          # 运行所有测试并生成覆盖率报告
pnpm test:scripts           # 通过 Node test runner 运行 scripts/__tests__/*.test.mjs

# 代码检查与格式化
pnpm lint                   # ESLint
pnpm lint:fix               # ESLint --fix
pnpm stylelint              # Stylelint（SCSS/CSS）
pnpm format                 # Prettier --write
pnpm format:check           # Prettier --check
pnpm typecheck              # TypeScript 类型检查（会先构建共享包）

# 完整验证
pnpm verify                 # format:check → lint → stylelint → typecheck → check:alias → check:status → check:phase2-consistency → verify:mock-worker → test → test:scripts → build → template:check

# 单包命令
pnpm -F @repo/shared-utils test          # 运行单个包测试
pnpm -F @repo/shared-ui test:watch       # 单个包监听测试
pnpm -F @repo/react-app dev              # 单个应用开发

# 工具脚本
pnpm check:alias             # 验证 vite/vitest/tsconfig 的 alias 一致性
pnpm check:status            # 验证 STATUS.yaml 与根脚本、测试矩阵的一致性
pnpm check:phase2-consistency # 验证 Phase 2 业务样例与路由/菜单/契约的一致性
pnpm sync:mock-worker        # 同步 MSW worker 产物
pnpm template:check          # 检查模板残留
```

## 架构

```
apps/react-app  ←  composition root（组合根），依赖所有包
      │
packages/shared-ui   ←  React 共享 UI（ThemeProvider、shadcn/ui 组件）
packages/mock        ←  MSW handlers（开发 + 测试双环境）
      │
packages/shared-service  ←  平台内核（认证、菜单、权限、工作区标签页）
      │                      框架无关，不依赖 React / DOM
packages/design-tokens   ←  设计令牌、CSS 变量、Tailwind 主题、主题运行时
packages/shared-utils    ←  类型契约 + 工具函数 + HTTP 客户端 + i18n
                            零 workspace 依赖（ADR-011）
```

**构建依赖顺序**（由 `build:shared` 强制）：
shared-utils → shared-service → design-tokens → mock → shared-ui

> **ADR-012 跨端扩展（规划）**：
>
> - `apps/taro-miniapp`：Taro 3+/4 小程序宿主，React 18，输出微信小程序 / 支付宝小程序 / H5
> - `apps/expo-mobile`：Expo / React Native 移动 App 宿主
> - `packages/cross-platform-utils`：跨端运行时适配层（HTTP、Storage、Theme、Locale）
> - `packages/cross-platform-ui`：跨端 UI 组件库
> - `packages/cross-platform-mock`：跨端 Mock 数据生成
>   这些目录当前处于 candidate / experimental 状态，尚未纳入默认验证链路。

## 关键模式

### 源码 alias 与构建 alias 的二元性

- **开发/测试**：alias 指向 `packages/*/src/`，用于热更新和直接访问源码
- **构建/生产**：通过包的 `exports` 使用 `dist/`
- 修改 `vite.config.ts` 时，同步检查 `vitest.config.ts`、`paths.config.ts`、`tsconfig.app.json`
- alias 变更后运行 `pnpm check:alias`

### 应用启动链

`index.html` → `/theme-init.js`（生成产物） → `main.tsx`（MSW 初始化） → `bootstrap.tsx`（ThemeProvider + 渲染）

- MSW 启动逻辑保留在 `main.tsx`，主题/Provider 保留在 `bootstrap.tsx` —— 不要混用

### 包装脚本

所有 workspace 脚本都使用 `scripts/vite.cjs` 和 `scripts/vitest.cjs`，而非直接使用 `vite`/`vitest` 二进制（Windows 兼容性）。不要绕过此模式。

### 包导出

所有包的 `exports` 只指向 `dist/`。源码 alias 只是开发/测试的便利手段，不是公共契约。

### 治理

- `STATUS.yaml` 是 package / app 治理状态的唯一来源
- `AGENTS.md` 是权威维护约束文档 —— 详细信息请查阅该文件

## 代码规范

### `apps/react-app`

- 主题通过 `@repo/shared-ui` 的 `ThemeProvider` 接入，app 内主题状态通过 Zustand store 管理。
- `bootstrap.tsx` 必须显式引入 `@repo/shared-ui/style.css`。
- HTTP 客户端工厂在 `services/http-client.ts`，通过 `createPlatformClient()` 创建统一实例。
- token 注入通过 `registerTokenProvider()` 延迟注册，避免与 auth-store 的模块循环。
- 401 未授权通过 `setOnUnauthorized()` 注册全局处理器，自动清除会话并重定向到 `/login`。
- 所有 API 请求必须通过 `services/shared.ts` 导出的 `api` 实例发出，不要在 store 中自建 `createHttpClient`。
- `mockServiceWorker.js` 在生产构建时通过 Vite `closeBundle` 插件自动从 `dist/` 删除。

## 移动端约束

### `apps/taro-miniapp`（ADR-012，candidate）

- Taro 3+/4 小程序宿主，使用 React 18 / TSX 语法。
- 输出微信小程序、支付宝小程序、H5，可选输出 React Native。
- 依赖 `@repo/cross-platform-utils`、`@repo/cross-platform-ui`、`@repo/cross-platform-mock`。
- 复用 `@repo/shared-service` 与 `@repo/shared-utils` 的平台内核和类型契约。
- 主题、网络、Storage 通过 `cross-platform-utils` 接入，不直接操作 `localStorage` 或 `fetch`。
- 不直接依赖 `@repo/shared-ui`，通过 `@repo/cross-platform-ui` 消费跨端组件。

### `apps/expo-mobile`（ADR-012，规划中）

- Expo / React Native 移动 App 宿主。
- 依赖 `@repo/cross-platform-utils`、`@repo/cross-platform-ui`、`@repo/cross-platform-mock`。
- 复用 `@repo/shared-service` 与 `@repo/shared-utils` 的平台内核和类型契约。
- 使用 Expo Router 进行文件系统路由，与现有 Web 路由概念对齐。
- 通过 EAS Build 进行原生构建，EAS Update 提供热更新。

## 代码风格

- **Prettier**：`semi: false`、`singleQuote: true`、`trailingComma: 'all'`、`printWidth: 100`、`endOfLine: 'lf'`
- **ESLint**：Flat config（`eslint.config.js`）、`typescript-eslint`、React 插件。不要回退到 `.eslintrc*`
- **Stylelint**：SCSS 标准 + 属性排序 + BEM 命名
- **Commitlint**：通过 `commit-msg` 钩子强制使用 Conventional Commits
- **TypeScript**：`noUnusedLocals: true`、`noUnusedParameters: true`、`isolatedModules: true`

## 测试

- **Vitest** Projects 模式：根 `vitest.config.ts` 聚合 workspaces；每个 package/app 使用 `defineProject`
- **环境**：React 应用测试使用 jsdom
- **库**：`@testing-library/react`、`@testing-library/jest-dom`、`msw`
- 根 `vitest.config.ts` 只负责聚合 —— 每个项目的配置放在各自 workspace 的 `vitest.config.ts` 中

## 依赖管理

- 工具链依赖声明在根 `package.json` 的 `devDependencies` 中 —— 子包不重复安装
- 运行时依赖在实际消费处声明
- `pnpm-workspace.yaml` 的 `catalog:` 固定共享运行时版本（React、zustand、ky 等）
- `pnpm-workspace.yaml` 的 `overrides:` 锁定关键工具链版本（TypeScript、Vitest、ESLint、sass、jsdom）

---

> 以下内容为当前维护者的 Claude Code 环境配置说明。模板使用者如果未同时安装 Superpowers 与 ECC 插件，可忽略此部分。

## Superpowers 与 ECC 冲突处理

本仓库同时使用 Superpowers skills 与 ECC agents（`~/.claude/rules/common/agents.md`）。两者在代码审查（code-review）、规划（planning）、测试驱动开发（TDD）、安全（security）、验证（verification）等维度存在能力重叠，且其 hooks 可能合并触发相同事件，导致冲突。以下为项目级处理规则。

### 避免 hooks 冲突

ECC 的 hooks 可能与 Superpowers 的 hooks 相互覆盖，建议在启动 Claude Code 时禁用 ECC hooks：

```bash
# macOS / Linux
export ECC_SKIP_HOOKS=1

# Windows PowerShell
$env:ECC_SKIP_HOOKS = "1"
```

这样 Superpowers 可继续拥有 hook 层，而 ECC 的专用技能仍可通过名称显式调用。

### 分工原则

重叠领域默认使用 **Superpowers**；ECC 仅用于 Superpowers 未覆盖或需要更专业视角的领域。下表直接给出每个场景的首选插件和具体命令/技能。

| 场景             | 首选插件    | 命令 / 技能                                                     |
| ---------------- | ----------- | --------------------------------------------------------------- |
| 代码审查         | Superpowers | `/code-review`                                                  |
| 实施规划         | Superpowers | `/write-plan`                                                   |
| TDD              | Superpowers | `/tdd`                                                          |
| 变更验证         | Superpowers | `/verify`                                                       |
| 安全扫描         | ECC         | `@security-reviewer`                                            |
| 构建失败         | ECC         | `@build-error-resolver`                                         |
| E2E 测试         | ECC         | `@e2e-runner`                                                   |
| 重构清理         | ECC         | `@refactor-cleaner`                                             |
| 文档更新         | ECC         | `@doc-updater`                                                  |
| 语言特定审查     | ECC         | 对应 reviewer（如 `@rust-reviewer`、`@python-reviewer`）        |
| 复杂架构决策     | ECC         | `@planner` / `@architect`（跨包架构变更、新增 ADR、多目录重构） |
| 安全敏感代码审查 | ECC         | `@security-reviewer`（auth / 支付 / 用户数据 / 外部 API）       |

**默认使用 Superpowers 的场景**：

- 属于日常开发高频、标准化流程（如代码审查、写计划、TDD、验证当前改动）。
- 任务范围明确，主要在当前仓库内完成，不需要跨多个子系统或引入新的架构决策。
- 使用 `/skill-name` 调用更快捷，且 Superpowers 已覆盖该场景的标准化检查项。

**升级到 ECC 的场景**：

- 涉及安全敏感代码（auth、支付、用户数据、外部 API 调用等），需要专用安全视角审查。
- 跨包架构变更、新增 ADR、多目录重构，需要更系统的实施规划或架构设计。
- 构建失败、E2E 测试、重构清理、文档更新等 Superpowers 未专门覆盖的领域。
- 需要语言特定审查（如 Rust、Python、Go 等）时，使用对应 ECC reviewer agent。

### 冲突解决规则

- 如果任务同时涉及 Superpowers 和 ECC 的能力重叠（如审查或规划），默认使用 **Superpowers**，不调用对应的 ECC 技能。
- 仅在 Superpowers 没有对应能力或能力不足时，才使用 ECC 的专用技能。
- 如果安装 ECC 后 `/` 斜杠菜单中的命令或技能消失，应禁用 ECC 或设置 `ECC_SKIP_HOOKS=1` 后重启 Claude Code。
- 禁止在同一轮次中重复触发功能重叠的 agent / skill。

### 重复触发示例

以下组合属于功能重叠，禁止在同一次任务中同时调用：

- `/code-review` + `@code-reviewer`（同一批改动的代码审查）
- `/verify` + 手动运行 `pnpm verify` 后再用 `@build-error-resolver`（同一验证目标）
- `/write-plan` + `@planner`（同一规划任务）
- `/tdd` + 手动 `pnpm test` 循环（同一测试验证目标）

**正确做法**：根据上表选择默认或升级后的单一能力，按该能力的输出结果推进；若发现其输出不足，再考虑在下一轮任务中换用另一种能力，而不是同一轮内堆叠。

### 本项目硬约束

- 所有 agent / skill **必须**使用项目脚本执行验证：`pnpm verify`、`pnpm test`、`pnpm typecheck`、`pnpm build`。不得自行推断命令。
- 单包操作使用 `pnpm -F <workspace> <script>`，不直接 cd 进子包执行裸命令。
- 修改涉及 `packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui` 任一包的公共契约时，先查阅 `AGENTS.md` 对应约束再选择 agent。
