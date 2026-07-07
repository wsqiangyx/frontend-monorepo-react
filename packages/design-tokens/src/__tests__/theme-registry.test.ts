import { describe, expect, it } from 'vitest'
import { resolveTheme, isThemeName, isThemeMode, themeRegistry } from '../theme/registry'

describe('theme registry', () => {
  it('resolves the default light theme', () => {
    const snapshot = resolveTheme('default', 'light')

    expect(snapshot.name).toBe('default')
    expect(snapshot.mode).toBe('light')
    expect(snapshot.colorBgPage).toBe('#ffffff')
    expect(snapshot.colorTextPrimary).toBe('rgba(0, 0, 0, 0.88)')
  })

  it('resolves the default dark theme', () => {
    const snapshot = resolveTheme('default', 'dark')

    expect(snapshot.name).toBe('default')
    expect(snapshot.mode).toBe('dark')
    expect(snapshot.colorBgPage).toBe('#141414')
    expect(snapshot.colorTextPrimary).toBe('#e8e8e8')
  })

  it('resolves the compact light theme', () => {
    const snapshot = resolveTheme('compact', 'light')

    expect(snapshot.name).toBe('compact')
    expect(snapshot.mode).toBe('light')
    expect(snapshot.spacingPanelX).toBe('16px')
    expect(snapshot.spacingPanelY).toBe('16px')
    expect(snapshot.radiusSm).toBe('1px')
    expect(snapshot.radiusMd).toBe('3px')
    expect(snapshot.radiusLg).toBe('4px')
  })

  it('resolves the compact dark theme', () => {
    const snapshot = resolveTheme('compact', 'dark')

    expect(snapshot.name).toBe('compact')
    expect(snapshot.mode).toBe('dark')
    expect(snapshot.colorBgPage).toBe('#141414')
    expect(snapshot.spacingPanelX).toBe('16px')
    expect(snapshot.radiusSm).toBe('1px')
  })

  it('compact dark theme has dark interaction states', () => {
    const snapshot = resolveTheme('compact', 'dark')

    expect(snapshot.colorBgHover).toBe('rgba(255, 255, 255, 0.08)')
    expect(snapshot.colorBgPressed).toBe('rgba(255, 255, 255, 0.12)')
    expect(snapshot.colorBorderFocus).toBe('#69b1ff')
  })

  it('falls back to default light for invalid input', () => {
    const snapshot = resolveTheme('invalid' as never, 'invalid' as never)

    expect(snapshot.name).toBe('default')
    expect(snapshot.mode).toBe('light')
  })

  it('registry contains both default and compact themes', () => {
    expect(Object.keys(themeRegistry)).toEqual(['default', 'compact'])
  })

  it('default light theme has all ThemeSnapshot fields', () => {
    const snapshot = resolveTheme('default', 'light')

    expect(snapshot.colorBgHover).toBeDefined()
    expect(snapshot.colorBgPressed).toBeDefined()
    expect(snapshot.colorBgSelected).toBeDefined()
    expect(snapshot.colorBorderHover).toBeDefined()
    expect(snapshot.colorBorderFocus).toBeDefined()
    expect(snapshot.colorDestructive).toBeDefined()
    expect(snapshot.colorDestructiveHover).toBeDefined()
    expect(snapshot.colorDestructivePressed).toBeDefined()
  })
})

describe('isThemeName', () => {
  it('returns true for valid theme names', () => {
    expect(isThemeName('default')).toBe(true)
    expect(isThemeName('compact')).toBe(true)
  })

  it('returns false for invalid theme names', () => {
    expect(isThemeName('invalid')).toBe(false)
    expect(isThemeName('')).toBe(false)
    expect(isThemeName(123 as unknown)).toBe(false)
  })
})

describe('isThemeMode', () => {
  it('returns true for valid modes', () => {
    expect(isThemeMode('light')).toBe(true)
    expect(isThemeMode('dark')).toBe(true)
  })

  it('returns false for invalid modes', () => {
    expect(isThemeMode('system')).toBe(false)
    expect(isThemeMode('')).toBe(false)
    expect(isThemeMode(42 as unknown)).toBe(false)
  })
})
