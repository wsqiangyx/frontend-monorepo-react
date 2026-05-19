import { colors } from '../colors'
import { radius } from '../radius'
import { shadows } from '../shadows'
import type { ThemeMode, ThemeName } from '@repo/shared/ui-contract'

export type { ThemeMode, ThemeName } from '@repo/shared/ui-contract'

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
}

export const defaultDarkTheme: ThemeSnapshot = {
  name: 'default',
  mode: 'dark',
  colorBgPage: '#141414',
  colorBgCard: '#1f1f1f',
  colorBgElevated: '#262626',
  colorTextPrimary: '#e8e8e8',
  colorTextSecondary: '#bfbfbf',
  colorTextMuted: '#8c8c8c',
  colorBorder: '#303030',
  colorBorderStrong: '#434343',
  colorBrandPrimary: colors.primary,
  colorBrandPrimaryHover: '#69b1ff',
  colorBrandPrimaryActive: '#0958d9',
  colorSuccess: '#73d13d',
  colorWarning: '#ffc53d',
  colorError: '#ff7875',
  colorInfo: '#69b1ff',
  shadowPanel: '0 10px 30px rgba(0, 0, 0, 0.35)',
  shadowRaised: '0 20px 45px rgba(0, 0, 0, 0.45)',
  radiusSm: radius.sm,
  radiusMd: radius.md,
  radiusLg: radius.lg,
  spacingPanelX: '24px',
  spacingPanelY: '24px',
}
