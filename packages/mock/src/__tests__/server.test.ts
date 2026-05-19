import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { server } from '../server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('mock server', () => {
  it('exports an MSW server instance', () => {
    expect(server).toBeDefined()
    expect(typeof server.listen).toBe('function')
  })

  it('serves the mock user response contract', async () => {
    const response = await fetch('http://localhost/api/user')
    const body = (await response.json()) as {
      success: boolean
      code: string
      data: { id: number; name: string; email: string }
      message: string
      timestamp: string
    }

    expect(response.ok).toBe(true)
    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(body.data.name).toBe('Mock User')
    expect(body.data.email).toBe('mock@example.com')
    expect(body.message).toBe('ok')
    expect(body.timestamp).toBeTruthy()
  })

  it('serves the chart data response contract', async () => {
    const response = await fetch('http://localhost/api/chart/data')
    const body = (await response.json()) as {
      success: boolean
      code: string
      data: Array<{ month: string; value: number }>
      message: string
      timestamp: string
    }

    expect(response.ok).toBe(true)
    expect(body.success).toBe(true)
    expect(body.code).toBe('OK')
    expect(body.data).toHaveLength(6)
    expect(body.data[0]).toEqual({ month: 'Jan', value: 30 })
    expect(body.message).toBe('ok')
    expect(body.timestamp).toBeTruthy()
  })
})
