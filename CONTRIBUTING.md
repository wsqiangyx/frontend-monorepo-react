# 贡献指南

欢迎为 frontend-monorepo 做出贡献！

## 开发环境准备

| 依赖    | 版本要求      | 说明                           |
| ------- | ------------- | ------------------------------ |
| Node.js | >=24.11.0 <25 | 推荐 `.nvmrc` 中指定的 24.15.0 |
| pnpm    | 10.33.1       | 包管理器，通过 Corepack 管理   |

```bash
corepack enable
corepack prepare pnpm@10.33.1 --activate
```

## 开发流程

1. **Fork & Clone** — Fork 本仓库并 clone 到本地
2. **安装依赖** — `pnpm install`
3. **启动开发服务器** — `pnpm dev:react`
4. **修改代码** — 遵循现有架构约束（见 AGENTS.md）
5. **本地校验** — `pnpm verify` 确保所有检查通过
6. **提交 PR** — 遵循 PR 模板要求

## 代码规范

本仓库有严格的代码规范要求，详见 [`AGENTS.md`](./AGENTS.md)：

- **ESLint**：使用 flat config，基于 `typescript-eslint`，集成 React 插件
- **Stylelint**：SCSS 标准规范，包含属性排序
- **Prettier**：统一代码格式（`semi: false`, `singleQuote: true`, `printWidth: 100`）
- **Commitlint**：提交信息必须遵循 Conventional Commits 格式
- **TypeScript**：严格模式，`noUnusedLocals: true`，`noUnusedParameters: true`，零编译错误
- **Workspace 脚本契约**：根目录保留 `build`、`test`、`typecheck`、`verify` 等脚本

提交前请执行：

```bash
pnpm format     # 格式化代码
pnpm verify     # 全仓校验
```

## 提交 PR

PR 描述应包含：

- **变更摘要**：清晰说明做了什么改动
- **关联信息**：链接到相关 Issue（如有）
- **验证记录**：列出执行过的校验命令及结果
- **风险说明**：如有潜在风险或回滚方式需说明

涉及功能变更时，建议附带 changeset（如已启用 changesets）。

## 文档更新

修改代码后，需同步更新相关文档：

| 修改范围                 | 需同步更新的文档                              |
| ------------------------ | --------------------------------------------- |
| 脚本、配置、目录约束     | 根 `README.md`、根 `AGENTS.md`                |
| 模板使用说明             | 根 `README.md`、根 `TEMPLATE.md`、教程文档    |
| 主题、共享 UI、i18n 契约 | 根 `README.md`、根 `AGENTS.md`、专题文档      |
| 环境变量                 | 根 `.env.example`、对应 app 的 `.env.example` |

## 问题反馈

- 复制模板后，请先将本文档中的 GitHub 占位信息替换为你自己的仓库地址。
- 当前仓库内可直接参考以下模板：
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
