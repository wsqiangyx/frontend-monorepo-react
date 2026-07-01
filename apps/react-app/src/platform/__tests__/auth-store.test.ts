import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../auth-store'

const mockPost = vi.fn()
const mockGet = vi.fn()

vi.mock('@/services/shared', () => ({
  api: {
    post: (...args: unknown[]) => mockPost(...args),
    get: (...args: unknown[]) => mockGet(...args),
  },
}))

vi.mock('@/services/http-client', () => ({
  registerTokenProvider: vi.fn(),
  setOnUnauthorized: vi.fn(),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: { user: { id: '', username: '' }, status: 'anonymous' },
      error: null,
    })
    mockPost.mockReset()
    mockGet.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in anonymous state', () => {
    const state = useAuthStore.getState()
    expect(state.session.status).toBe('anonymous')
    expect(state.error).toBeNull()
  })

  it('login sets authenticated session on success', async () => {
    mockPost.mockResolvedValueOnce({
      token: 'mock-token-operator',
      userId: 'operator-id',
      role: 'operator',
    })

    await useAuthStore.getState().login({ username: 'operator', password: 'any' })

    const state = useAuthStore.getState()
    expect(state.session.status).toBe('authenticated')
    expect(state.session.token).toBe('mock-token-operator')
    expect(state.session.user.username).toBe('operator')
    expect(state.session.user.roles).toEqual(['operator'])
    expect(state.error).toBeNull()
  })

  it('login sets error and throws on failure', async () => {
    mockPost.mockRejectedValueOnce(new Error('Invalid credentials'))

    await expect(
      useAuthStore.getState().login({ username: 'operator', password: 'wrong' }),
    ).rejects.toThrow('Invalid credentials')

    const state = useAuthStore.getState()
    expect(state.session.status).toBe('anonymous')
    expect(state.error).toBe('Invalid credentials')
  })

  it('logout resets to anonymous session', async () => {
    useAuthStore.setState({
      session: {
        user: { id: 'u1', username: 'operator' },
        status: 'authenticated',
        token: 'token',
      },
    })
    mockPost.mockResolvedValueOnce(undefined)

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.session.status).toBe('anonymous')
    expect(state.session.token).toBeUndefined()
  })

  it('fetchProfile updates user and keeps existing token', async () => {
    useAuthStore.setState({
      session: {
        user: { id: 'u1', username: 'operator' },
        status: 'authenticated',
        token: 'existing-token',
      },
    })
    mockGet.mockResolvedValueOnce({
      id: 'u1',
      name: 'Updated Name',
      email: 'updated@example.com',
      role: 'operator',
    })

    await useAuthStore.getState().fetchProfile()

    const state = useAuthStore.getState()
    expect(state.session.user.displayName).toBe('Updated Name')
    expect(state.session.user.username).toBe('Updated Name')
    expect(state.session.token).toBe('existing-token')
  })

  it('fetchProfile sets error and throws on failure', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    await expect(useAuthStore.getState().fetchProfile()).rejects.toThrow('Network error')

    expect(useAuthStore.getState().error).toBe('Network error')
  })
})
