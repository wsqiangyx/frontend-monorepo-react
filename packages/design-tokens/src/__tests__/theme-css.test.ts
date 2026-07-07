import { describe, expect, it } from 'vitest'
import { generateCssVarsString } from '../to-css'
import { resolveTheme } from '../theme/registry'
import { shadcnCssBridgeVars } from '../shadcn-bridge'

describe('theme css', () => {
  it('generates theme css variables with theme prefix', () => {
    const css = generateCssVarsString(resolveTheme('default', 'dark'))

    expect(css).toContain('--theme-color-bg-page: #141414;')
    expect(css).toContain('--theme-color-text-primary: #e8e8e8;')
    expect(css).toContain('--theme-shadow-panel:')
  })

  it('keeps base token variables in the generated css output', () => {
    const css = generateCssVarsString(resolveTheme('default', 'light'))

    expect(css).toContain('--color-primary: #1677ff;')
    expect(css).toContain('--spacing-4: 16px;')
  })

  it('includes theme interaction state variables', () => {
    const css = generateCssVarsString(resolveTheme('default', 'light'))

    expect(css).toContain('--theme-color-bg-hover:')
    expect(css).toContain('--theme-color-bg-pressed:')
    expect(css).toContain('--theme-color-bg-selected:')
    expect(css).toContain('--theme-color-border-hover:')
    expect(css).toContain('--theme-color-border-focus:')
  })

  it('includes destructive theme variables', () => {
    const css = generateCssVarsString(resolveTheme('default', 'light'))

    expect(css).toContain('--theme-color-destructive:')
    expect(css).toContain('--theme-color-destructive-hover:')
    expect(css).toContain('--theme-color-destructive-pressed:')
  })
})

describe('shadcn css bridge', () => {
  it('bridge variables reference --theme-* runtime variables, not --color-* static tokens', () => {
    for (const [, value] of Object.entries(shadcnCssBridgeVars)) {
      if (value.startsWith('var(')) {
        expect(value).toContain('--theme-')
        expect(value).not.toContain('--color-')
      }
    }
  })

  it('includes all required shadcn semantic variables', () => {
    const requiredShadcnVars = [
      '--background',
      '--foreground',
      '--card',
      '--card-foreground',
      '--popover',
      '--popover-foreground',
      '--primary',
      '--primary-foreground',
      '--secondary',
      '--secondary-foreground',
      '--muted',
      '--muted-foreground',
      '--accent',
      '--accent-foreground',
      '--destructive',
      '--destructive-foreground',
      '--border',
      '--input',
      '--ring',
      '--radius',
    ]

    for (const varName of requiredShadcnVars) {
      expect(shadcnCssBridgeVars[varName]).toBeDefined()
    }
  })

  it('shadcn bridge variables are included when snapshot is provided', () => {
    const css = generateCssVarsString(resolveTheme('default', 'light'))

    expect(css).toContain('--background: var(--theme-color-bg-page);')
    expect(css).toContain('--foreground: var(--theme-color-text-primary);')
    expect(css).toContain('--primary: var(--theme-color-brand-primary);')
    expect(css).toContain('--destructive: var(--theme-color-destructive);')
    expect(css).toContain('--ring: var(--theme-color-border-focus);')
    expect(css).toContain('--radius: var(--theme-radius-md);')
  })

  it('shadcn bridge variables are NOT included when no snapshot is provided', () => {
    const css = generateCssVarsString()

    expect(css).not.toContain('--background:')
    expect(css).not.toContain('--foreground:')
    expect(css).not.toContain('--primary-foreground:')
  })

  it('primary-foreground and destructive-foreground are hardcoded white', () => {
    expect(shadcnCssBridgeVars['--primary-foreground']).toBe('#ffffff')
    expect(shadcnCssBridgeVars['--destructive-foreground']).toBe('#ffffff')
  })
})
