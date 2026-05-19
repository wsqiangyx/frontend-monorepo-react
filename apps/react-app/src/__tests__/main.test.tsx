import { afterEach, describe, expect, it, vi } from 'vitest'

describe('main startup contract', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('starts the MSW worker before bootstrapping when enabled in dev', async () => {
    const start = vi.fn().mockResolvedValue(undefined)
    const bootstrap = vi.fn()
    const order: string[] = []

    vi.stubEnv('DEV', true)
    vi.stubEnv('VITE_ENABLE_MSW', 'true')

    vi.doMock('@repo/mock/browser', () => ({
      worker: {
        start: vi.fn(async (...args: unknown[]) => {
          order.push('worker')
          return start(...args)
        }),
      },
    }))

    vi.doMock('@/bootstrap', () => ({
      bootstrap: () => {
        order.push('bootstrap')
        bootstrap()
      },
    }))

    await import('../main')

    await vi.waitFor(() => {
      expect(start).toHaveBeenCalledWith({ onUnhandledRequest: 'bypass' })
      expect(bootstrap).toHaveBeenCalledTimes(1)
      expect(order).toEqual(['worker', 'bootstrap'])
    })
  })
})
