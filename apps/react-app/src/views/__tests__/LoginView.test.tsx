import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginView from '../LoginView'
import { useAuthStore } from '@/platform'
import { renderWithProviders } from '@/test/test-utils'
import { ROUTES } from '@/constants/routes'

function renderLoginView() {
  return renderWithProviders(
    <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginView />} />
        <Route path={ROUTES.DASHBOARD} element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginView', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { user: { id: '', username: '' }, status: 'anonymous' },
      error: null,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders login form', () => {
    renderLoginView()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('submits credentials and navigates to dashboard on success', async () => {
    const login = vi.fn().mockResolvedValue(undefined)

    useAuthStore.setState({ login } as unknown as Parameters<typeof useAuthStore.setState>[0])

    renderLoginView()

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await vi.waitFor(() => {
      expect(login).toHaveBeenCalledWith({ username: 'admin', password: 'password' })
    })
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('displays error message when login fails', async () => {
    const login = vi.fn().mockRejectedValue(new Error('Invalid credentials'))

    useAuthStore.setState({ login } as unknown as Parameters<typeof useAuthStore.setState>[0])

    renderLoginView()

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
