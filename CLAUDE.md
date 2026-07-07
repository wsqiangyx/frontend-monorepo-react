# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 权威约束源

**`AGENTS.md` 是本仓库的权威维护约束文档。** 所有硬性约束、目录职责、修改边界、治理规则均以 `AGENTS.md` 为准。本文件仅补充 Claude Code 运行必需的精简信息，不重复也不覆盖 `AGENTS.md` 中的任何条目。

在执行任何涉及架构边界、包职责、脚本契约、依赖方向、主题/i18n/mock 正式契约的修改前，**必须先查阅 `AGENTS.md` 对应章节**。

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

### 4. 目标驱动

- 将任务转化为可验证目标。
- 多步骤任务给出简短计划，每步附带验证方式。
- 修改后运行相关验证（测试、类型检查、lint、构建），直到成功标准满足。

这些纪律是 `AGENTS.md` 中"编码代理修改纪律"的具体化；若与既有技术约束冲突，优先停下来澄清，而非静默扩展范围。

## Project Overview

React 中后台前端平台 Monorepo — a Git template repository for building back-office frontend platforms. React 19 + shadcn/ui + Tailwind CSS v4 application shell, mock-driven development (no real backend), pnpm workspaces monorepo.

- **Node**: 24.15.0 (`.nvmrc`)
- **pnpm**: 10.33.1 (Corepack)
- **TypeScript**: 6.0.3, strict mode

## Commands

```bash
# Development
pnpm install
pnpm dev:react              # Start React app dev server

# Building
pnpm build:shared           # Build all 5 shared packages (required before app)
pnpm build:react            # Build shared packages + React app
pnpm build                  # Same as build:react

# Testing
pnpm test                   # Run all workspace tests sequentially
pnpm test:watch             # Watch mode (via wrapper script)
pnpm test:coverage          # All tests with coverage
pnpm test:scripts           # Run scripts/__tests__/*.test.mjs via Node test runner

# Linting & Formatting
pnpm lint                   # ESLint
pnpm lint:fix               # ESLint --fix
pnpm stylelint              # Stylelint for SCSS/CSS
pnpm format                 # Prettier --write
pnpm format:check           # Prettier --check
pnpm typecheck              # TypeScript type checking (builds shared first)

# Full Verification
pnpm verify                 # format:check → lint → stylelint → typecheck → check:alias → check:status → check:phase2-consistency → verify:mock-worker → test → test:scripts → build → template:check

# Single package commands
pnpm -F @repo/shared-utils test          # Test one package
pnpm -F @repo/shared-ui test:watch       # Watch one package
pnpm -F @repo/react-app dev              # Dev one app

# Utilities
pnpm check:alias             # Verify alias consistency across vite/vitest/tsconfig
pnpm check:status            # Verify STATUS.yaml alignment with root scripts/test matrix
pnpm sync:mock-worker        # Sync MSW worker artifacts
```

## Superpowers + ECC 冲突处理

本仓库同时使用 Superpowers skills 与 ECC agents（`~/.claude/rules/common/agents.md`）。两者在 code-review、planning、TDD、security、verification 五个维度存在能力重叠。以下为项目级优先级规则：

### 优先级选择

| 场景         | 默认使用                       | 升级为 ECC                                                          |
| ------------ | ------------------------------ | ------------------------------------------------------------------- |
| 代码审查     | `/code-review`（Superpowers）  | `@security-reviewer`（仅涉及 auth / 支付 / 用户数据 / 外部 API 时） |
| 实施规划     | `/write-plan`（Superpowers）   | `@planner`（跨包架构变更）/ `@architect`（新增 ADR 或多目录重构）   |
| TDD          | `/tdd`（Superpowers）          | —                                                                   |
| 安全扫描     | `@security-reviewer`（ECC）    | —                                                                   |
| 变更验证     | `/verify`（Superpowers）       | —                                                                   |
| 构建失败     | `@build-error-resolver`（ECC） | —                                                                   |
| E2E 测试     | `@e2e-runner`（ECC）           | —                                                                   |
| 重构清理     | `@refactor-cleaner`（ECC）     | —                                                                   |
| 文档更新     | `@doc-updater`（ECC）          | —                                                                   |
| 语言特定审查 | 对应 reviewer（ECC）           | —                                                                   |

### 本项目硬约束

- 所有 agent / skill **必须**使用项目脚本执行验证：`pnpm verify`、`pnpm test`、`pnpm typecheck`、`pnpm build`。不得自行推断命令。
- 单包操作使用 `pnpm -F <workspace> <script>`，不直接 cd 进子包执行裸命令。
- 禁止在同一轮次中重复触发功能重叠的 agent / skill（如同时调用 `/code-review` 和 `@code-reviewer`）。
- 修改涉及 `packages/shared-utils`、`packages/shared-service`、`packages/design-tokens`、`packages/mock`、`packages/shared-ui` 任一包的公共契约时，先查阅 `AGENTS.md` 对应约束再选择 agent。

## Architecture

```
apps/react-app  ←  composition root, depends on ALL packages
      │
packages/shared-ui   ←  React shared UI (ThemeProvider, shadcn/ui components)
packages/mock        ←  MSW handlers (dev + test dual-environment)
      │
packages/shared-service  ←  Platform kernel (auth, menus, permissions, workspace tabs)
      │                      Framework-agnostic, no React, no DOM
packages/design-tokens   ←  Tokens, CSS vars, Tailwind theme, theme runtime
packages/shared-utils    ←  Type contracts + Utilities + HTTP client + i18n
                            ZERO workspace deps (ADR-011)
```

**Build dependency order** (enforced by `build:shared`):
shared-utils → shared-service → design-tokens → mock → shared-ui

## Key Patterns

### Source Alias vs Build Alias Duality

- **Dev/Test**: alias points to `packages/*/src/` for HMR and direct source access
- **Build/Production**: uses `dist/` via package `exports`
- When modifying `vite.config.ts`, sync `vitest.config.ts`, `paths.config.ts`, `tsconfig.app.json`
- Run `pnpm check:alias` after alias changes

### App Startup Chain

`index.html` → `/theme-init.js` (generated) → `main.tsx` (MSW init) → `bootstrap.tsx` (ThemeProvider + render)

- MSW startup stays in `main.tsx`, theme/Provider stays in `bootstrap.tsx` — do not mix

### Wrapper Scripts

All workspace scripts use `scripts/vite.cjs` and `scripts/vitest.cjs` instead of bare `vite`/`vitest` binaries (Windows compatibility). Do not bypass this pattern.

### Package Exports

All package `exports` point to `dist/` only. Source alias is dev/test convenience, not a public contract.

### Governance

- `STATUS.yaml` is the single source of truth for package/app governance status
- `AGENTS.md` is the authoritative maintenance constraints document — consult it for detailed rules

## Code Style

- **Prettier**: `semi: false`, `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`, `endOfLine: 'lf'`
- **ESLint**: Flat config (`eslint.config.js`), `typescript-eslint`, React plugin. Do not revert to `.eslintrc*`
- **Stylelint**: SCSS standard + property ordering + BEM naming
- **Commitlint**: Conventional Commits enforced via `commit-msg` hook
- **TypeScript**: `noUnusedLocals: true`, `noUnusedParameters: true`, `isolatedModules: true`

## Testing

- **Vitest** with Projects mode: root `vitest.config.ts` aggregates workspaces; each package/app uses `defineProject`
- **Environment**: jsdom for React app tests
- **Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, `msw`
- Root `vitest.config.ts` is aggregation only — per-project config goes in each workspace's `vitest.config.ts`

## Dependency Management

- Toolchain deps declared in root `package.json` `devDependencies` — sub-packages don't reinstall them
- Runtime deps declared where consumed
- `pnpm-workspace.yaml` `catalog:` pins shared runtime versions (React, zustand, ky, etc.)
- `pnpm-workspace.yaml` `overrides:` locks critical toolchain versions (TypeScript, Vitest, ESLint, sass, jsdom)
