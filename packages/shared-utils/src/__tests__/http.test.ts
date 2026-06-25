import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, createHttpClient } from '../http'

// 使用自定义 fetch mock 来测试 ky 客户端
// ky 底层使用 fetch，所以我们 mock globalThis.fetch

function createMockResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

let fetchMock: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) | null = null

afterEach(() => {
  fetchMock = null
  vi.restoreAllMocks()
})

function mockFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  fetchMock = impl
  vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
    if (fetchMock) return fetchMock(input, init)
    return Promise.resolve(new Response(null, { status: 500 }))
  })
}

describe('createHttpClient', () => {
  it('should return an object with get/post/put/patch/delete methods', () => {
    const api = createHttpClient({ baseURL: 'http://localhost/api' })
    expect(typeof api.get).toBe('function')
    expect(typeof api.post).toBe('function')
    expect(typeof api.put).toBe('function')
    expect(typeof api.patch).toBe('function')
    expect(typeof api.delete).toBe('function')
  })

  it('injects bearer token into outgoing requests', async () => {
    let authHeader: string | null = null
    mockFetch(async (input) => {
      // ky 将 Request 对象作为第一个参数传入
      const req = input instanceof Request ? input : new Request(input)
      authHeader = req.headers.get('Authorization')
      return createMockResponse({
        success: true,
        code: 'OK',
        data: null,
        message: 'ok',
        timestamp: new Date().toISOString(),
      })
    })

    const api = createHttpClient({
      baseURL: 'http://localhost/api',
      getToken: () => 'token-123',
    })

    await api.get('/user')

    expect(authHeader).toBe('Bearer token-123')
  })

  it('throws ApiError when backend returns an unsuccessful platform response', async () => {
    mockFetch(async () =>
      createMockResponse({
        success: false,
        code: 'BUSINESS_FAILED',
        data: null,
        message: 'business failed',
        timestamp: new Date().toISOString(),
      }),
    )

    const api = createHttpClient({ baseURL: 'http://localhost/api' })

    await expect(api.get('/business-error')).rejects.toMatchObject({
      name: 'ApiError',
      code: 'BUSINESS_FAILED',
      message: 'business failed',
    })
  })

  it('returns payload data when backend returns success:true and code OK', async () => {
    mockFetch(async () =>
      createMockResponse({
        success: true,
        code: 'OK',
        data: { id: 'u-1', name: 'Mock User' },
        message: 'ok',
        timestamp: new Date().toISOString(),
      }),
    )

    const api = createHttpClient({ baseURL: 'http://localhost/api' })

    await expect(api.get<{ id: string; name: string }>('/users')).resolves.toEqual({
      id: 'u-1',
      name: 'Mock User',
    })
  })

  it('throws ApiError when request fails at transport layer', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })

    const api = createHttpClient({ baseURL: 'http://localhost/api' })

    await expect(api.get('/network-error')).rejects.toThrow()
  })
})

describe('ApiError', () => {
  it('should carry code, message, and status', () => {
    const err = new ApiError('NOT_FOUND', 'Not Found', 404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toBe('Not Found')
    expect(err.status).toBe(404)
    expect(err.name).toBe('ApiError')
  })
})
