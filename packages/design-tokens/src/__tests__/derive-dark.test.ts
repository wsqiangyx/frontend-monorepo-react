import { describe, expect, it } from 'vitest'
import { deriveDarkFromLight } from '../theme/derive-dark'
import { defaultLightTheme } from '../theme/types'
import type { ThemeSnapshot } from '../theme/types'

describe('deriveDarkFromLight', () => {
  it('returns a new object without mutating the input', () => {
    const input = { ...defaultLightTheme }
    const result = deriveDarkFromLight(input)

    expect(result).not.toBe(input)
    // Input should remain unchanged
    expect(input.mode).toBe('light')
    expect(input.colorBgPage).toBe('#ffffff')
  })

  it('sets mode to dark', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.mode).toBe('dark')
  })

  it('preserves name from input', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.name).toBe('default')
  })

  it('preserves name for compact theme', () => {
    const compactLight: ThemeSnapshot = {
      ...defaultLightTheme,
      name: 'compact',
      spacingPanelX: '16px',
      spacingPanelY: '16px',
      radiusSm: '1px',
      radiusMd: '3px',
      radiusLg: '4px',
    }
    const result = deriveDarkFromLight(compactLight)
    expect(result.name).toBe('compact')
    // Compact overrides preserved
    expect(result.spacingPanelX).toBe('16px')
    expect(result.radiusSm).toBe('1px')
  })

  it('derives dark backgrounds', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorBgPage).toBe('#141414')
    expect(result.colorBgCard).toBe('#1f1f1f')
    expect(result.colorBgElevated).toBe('#262626')
  })

  it('derives dark text colors', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorTextPrimary).toBe('#e8e8e8')
    expect(result.colorTextSecondary).toBe('#bfbfbf')
    expect(result.colorTextMuted).toBe('#8c8c8c')
  })

  it('derives dark border colors', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorBorder).toBe('#434343')
    expect(result.colorBorderStrong).toBe('#595959')
  })

  it('preserves brand primary and active, brightens hover', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorBrandPrimary).toBe(defaultLightTheme.colorBrandPrimary)
    expect(result.colorBrandPrimaryActive).toBe(defaultLightTheme.colorBrandPrimaryActive)
    expect(result.colorBrandPrimaryHover).toBe('#69b1ff')
  })

  it('brightens semantic colors for dark contrast', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorSuccess).toBe('#73d13d')
    expect(result.colorWarning).toBe('#ffc53d')
    expect(result.colorError).toBe('#ff7875')
    expect(result.colorInfo).toBe('#69b1ff')
  })

  it('inverts interaction overlay direction', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorBgHover).toBe('rgba(255, 255, 255, 0.08)')
    expect(result.colorBgPressed).toBe('rgba(255, 255, 255, 0.12)')
    expect(result.colorBgSelected).toBe('rgba(22, 119, 255, 0.16)')
    expect(result.colorBorderHover).toBe('#434343')
    expect(result.colorBorderFocus).toBe('#69b1ff')
  })

  it('preserves destructive colors from light theme', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.colorDestructive).toBe(defaultLightTheme.colorDestructive)
    expect(result.colorDestructiveHover).toBe(defaultLightTheme.colorDestructiveHover)
    expect(result.colorDestructivePressed).toBe(defaultLightTheme.colorDestructivePressed)
  })

  it('increases shadow opacity for dark backgrounds', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    expect(result.shadowPanel).toContain('0.35')
    expect(result.shadowRaised).toContain('0.35')
  })

  it('produces a complete ThemeSnapshot', () => {
    const result = deriveDarkFromLight(defaultLightTheme)
    const requiredKeys: Array<keyof ThemeSnapshot> = [
      'name',
      'mode',
      'colorBgPage',
      'colorBgCard',
      'colorBgElevated',
      'colorTextPrimary',
      'colorTextSecondary',
      'colorTextMuted',
      'colorBorder',
      'colorBorderStrong',
      'colorBrandPrimary',
      'colorBrandPrimaryHover',
      'colorBrandPrimaryActive',
      'colorSuccess',
      'colorWarning',
      'colorError',
      'colorInfo',
      'shadowPanel',
      'shadowRaised',
      'radiusSm',
      'radiusMd',
      'radiusLg',
      'spacingPanelX',
      'spacingPanelY',
      'colorBgHover',
      'colorBgPressed',
      'colorBgSelected',
      'colorBorderHover',
      'colorBorderFocus',
      'colorDestructive',
      'colorDestructiveHover',
      'colorDestructivePressed',
    ]

    for (const key of requiredKeys) {
      expect(result[key]).toBeDefined()
    }
  })
})
