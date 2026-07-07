/**
 * CSS variable bridge between design-tokens theme variables and shadcn/ui.
 *
 * shadcn/ui components expect a specific set of CSS custom properties
 * (e.g. --background, --primary, --destructive). This mapping ensures
 * those variables reference our --theme-* runtime variables so that
 * theme switching (light/dark, default/compact) automatically propagates
 * to all shadcn/ui components.
 *
 * KEY CONSTRAINT: Bridge variables MUST reference --theme-* runtime variables
 * (updated by applyThemeToDocument on every theme switch). They MUST NOT
 * reference --color-* static tokens (those don't change between light/dark).
 */

export const shadcnCssBridgeVars: Record<string, string> = {
  '--background': 'var(--theme-color-bg-page)',
  '--foreground': 'var(--theme-color-text-primary)',
  '--card': 'var(--theme-color-bg-card)',
  '--card-foreground': 'var(--theme-color-text-primary)',
  '--popover': 'var(--theme-color-bg-elevated)',
  '--popover-foreground': 'var(--theme-color-text-primary)',
  '--primary': 'var(--theme-color-brand-primary)',
  '--primary-foreground': '#ffffff',
  '--secondary': 'var(--theme-color-bg-card)',
  '--secondary-foreground': 'var(--theme-color-text-primary)',
  '--muted': 'var(--theme-color-bg-card)',
  '--muted-foreground': 'var(--theme-color-text-secondary)',
  '--accent': 'var(--theme-color-bg-hover)',
  '--accent-foreground': 'var(--theme-color-text-primary)',
  '--destructive': 'var(--theme-color-destructive)',
  '--destructive-foreground': '#ffffff',
  '--border': 'var(--theme-color-border)',
  '--input': 'var(--theme-color-border)',
  '--ring': 'var(--theme-color-border-focus)',
  '--radius': 'var(--theme-radius-md)',
}
