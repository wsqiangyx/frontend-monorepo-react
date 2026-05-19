import { describe, expect, it } from 'vitest'
import * as rootExports from '../index'
import * as themeExports from '../theme/index'

describe('@repo/design-tokens public contract', () => {
  it('keeps theme runtime APIs on the theme subpath instead of the root entry', () => {
    expect(rootExports).not.toHaveProperty('applyThemeToDocument')
    expect(rootExports).not.toHaveProperty('createThemeRuntimeState')
    expect(rootExports).not.toHaveProperty('resolveTheme')
    expect(rootExports).not.toHaveProperty('subscribeToSystemThemeChange')
  })

  it('exposes theme runtime APIs from the theme subpath', () => {
    expect(themeExports).toHaveProperty('applyThemeToDocument')
    expect(themeExports).toHaveProperty('createThemeRuntimeState')
    expect(themeExports).toHaveProperty('resolveTheme')
    expect(themeExports).toHaveProperty('subscribeToSystemThemeChange')
  })
})
