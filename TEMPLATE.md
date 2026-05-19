# Template Day 0 Checklist

本文档面向第一次复制这个仓库的新团队。

当前模板定位：

- 这是一个 `Git 模板仓库`
- 当前正式支持范围是 `React-only`
- 当前 `不是` `create-*` CLI
- 当前已提供最小初始化脚本与模板残留检查脚本，但整体仍以人工执行和文档清单为主

## 必做项

- [ ] 确认仓库将继续以 React 技术栈为正式范围
- [ ] 阅读根 `README.md`
- [ ] 阅读 `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`
- [ ] 确认你理解当前正式架构是“宿主层 + 平台内核层 + 共享运行时层 + 交付适配层”
- [ ] 阅读根 `STATUS.yaml`，确认哪些目录是 `stable`、哪些只是 `experimental`
- [ ] 阅读 `docs/教程/模板初始化与裁剪指南.md`
- [ ] 决定是否需要先执行 `pnpm template:init`
- [ ] 决定第一天是否保留 `@repo/*` 与 `repo-*` 技术标识
- [ ] 确认是否保留当前工作区中的 `apps/react-screen-designer` 专题目录，还是将其单独列入后续清理任务
- [ ] 复制 React app 的 `.env.example` 为本地环境文件
- [ ] 执行 `pnpm install`
- [ ] 执行 `pnpm verify`
- [ ] 执行 `pnpm template:check`，确认正式代码和配置入口中的模板残留
- [ ] 复核 CI 工作流触发分支与 required checks
- [ ] 确认 `LICENSE` 是否需要替换成组织批准的正式许可证
- [ ] 更新 `CHANGELOG.md` 的后续维护方式

## 推荐默认决策

如果你没有特别强的品牌或合规要求，推荐：

- [ ] 先保留 React 主线不动
- [ ] 先保留 `@repo/*` scope
- [ ] 先保留 `repo-theme-preference`、`repo-theme-style`、`repo-locale`
- [ ] 先只替换业务可见文案、标题、品牌素材与仓库信息

原因：

- 当前只有最小初始化脚本，不是完整 CLI
- 运行时标识和别名契约分散在共享层、配置层和文档层
- 先跑通 React 基线，再做系统化清理和重命名，风险更低

## 首次搜索建议

建议全文搜索并确认如何处理：

- `frontend-monorepo`
- `Workspace Shell`
- `@repo/`
- `repo-theme-preference`
- `repo-theme-style`
- `repo-locale`
- `react-screen-designer`

## 裁剪提醒

如果你要清理遗留目录或旧入口，不要只删目录。至少还要同步检查：

- 根 `package.json`
- 根 `vitest.config.ts`
- `tsconfig.packages.json`
- `eslint.config.js`
- 根 `README.md`
- 根 `AGENTS.md`
- 根 `TEMPLATE.md`
- `docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`
- `docs/教程/模板初始化与裁剪指南.md`
- `docs/规范/测试规范.md`

## 完成标准

Day 0 完成时，你至少应该能回答：

- 这个仓库现在的正式技术栈是不是 React-only
- 这个仓库当前的正式架构分层是不是已经理解清楚
- 当前哪些目录处于 `stable`，哪些还只是 `experimental`
- `apps/react-screen-designer` 是被保留为专题目录，还是已经进入你的正式应用规划
- 当前哪些技术标识被保留，哪些被重命名
- 你的 CI 是不是真的已经可用
- 你的本地 `pnpm verify` 是否已经通过
