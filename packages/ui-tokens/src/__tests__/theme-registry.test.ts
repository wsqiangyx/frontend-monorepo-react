import { describe, expect, it } from 'vitest'
import { resolveTheme } from '../theme/registry'

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

  it('falls back to default light for invalid input', () => {
    const snapshot = resolveTheme('invalid' as never, 'invalid' as never)

    expect(snapshot.name).toBe('default')
    expect(snapshot.mode).toBe('light')
  })
})
