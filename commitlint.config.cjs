// ============================================================================
// commitlint.config.cjs — Git 提交消息规范配置
// ============================================================================
// 强制使用 Conventional Commits 格式：<type>(<scope>): <subject>
// 支持的类型：feat（新功能）、fix（修复）、docs（文档）、style（格式）、
// refactor（重构）、perf（性能）、test（测试）、build（构建）、ci（CI）、
// chore（杂务）、revert（回退）。
// 配合 .husky/commit-msg 钩子使用，提交消息不合规会被拒绝。
// ============================================================================
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
