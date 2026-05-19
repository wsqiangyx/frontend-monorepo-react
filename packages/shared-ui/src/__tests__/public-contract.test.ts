import { describe, expect, it } from 'vitest'
import * as rootExports from '../index'
import * as hookExports from '../hooks'

describe('@repo/shared-ui public contract', () => {
  it('keeps the root entry focused on stable shared UI APIs', () => {
    expect(rootExports).toHaveProperty('ThemeProvider')
    expect(rootExports).toHaveProperty('useThemeSnapshot')
    expect(rootExports).toHaveProperty('useThemeMode')
    expect(rootExports).toHaveProperty('AppShell')
    expect(rootExports).toHaveProperty('ThemeModeSwitch')
  })

  it('keeps useThemeSnapshot as the canonical hook and useThemeMode as an alias', () => {
    expect(hookExports).toHaveProperty('useThemeSnapshot')
    expect(hookExports).toHaveProperty('useThemeMode')
    expect(hookExports.useThemeMode).toBe(hookExports.useThemeSnapshot)
  })

  it('exports all platform shell components', () => {
    expect(rootExports).toHaveProperty('AdminShell')
    expect(rootExports).toHaveProperty('TopNav')
    expect(rootExports).toHaveProperty('SideMenu')
    expect(rootExports).toHaveProperty('AppBreadcrumb')
    expect(rootExports).toHaveProperty('TabWorkspace')
    expect(rootExports).toHaveProperty('PageContainer')
    expect(rootExports).toHaveProperty('PermissionGate')
    expect(rootExports).toHaveProperty('ExceptionState')
  })
})
