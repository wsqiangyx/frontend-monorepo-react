import { describe, expect, it } from 'vitest'
import { generateCssVarsString } from '../to-css'
import { resolveTheme } from '../theme/registry'

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
})
