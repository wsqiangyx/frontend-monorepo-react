// ============================================================================
// .lintstagedrc.cjs — lint-staged 配置
// ============================================================================
// 在 Git pre-commit 钩子中自动执行，只对暂存区（staged）的文件运行 lint/format，
// 避免全量检查拖慢提交速度。配合 .husky/pre-commit 使用。
// ============================================================================
module.exports = {
  // TypeScript 源码文件：先 ESLint 修复，再 Prettier 格式化
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],

  // 样式文件：Stylelint 修复（SCSS 语法检查和属性排序）
  '*.{scss,css}': ['stylelint --fix'],

  // 配置/文档文件：仅 Prettier 格式化
  '*.{json,md,yml,yaml}': ['prettier --write'],
}
