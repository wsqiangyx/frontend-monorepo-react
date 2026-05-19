import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../provider'

describe('ThemeProvider', () => {
  it('writes theme attributes to documentElement', () => {
    render(
      <ThemeProvider themeName="default" preference="system" mode="dark">
        <div>content</div>
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.themeName).toBe('default')
    expect(document.documentElement.dataset.themeMode).toBe('dark')
    expect(document.documentElement.dataset.themePreference).toBe('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.getElementById('repo-theme-style')?.textContent).toContain(
      '--theme-color-bg-page: #141414;',
    )
  })
})
