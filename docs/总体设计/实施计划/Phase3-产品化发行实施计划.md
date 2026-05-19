# Phase 3 产品化发行实施计划

> 制定日期：2026-05-15
> 适用阶段：Phase 3
> 上游设计：`docs/专题文档/设计/Phase3-产品化发行详细设计.md`
> 文档性质：面向未来执行的实施计划，不记录已完成事项或复盘

## 文档定位

本计划对应模板产品化与发行阶段的落地顺序。核心目标不是把仓库包装得像已经有 CLI，而是在继续以 Git 模板交付的前提下，把初始化、残留检查、CI、版本治理和后端适配预留做成可维护、可验证、可扩展的正式资产。

## 输入 / 前置条件

- Phase 0 ~ Phase 2 的正式边界已稳定
- 仓库当前已存在：
  - `TEMPLATE.md`
  - `CHANGELOG.md`
  - `.env.example`
  - `scripts/init-template.mjs`
  - `scripts/check-template-residue.mjs`
  - `.github/workflows/ci.yml`
  - `.github/CODEOWNERS`
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/ISSUE_TEMPLATE/*`
- 根脚本已提供：
  - `pnpm template:init`
  - `pnpm template:check`
  - `pnpm verify`
- 当前对外交付形态仍是 Git 模板仓库，而不是 `create-*` CLI

## 范围 / 非目标

### 范围

- 模板初始化脚本增强
- 模板残留检查增强
- CI 与质量门禁收敛
- 版本与发布治理文档 / 资产补齐
- 后端适配层目录与约束预留

### 非目标

- 不伪装已经提供交互式 `create-*` CLI
- 不把某一种真实后端接口风格写死进共享层正式契约
- 不在本阶段实现完整 npm 发布流程或公共脚手架市场分发
- 不引入代码生成平台、插件生态或复杂项目向导

## 实施原则

1. Git 模板优先于 CLI 叙事，文档描述必须和真实交付物一致。
2. 先解决模板残留和接管成本，再谈版本治理和扩展能力。
3. 质量门禁统一复用 `pnpm verify`，避免新增并行、漂移的 CI 检查链。
4. 后端适配必须通过适配层吸收差异，不反向污染 `platform-core`、`shared`、`mock`。
5. 所有产品化资产都要兼顾 Windows 与 Linux 开发环境。

## 里程碑

- M1：初始化与残留检查脚本稳定
- M2：模板主文档、Day 0 文档和环境变量入口稳定
- M3：CI 覆盖多平台并以 `pnpm verify` 为统一门禁
- M4：版本与发布治理资产可落地
- M5：后端适配层预留完成，产品化边界在主文档中闭环

## 任务拆解

### 任务 1：增强模板初始化脚本

目标：让模板消费者在 Day 0 能自动完成最小必要替换，但不误导为“完整一键脚手架”。

文件：`scripts/init-template.mjs`

最小正式输入保持：

- `--root`
- `--project-name`
- `--display-name`
- `--storage-key-prefix`
- `--app-title`

明确边界：

- 只处理最小自动化范围
- 不自动改 `@repo/*` scope
- 不自动清理遗留目录或旧入口

验证命令：

```bash
pnpm template:init -- --root . --project-name demo-console --display-name "Demo Console" --storage-key-prefix demo-console --app-title "Demo Console"
```

### 任务 2：增强模板残留检查

目标：把“模板有没有清理干净”做成可自动验证的正式门禁。

文件：`scripts/check-template-residue.mjs`

至少检查：

- 仓库名残留
- `@repo/*` 范围提示是否仍处于模板默认值
- `repo-theme-preference`、`repo-theme-style`、`repo-locale` 这类持久化 key 残留
- 文档中的模板占位语句
- 遗留目录、旧脚本和旧入口是否已按当前策略标记或清理

验证命令：

- `pnpm template:check`
- `pnpm verify`

### 任务 3：收敛模板主文档与 Day 0 资产

目标：保证模板消费者第一眼看到的入口和真实能力一致。

文件：

- `README.md`
- `TEMPLATE.md`
- `.env.example`
- `docs/教程/README.md`
- `docs/教程/模板初始化与裁剪指南.md`

实现要求：

- `README.md`
  - 清晰说明当前定位仍是 Git 模板仓库
  - 明确正式技术栈是 React-only
  - 不夸大 CLI、发布或后端适配现状
- `TEMPLATE.md`
  - 保持 Day 0 清单角色
  - 补齐遗留项的人工检查点
- `.env.example`
  - 只保留模板级公共入口变量
  - app 专属变量继续放各 app 的 `.env.example`
- 教程文档
  - 解释“先初始化、再验证、再清理残留”的推荐顺序

验证命令：

- `pnpm verify`

### 任务 4：CI 与质量门禁收敛

目标：让模板复制后至少具备一条真实可执行的、多平台的仓库级验证流水线。

文件：`.github/workflows/ci.yml`

要求：

- 统一以 `pnpm verify` 作为核心质量门禁
- 不在 CI 中复制一套与本地根脚本不同的检查顺序
- 至少覆盖：
  - `ubuntu-latest`
  - `windows-latest`
- Node 版本与根 `package.json` / `.nvmrc` 一致

## 验证命令

- `pnpm template:init -- --root . --project-name demo-console --display-name "Demo Console" --storage-key-prefix demo-console --app-title "Demo Console"`
- `pnpm template:check`
- `pnpm verify`
