import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricCard, StatusTag } from '../components'

describe('MetricCard', () => {
  it('renders trend semantics onto the root element', () => {
    render(
      <MetricCard
        label="User trend"
        value={12}
        trend="up"
        trendText="Up compared with yesterday"
        hint="Last 24 hours"
      />,
    )

    const card = screen.getByTestId('metric-card')

    expect(card).toHaveAttribute('data-trend', 'up')
    expect(card).toHaveTextContent('Up compared with yesterday')
  })

  it('does not allow external attrs to override trend semantics', () => {
    render(<MetricCard label="Theme adoption" value={42} trend="down" data-trend="up" />)

    expect(screen.getByTestId('metric-card')).toHaveAttribute('data-trend', 'down')
  })
})

describe('StatusTag', () => {
  it('renders tone semantics onto the root element', () => {
    render(<StatusTag status="warning" label="Pending" />)

    expect(screen.getByText('Pending')).toHaveAttribute('data-status', 'warning')
  })

  it('does not allow external attrs to override status semantics', () => {
    render(
      <StatusTag status="success" label="Ready" data-testid="status-tag" data-status="error" />,
    )

    expect(screen.getByTestId('status-tag')).toHaveAttribute('data-status', 'success')
  })
})
