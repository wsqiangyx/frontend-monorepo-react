import { colors } from '../colors'
import { radius } from '../radius'
import { shadows } from '../shadows'
import type { ThemeMode, ThemeName } from '@repo/shared-utils/ui-contract'

export type { ThemeMode, ThemeName } from '@repo/shared-utils/ui-contract'

export interface ThemeSnapshot {
  name: ThemeName
  mode: ThemeMode
  colorBgPage: string
  colorBgCard: string
  colorBgElevated: string
  colorTextPrimary: string
  colorTextSecondary: string
  colorTextMuted: string
  colorBorder: string
  colorBorderStrong: string
  colorBrandPrimary: string
  colorBrandPrimaryHover: string
  colorBrandPrimaryActive: string
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorInfo: string
  shadowPanel: string
  shadowRaised: string
  radiusSm: string
  radiusMd: string
  radiusLg: string
  spacingPanelX: string
  spacingPanelY: string
  colorBgHover: string
  colorBgPressed: string
  colorBgSelected: string
  colorBorderHover: string
  colorBorderFocus: string
  colorDestructive: string
  colorDestructiveHover: string
  colorDestructivePressed: string
}

export interface ThemeDefinition {
  light: ThemeSnapshot
  dark: ThemeSnapshot
}

export type ThemeRegistry = Record<ThemeName, ThemeDefinition>

export const defaultLightTheme: ThemeSnapshot = {
  name: 'default',
  mode: 'light',
  colorBgPage: colors.bg.default,
  colorBgCard: colors.bg.container,
  colorBgElevated: colors.bg.elevated,
  colorTextPrimary: colors.text.primary,
  colorTextSecondary: colors.text.secondary,
  colorTextMuted: colors.text.tertiary,
  colorBorder: colors.border.default,
  colorBorderStrong: colors.neutral[400],
  colorBrandPrimary: colors.primary,
  colorBrandPrimaryHover: colors.primaryHover,
  colorBrandPrimaryActive: colors.primaryPressed,
  colorSuccess: colors.success,
  colorWarning: colors.warning,
  colorError: colors.error,
  colorInfo: colors.info,
  shadowPanel: shadows.base,
  shadowRaised: shadows.lg,
  radiusSm: radius.sm,
  radiusMd: radius.md,
  radiusLg: radius.lg,
  spacingPanelX: '24px',
  spacingPanelY: '24px',
  colorBgHover: 'rgba(0, 0, 0, 0.04)',
  colorBgPressed: 'rgba(0, 0, 0, 0.08)',
  colorBgSelected: 'rgba(22, 119, 255, 0.08)',
  colorBorderHover: '#bfbfbf',
  colorBorderFocus: '#1677ff',
  colorDestructive: '#ef4444',
  colorDestructiveHover: '#dc2626',
  colorDestructivePressed: '#b91c1c',
}

// NOTE: defaultDarkTheme is now derived via deriveDarkFromLight() in registry.ts.
// The hardcoded constant is removed; import defaultDarkTheme from './registry' instead.
