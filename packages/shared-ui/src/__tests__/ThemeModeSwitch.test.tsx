import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeModeSwitch } from '../components'

describe('ThemeModeSwitch', () => {
  it('renders external copy and emits the selected preference', async () => {
    const onChange = vi.fn()

    render(
      <ThemeModeSwitch
        preference="system"
        label="涓婚"
        systemText="璺熼殢绯荤粺"
        lightText="娴呰壊"
        darkText="娣辫壊"
        ariaLabel="鍒囨崲涓婚妯″紡"
        onChange={onChange}
      />,
    )

    expect(screen.getByText('涓婚')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '璺熼殢绯荤粺' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: '娴呰壊' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: '娣辫壊' })).toHaveAttribute('aria-checked', 'false')

    await fireEvent.click(screen.getByRole('radio', { name: '娣辫壊' }))

    expect(onChange).toHaveBeenCalledWith('dark')
  })

  it('forwards custom className and DOM attributes to the radiogroup root', () => {
    const onChange = vi.fn()

    render(
      <ThemeModeSwitch
        preference="light"
        label="涓婚"
        systemText="绯荤粺"
        lightText="娴呰壊"
        darkText="娣辫壊"
        onChange={onChange}
        className="custom-switch"
        data-testid="switch"
        data-track="theme"
      />,
    )

    const root = screen.getByTestId('switch')

    expect(root).toHaveClass('inline-grid', 'gap-2', 'custom-switch')
    expect(root).toHaveAttribute('data-track', 'theme')
    expect(root).toHaveAttribute('role', 'radiogroup')
  })

  it('keeps controlled radio semantics while composing external click handlers', async () => {
    const onChange = vi.fn()
    const onClick = vi.fn()

    render(
      <ThemeModeSwitch
        preference="light"
        label="Theme"
        systemText="System"
        lightText="Light"
        darkText="Dark"
        onChange={onChange}
        onClick={onClick}
        data-testid="switch"
      />,
    )

    const group = screen.getByTestId('switch')
    const darkOption = screen.getByRole('radio', { name: 'Dark' })

    expect(group).toHaveAttribute('role', 'radiogroup')
    expect(darkOption).toHaveAttribute('aria-checked', 'false')

    await fireEvent.click(darkOption)

    expect(onChange).toHaveBeenCalledWith('dark')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
