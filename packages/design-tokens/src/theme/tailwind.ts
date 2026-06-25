// ============================================================================
// @repo/design-tokens — Tailwind CSS 主题适配器
// ============================================================================
// 将 design-tokens 的语义令牌映射到 Tailwind CSS 主题配置格式。
// 被 apps/react-app 的 tailwind.config.ts 消费。
//
// 这里只做 Tailwind 主题适配，不承担完整主题系统职责。
// CSS 变量由 to-css.ts 生成，运行时通过 applyThemeToDocument() 注入。
// 本模块提供 Tailwind theme.extend 配置，让 Tailwind 工具类引用 CSS 变量。
// ============================================================================
import { spacing } from '../spacing'
import { typography } from '../typography'
import { breakpoints } from '../breakpoints'
import { radius } from '../radius'
import { shadows } from '../shadows'
import type { Config } from 'tailwindcss'

/**
 * 创建 Tailwind CSS 主题预设。
 * 返回值直接传入 tailwind.config.ts 的 theme.extend。
 *
 * 设计策略：
 *   - 颜色引用 CSS 变量（var(--color-primary)），支持运行时主题切换
 *   - 间距/圆角/阴影等引用 CSS 变量，与 design-tokens 保持单一数据源
 *   - 断点直接使用 token 值（断点不需要运行时切换）
 */
export function createTailwindPreset(): Pick<Config, 'theme'> {
  return {
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
          bg: {
            default: 'var(--color-bg-default)',
            page: 'var(--color-bg-page)',
            container: 'var(--color-bg-container)',
            elevated: 'var(--color-bg-elevated)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            disabled: 'var(--color-text-disabled)',
          },
          border: {
            default: 'var(--color-border-default)',
            muted: 'var(--color-border-muted)',
          },
        },
        spacing: {
          ...spacing,
        },
        borderRadius: {
          none: radius.none,
          sm: radius.sm,
          md: radius.md,
          lg: radius.lg,
          xl: radius.xl,
          full: radius.full,
        },
        fontFamily: {
          base: typography.fontFamily.base,
          code: typography.fontFamily.code,
        },
        fontSize: {
          xs: typography.fontSize.xs,
          sm: typography.fontSize.sm,
          base: typography.fontSize.base,
          lg: typography.fontSize.lg,
          xl: typography.fontSize.xl,
          '2xl': typography.fontSize['2xl'],
          '3xl': typography.fontSize['3xl'],
          '4xl': typography.fontSize['4xl'],
        },
        boxShadow: {
          sm: shadows.sm,
          md: shadows.md,
          lg: shadows.lg,
          xl: shadows.xl,
        },
        screens: {
          sm: breakpoints.sm,
          md: breakpoints.md,
          lg: breakpoints.lg,
          xl: breakpoints.xl,
          '2xl': breakpoints['2xl'],
        },
      },
    },
  }
}
