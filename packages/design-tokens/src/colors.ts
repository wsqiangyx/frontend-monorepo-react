// ============================================================================
// @repo/design-tokens — 语义色定义
// ============================================================================
// 语义色集中定义，保证 app 映射到同一套视觉语言。
// 颜色值同时服务于：
//   1. CSS 变量生成（to-css.ts → --color-primary: #1677ff）
//   2. Tailwind CSS 主题预设（theme/tailwind.ts → colors.primary）
// 修改颜色值会影响应用的 UI 外观。
// ============================================================================
export const colors = {
  // 主色调 — 品牌色，用于主要操作按钮、链接、选中态等
  primary: '#1677ff',
  primaryHover: '#4096ff', // 主色悬停态
  primaryPressed: '#0958d9', // 主色按下态
  primaryScale: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff',
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },

  // 语义色 — 状态反馈
  success: '#52c41a', // 成功（绿色）
  warning: '#faad14', // 警告（黄色）
  error: '#ff4d4f', // 错误（红色）
  info: '#1677ff', // 信息提示（与主色一致）
  secondary: '#64748b',
  secondaryHover: '#475569',
  secondaryPressed: '#334155',
  accent: '#8b5cf6',
  accentHover: '#7c3aed',
  accentPressed: '#6d28d9',
  destructive: '#ef4444',
  destructiveHover: '#dc2626',
  destructivePressed: '#b91c1c',

  // 中性色 — 灰度梯度，从浅到深（50 → 900）
  // 用于背景、边框、禁用态等非强调场景
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
  },

  // 文本色 — 不同层级的文本对比度，符合 WCAG 无障碍标准
  text: {
    primary: 'rgba(0, 0, 0, 0.88)', // 正文（最高对比度）
    secondary: 'rgba(0, 0, 0, 0.65)', // 次要文本（描述、标签）
    tertiary: 'rgba(0, 0, 0, 0.45)', // 占位符、禁用文本
    quaternary: 'rgba(0, 0, 0, 0.25)', // 最淡文本（图标底色等）
  },

  // 背景色 — 不同层级的容器背景，用于构建视觉层次
  bg: {
    default: '#ffffff', // 页面默认背景
    container: '#ffffff', // 容器（卡片、弹窗）背景
    elevated: '#ffffff', // 浮层（下拉、气泡）背景
    spotlight: '#f5f5f5', // 高亮区域背景
    hover: 'rgba(0, 0, 0, 0.04)',
    pressed: 'rgba(0, 0, 0, 0.08)',
    selected: 'rgba(22, 119, 255, 0.08)',
  },

  // 边框色 — 不同权重的边框
  border: {
    default: '#d9d9d9', // 默认边框（输入框、卡片）
    secondary: '#f0f0f0', // 次要边框（分割线、内部分隔）
    hover: '#bfbfbf',
    focus: '#1677ff',
  },
} as const
