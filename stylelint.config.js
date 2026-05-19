// ============================================================================
// stylelint.config.js — Stylelint 样式检查配置
// ============================================================================
// 覆盖整个 monorepo 的 SCSS/CSS 样式检查。
// 与 ESLint 分工：ESLint 管 JS/TS 逻辑，Stylelint 管 CSS/SCSS 样式。
// ============================================================================
export default {
  // 基于 SCSS 标准规则集，包含 SCSS 特有的嵌套、变量、mixin 等检查。
  extends: ['stylelint-config-standard-scss'],

  plugins: [
    // stylelint-scss: 补充 SCSS 特有规则的检查（如 @mixin、@use 语法）
    'stylelint-scss',
    // stylelint-order: 强制 CSS 属性书写顺序，提升可读性和一致性
    'stylelint-order',
  ],

  // 忽略生成产物和工具临时文件，让 stylelint 只关注源码目录。
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/.vitest/**'],

  rules: {
    // 当前仓库的共享 UI 与后台壳组件采用 BEM 命名，允许 block__element / block--modifier。
    'selector-class-pattern':
      '^[a-z][a-z0-9-]*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',

    // SCSS @规则白名单。默认规则会报未知的 @ 规则，但以下规则是合法的：
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply', // UnoCSS/Tailwind 的 @apply 指令
          'screen', // UnoCSS/Tailwind 的 @screen 响应式断点
          'layer', // CSS @layer 或 UnoCSS 的层级指令
        ],
      },
    ],

    // CSS 属性书写顺序约定。按功能分组，从外到内、从布局到视觉：
    //   定位（position/z-index）→ 布局（display/flex/grid）
    //   → 盒模型（width/height/margin/padding）→ 排版（font/line-height）
    //   → 视觉（color/background/border/shadow）→ 动画（transition/transform）
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'grid',
      'grid-template-columns',
      'grid-template-rows',
      'gap',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'overflow',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'color',
      'background',
      'border',
      'border-radius',
      'box-shadow',
      'opacity',
      'transition',
      'transform',
    ],
  },
}
