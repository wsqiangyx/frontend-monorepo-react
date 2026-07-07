import type { ThemeSnapshot } from './types'

/**
 * Derive a dark-mode ThemeSnapshot from a light-mode one.
 * Pure function — does not mutate the input.
 */
export function deriveDarkFromLight(light: ThemeSnapshot): ThemeSnapshot {
  return {
    ...light,
    mode: 'dark',

    // Backgrounds: move to neutral dark values
    colorBgPage: '#141414',
    colorBgCard: '#1f1f1f',
    colorBgElevated: '#262626',

    // Text: invert hierarchy
    colorTextPrimary: '#e8e8e8',
    colorTextSecondary: '#bfbfbf',
    colorTextMuted: '#8c8c8c',

    // Border: use neutral mid-dark
    colorBorder: '#434343',
    colorBorderStrong: '#595959',

    // Brand: keep primary, brighten hover
    colorBrandPrimary: light.colorBrandPrimary,
    colorBrandPrimaryHover: '#69b1ff',
    colorBrandPrimaryActive: light.colorBrandPrimaryActive,

    // Semantic colors: brighten 15-20% for dark background contrast
    colorSuccess: '#73d13d',
    colorWarning: '#ffc53d',
    colorError: '#ff7875',
    colorInfo: '#69b1ff',

    // Interaction states: invert overlay direction
    colorBgHover: 'rgba(255, 255, 255, 0.08)',
    colorBgPressed: 'rgba(255, 255, 255, 0.12)',
    colorBgSelected: 'rgba(22, 119, 255, 0.16)',
    colorBorderHover: '#434343',
    colorBorderFocus: '#69b1ff',

    // Destructive: same absolute values in both modes
    colorDestructive: light.colorDestructive,
    colorDestructiveHover: light.colorDestructiveHover,
    colorDestructivePressed: light.colorDestructivePressed,

    // Shadows: increase opacity for visibility on dark backgrounds
    shadowPanel: '0 1px 2px 0 rgba(0, 0, 0, 0.35), 0 1px 3px 0 rgba(0, 0, 0, 0.25)',
    shadowRaised: '0 4px 12px 0 rgba(0, 0, 0, 0.35), 0 2px 6px 0 rgba(0, 0, 0, 0.25)',
  }
}
