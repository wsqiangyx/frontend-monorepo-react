import { describe, expect, it } from 'vitest'
import { createTab, closeTab, findTabByKey, type WorkspaceTab } from '../workspace-tabs'

describe('createTab', () => {
  it('should create a tab with defaults', () => {
    const tab = createTab({ key: 'home', routeName: 'Home', path: '/home' })
    expect(tab.title).toBe('home')
    expect(tab.closable).toBe(true)
    expect(tab.affix).toBe(false)
    expect(tab.keepAlive).toBe(false)
  })

  it('should allow overrides', () => {
    const tab = createTab({
      key: 'home',
      routeName: 'Home',
      path: '/home',
      title: 'Home Page',
      closable: false,
      affix: true,
      keepAlive: true,
      query: { tab: '1' },
      menuKey: 'home-menu',
    })
    expect(tab.title).toBe('Home Page')
    expect(tab.closable).toBe(false)
    expect(tab.affix).toBe(true)
    expect(tab.keepAlive).toBe(true)
    expect(tab.query).toEqual({ tab: '1' })
    expect(tab.menuKey).toBe('home-menu')
  })
})

describe('closeTab', () => {
  const tabs: WorkspaceTab[] = [
    {
      key: 'home',
      routeName: 'Home',
      path: '/home',
      title: 'Home',
      closable: false,
      affix: true,
      keepAlive: false,
    },
    {
      key: 'settings',
      routeName: 'Settings',
      path: '/settings',
      title: 'Settings',
      closable: true,
      affix: false,
      keepAlive: false,
    },
    {
      key: 'profile',
      routeName: 'Profile',
      path: '/profile',
      title: 'Profile',
      closable: true,
      affix: false,
      keepAlive: true,
    },
  ]

  it('should remove closable tab by key', () => {
    const result = closeTab(tabs, 'settings')
    expect(result).toHaveLength(2)
    expect(result.map((t) => t.key)).toEqual(['home', 'profile'])
  })

  it('should not remove non-closable tab', () => {
    const result = closeTab(tabs, 'home')
    expect(result).toHaveLength(3)
  })

  it('should handle missing key', () => {
    const result = closeTab(tabs, 'nonexistent')
    expect(result).toHaveLength(3)
  })
})

describe('findTabByKey', () => {
  const tabs: WorkspaceTab[] = [
    {
      key: 'home',
      routeName: 'Home',
      path: '/home',
      title: 'Home',
      closable: true,
      affix: false,
      keepAlive: false,
    },
    {
      key: 'settings',
      routeName: 'Settings',
      path: '/settings',
      title: 'Settings',
      closable: true,
      affix: false,
      keepAlive: false,
    },
  ]

  it('should find existing tab', () => {
    expect(findTabByKey(tabs, 'home')?.title).toBe('Home')
  })

  it('should return undefined for missing key', () => {
    expect(findTabByKey(tabs, 'nonexistent')).toBeUndefined()
  })
})
