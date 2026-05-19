import { describe, expect, it } from 'vitest'
import { colors } from '../colors'
import { generateCssVarsString, tokensToCssVars } from '../to-css'

describe('tokens', () => {
  it('colors should have primary color', () => {
    expect(colors.primary).toBe('#1677ff')
  })

  it('tokensToCssVars should flatten nested tokens', () => {
    const vars = tokensToCssVars()
    expect(vars['color-primary']).toBe('#1677ff')
    expect(vars['color-neutral-900']).toBe('#1f1f1f')
    expect(vars['spacing-4']).toBe('16px')
    expect(vars['font-font-family-base']).toContain('Segoe UI')
    expect(vars['font-font-size-base']).toBe('16px')
    expect(vars['font-line-height-normal']).toBe('1.5')
    expect(vars['font-font-weight-bold']).toBe('700')
  })

  it('generateCssVarsString should produce valid CSS', () => {
    const css = generateCssVarsString()
    expect(css.startsWith(':root {')).toBe(true)
    expect(css).toContain('--color-primary: #1677ff;')
    expect(css).toContain('--font-font-family-base:')
    expect(css.endsWith('}')).toBe(true)
  })
})
