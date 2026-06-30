# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 权威约束源

**`AGENTS.md` 是本仓库的权威维护约束文档。** 所有硬性约束、目录职责、修改边界、治理规则均以 `AGENTS.md` 为准。本文件仅补充 Claude Code 运行必需的精简信息，不重复也不覆盖 `AGENTS.md` 中的任何条目。

在执行任何涉及架构边界、包职责、脚本契约、依赖方向、主题/i18n/mock 正式契约的修改前，**必须先查阅 `AGENTS.md` 对应章节**。

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
