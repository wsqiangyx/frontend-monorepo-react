# frontend-monorepo

面向团队复用的 React 中后台前端平台脚手架 Monorepo Git 模板仓库。以 React 为正式宿主，提供 React 应用壳、共享主题与 i18n 运行时、MSW/mock 基线，以及可复用的 Vite / Vitest / TypeScript 工程底座。UI 层基于 shadcn/ui + Tailwind CSS，组件源码可控、轻量可定制。

正式设计主入口：[`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`](./docs/总体设计/React%20中后台前端平台%20Monorepo%20架构设计方案.md)。

## 先看这里

- Day 0 清单：[`TEMPLATE.md`](./TEMPLATE.md)
- 总体设计：[`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`](./docs/总体设计/React%20中后台前端平台%20Monorepo%20架构设计方案.md)
- 初始化与裁剪手册：[`docs/教程/模板初始化与裁剪指南.md`](./docs/教程/模板初始化与裁剪指南.md)
- 维护约束：[`AGENTS.md`](./AGENTS.md)
- Claude Code 指令：[`CLAUDE.md`](./CLAUDE.md)

> **AI 工具指令入口**：
>
> - Codex CLI 自动读取 [`AGENTS.md`](./AGENTS.md) 作为项目级指令。
> - Claude Code CLI 自动读取 [`CLAUDE.md`](./CLAUDE.md) 作为项目级指令。
> - 两个文件是不同 CLI 工具各自的项目级指令入口，核心维护约束保持一致。`AGENTS.md` 同时是仓库的权威维护约束文档。

## 当前定位

这是一个以 React 为正式宿主应用的前端 monorepo 基线仓库，不是单应用仓库，也不是通用前端空白模板。

- `apps/react-app`：React 19 + shadcn/ui + Tailwind CSS 应用壳（stable）
- `apps/taro-miniapp`：Taro 3/4 小程序宿主，React 18 + zustand（candidate，ADR-012）
- `packages/shared-utils`：通用工具 + 类型契约 + 国际化运行时（零 workspace 依赖，ADR-011）
- `packages/shared-service`：平台共享内核，承载初始化、认证、菜单、权限、多标签页与平台请求契约
- `packages/design-tokens`：设计令牌、CSS 变量、主题快照、Tailwind CSS 主题适配、共享主题运行时
- `packages/mock`：MSW handlers、browser worker、Node server
- `packages/shared-ui`：React 共享主题 Provider 与公共业务壳组件（基于 shadcn/ui）
- `packages/cross-platform-utils`：跨端运行时适配层，封装 HTTP/Storage/Theme/Locale 平台差异（candidate，ADR-012）

当前工作区与正式基线：

- 正式默认基线：`apps/react-app` + 5 个共享包
- 跨端候选基线：`apps/taro-miniapp` + `packages/cross-platform-utils`（Phase 1 扩展，尚未纳入默认验证链路）

## 当前架构

- `apps/react-app`：正式宿主应用，也是 composition root（stable）
- `apps/taro-miniapp`：Taro 小程序宿主（candidate，ADR-012）
- `packages/shared-service`：平台领域模型与应用规则
- `packages/shared-utils`、`packages/design-tokens`：基础共享运行时
- `packages/shared-ui`、`packages/mock`：交付与边界适配层
- `packages/cross-platform-utils`：跨端运行时适配层（candidate，ADR-012）

## 快速开始

### 1. 安装环境

- Node.js `24.15.0`
- 推荐本地版本：`.nvmrc` 中的 `24.15.0`
- `pnpm@10.33.1`

```bash
corepack enable
corepack prepare pnpm@10.33.1 --activate
```

### 2. 安装依赖并运行

```bash
pnpm install
pnpm dev:react
```

### 3. 执行基线校验

```bash
pnpm verify
```

## 常用脚本

| 命令                              | 说明                                  |
| --------------------------------- | ------------------------------------- |
| `pnpm dev:react`                  | 启动 React 应用                       |
| `pnpm build:shared`               | 构建 5 个共享包                       |
| `pnpm build:react`                | 先构建共享包，再构建 React 应用       |
| `pnpm build`                      | 执行仓库完整构建链路                  |
| `pnpm typecheck`                  | 执行全仓类型检查                      |
| `pnpm lint`                       | 执行 ESLint                           |
| `pnpm test`                       | 执行全仓测试                          |
| `pnpm verify`                     | 聚合执行所有校验                      |
| `pnpm build:cross-platform-utils` | 构建跨端运行时适配层（taro 前置依赖） |
| `pnpm dev:taro:weapp`             | 开发态启动微信小程序                  |
| `pnpm build:taro:weapp`           | 构建微信小程序                        |
| `pnpm dev:taro:h5`                | 开发态启动 Taro H5                    |
| `pnpm build:taro:h5`              | 构建 Taro H5                          |

## 目录结构

```text
frontend-monorepo/
├─ apps/
│  ├─ react-app/                 # React 正式宿主应用
│  └─ taro-miniapp/              # Taro 小程序宿主 (candidate)
├─ packages/
│  ├─ shared-utils/              # 通用工具 + 类型契约 + 国际化
│  ├─ shared-service/            # 平台共享内核
│  ├─ design-tokens/             # 设计令牌与主题
│  ├─ mock/                      # MSW handlers
│  ├─ shared-ui/                 # React 共享 UI 组件
│  └─ cross-platform-utils/      # 跨端运行时适配层 (candidate)
├─ docs/
│  └─ 总体设计/                   # React 架构设计方案
├─ scripts/
├─ pnpm-workspace.yaml
└─ package.json
```

## 关键运行时约束

- 主题启动顺序保持 `index.html -> /theme-init.js -> main -> bootstrap`
- `main.tsx` 负责在开发态判断是否启用 MSW，并等待 `worker.start()`
- `bootstrap.tsx` 负责接入 Theme Provider、引入共享 UI 包样式并挂载应用
- `@repo/shared-utils/i18n` 是唯一共享国际化运行时
- package `exports` 继续只指向 `dist/`
- 代码改动须遵循 `AGENTS.md` 中的编码代理修改纪律（Karpathy 准则：先思考、简化优先、精准修改、目标驱动）

更完整的维护约束见 [`AGENTS.md`](./AGENTS.md)。
