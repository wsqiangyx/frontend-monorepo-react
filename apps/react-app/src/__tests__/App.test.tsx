import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import App from '@/App'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/platform'
import { applyThemeToDocument } from '@repo/design-tokens/theme'
import { renderWithProviders } from '@/test/test-utils'

function stubBrowserLocale(locale: 'zh-CN' | 'en-US') {
  vi.stubGlobal('navigator', {
    language: locale,
    languages: [locale],
  })
}

function stubMatchMedia(initialDark = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? initialDark : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

function stubLocation(pathname: string) {
  vi.stubGlobal('location', {
    pathname,
    href: `http://localhost${pathname}`,
    origin: 'http://localhost',
    assign: vi.fn(),
    replace: vi.fn(),
  })
}

describe('App', () => {
  beforeEach(() => {
    localStorage.removeItem('repo-theme-mode')
    localStorage.removeItem('repo-theme-preference')
    localStorage.removeItem('repo-locale')
    document.documentElement.removeAttribute('data-theme-name')
    document.documentElement.removeAttribute('data-theme-mode')
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('lang')

    stubBrowserLocale('zh-CN')
    stubMatchMedia(false)
    stubLocation('/login')

    useLocaleStore.getState().resetForTest()
    useThemeStore.getState().resetForTest()
    useAuthStore.setState({
      session: { user: { id: '', username: '' }, status: 'anonymous' },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows login view when not authenticated', () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(document.documentElement.dataset.themeMode).toBe('light')
  })

  it('preloads the theme before the app is mounted', () => {
    localStorage.setItem('repo-theme-preference', 'dark')
    useThemeStore.getState().resetForTest()

    const themeState = useThemeStore.getState()

    applyThemeToDocument({
      themeName: themeState.themeName,
      preference: themeState.preference,
      resolvedMode: themeState.mode,
    })

    expect(document.documentElement.dataset.themeMode).toBe('dark')
    expect(document.documentElement.dataset.themePreference).toBe('dark')
    expect(document.getElementById('repo-theme-style')?.textContent).toContain(
      '--theme-color-bg-page: #141414;',
    )
  })
})
