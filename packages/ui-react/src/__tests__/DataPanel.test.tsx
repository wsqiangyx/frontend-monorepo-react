import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataPanel } from '../components'

describe('DataPanel', () => {
  it('prioritizes loading over empty and content', () => {
    render(
      <DataPanel loading loadingText="加载中" empty emptyContent={<div>empty</div>}>
        <div>content</div>
      </DataPanel>,
    )

    expect(screen.getByText('加载中')).toBeInTheDocument()
    expect(screen.getByText('加载中')).toHaveAttribute('aria-busy', 'true')
  })

  it('forwards root DOM attributes', () => {
    render(
      <DataPanel data-testid="panel" data-track="metrics">
        <div>content</div>
      </DataPanel>,
    )

    expect(screen.getByTestId('panel')).toHaveAttribute('data-track', 'metrics')
  })
})
