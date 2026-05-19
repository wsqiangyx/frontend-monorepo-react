// ============================================================================
// @repo/ui-tokens — 排版 token
// ============================================================================
// 排版 token 集中维护，避免 CSS 变量和主题适配层各自漂移。
// 字体栈优先使用系统字体，避免额外网络请求，提升首屏渲染速度。
// ============================================================================
export const typography = {
  fontFamily: {
    // 系统字体栈 — 按平台优先级排列，确保各操作系统都有回退字体
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    // 等宽字体栈 — 代码展示场景（代码块、终端输出等）
    code: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  fontSize: {
    xs: '12px', // 辅助文本、标签
    sm: '14px', // 正文（Ant Design 默认）
    base: '16px', // 基准字号
    lg: '18px', // 小标题
    xl: '20px', // 标题
    '2xl': '24px', // 大标题
    '3xl': '30px', // 页面标题
    '4xl': '36px', // 英雄区标题
  },
  lineHeight: {
    tight: 1.25, // 标题行高
    normal: 1.5, // 正文行高（推荐）
    relaxed: 1.75, // 宽松行高（长文阅读）
  },
  fontWeight: {
    normal: 400, // 正文
    medium: 500, // 强调
    semibold: 600, // 小标题
    bold: 700, // 标题
  },
} as const
