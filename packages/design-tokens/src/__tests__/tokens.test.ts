import { describe, expect, it } from 'vitest'
import { colors } from '../colors'
import { generateCssVarsString, tokensToCssVars } from '../to-css'
import { motion } from '../motion'
import { zIndex } from '../zIndex'
import { opacity } from '../opacity'

describe('tokens', () => {
  it('colors should have primary color', () => {
    expect(colors.primary).toBe('#1677ff')
  })

  it('colors should have primary scale', () => {
    expect(colors.primaryScale[500]).toBe('#1677ff')
    expect(colors.primaryScale[50]).toBeDefined()
    expect(colors.primaryScale[900]).toBeDefined()
  })

  it('colors should have secondary family', () => {
    expect(colors.secondary).toBeDefined()
    expect(colors.secondaryHover).toBeDefined()
    expect(colors.secondaryPressed).toBeDefined()
  })

  it('colors should have accent family', () => {
    expect(colors.accent).toBeDefined()
    expect(colors.accentHover).toBeDefined()
    expect(colors.accentPressed).toBeDefined()
  })

  it('colors should have destructive family', () => {
    expect(colors.destructive).toBeDefined()
    expect(colors.destructiveHover).toBeDefined()
    expect(colors.destructivePressed).toBeDefined()
  })

  it('colors should have interaction states', () => {
    expect(colors.bg.hover).toBeDefined()
    expect(colors.bg.pressed).toBeDefined()
    expect(colors.bg.selected).toBeDefined()
    expect(colors.border.hover).toBeDefined()
    expect(colors.border.focus).toBeDefined()
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

  it('tokensToCssVars should include motion tokens', () => {
    const vars = tokensToCssVars()
    expect(vars['motion-duration-fast']).toBe(motion.duration.fast)
    expect(vars['motion-duration-normal']).toBe(motion.duration.normal)
    expect(vars['motion-easing-default']).toBe(motion.easing.default)
  })

  it('tokensToCssVars should include zIndex tokens', () => {
    const vars = tokensToCssVars()
    expect(vars['z-index-dropdown']).toBe(String(zIndex.dropdown))
    expect(vars['z-index-tooltip']).toBe(String(zIndex.tooltip))
  })

  it('tokensToCssVars should include opacity tokens', () => {
    const vars = tokensToCssVars()
    expect(vars['opacity-hover']).toBe(String(opacity.hover))
    expect(vars['opacity-disabled']).toBe(String(opacity.disabled))
  })

  it('tokensToCssVars should include transition presets', () => {
    const vars = tokensToCssVars()
    expect(vars['transition-fast']).toBeDefined()
    expect(vars['transition-normal']).toBeDefined()
  })

  it('tokensToCssVars should include primary scale colors', () => {
    const vars = tokensToCssVars()
    expect(vars['color-primary-scale-50']).toBeDefined()
    expect(vars['color-primary-scale-500']).toBe('#1677ff')
    expect(vars['color-primary-scale-900']).toBeDefined()
  })

  it('generateCssVarsString should produce valid CSS', () => {
    const css = generateCssVarsString()
    expect(css.startsWith(':root {')).toBe(true)
    expect(css).toContain('--color-primary: #1677ff;')
    expect(css).toContain('--font-font-family-base:')
    expect(css.endsWith('}')).toBe(true)
  })
})
