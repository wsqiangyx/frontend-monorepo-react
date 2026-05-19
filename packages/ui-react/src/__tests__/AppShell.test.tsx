import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppShell } from '../components'

describe('AppShell', () => {
  it('renders children', () => {
    render(<AppShell>body</AppShell>)

    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('forwards root className, style and DOM attributes', () => {
    render(
      <AppShell
        className="custom-shell"
        data-testid="shell"
        data-track="dashboard"
        style={{ opacity: 0.8 }}
      >
        body
      </AppShell>,
    )

    const shell = screen.getByTestId('shell')

    expect(shell).toHaveClass('repo-app-shell', 'custom-shell')
    expect(shell).toHaveAttribute('data-track', 'dashboard')
    expect(shell).toHaveStyle({ opacity: '0.8' })
  })
})
